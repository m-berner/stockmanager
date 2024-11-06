<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <router-view/>
</template>

<script lang="ts" setup>
import {useRecordsStore} from '@/stores/records'
import {useSettingsStore} from '@/stores/settings'
import {useOnlineStore} from '@/stores/online'
import {useAddstockStore} from '@/stores/dialogs/addstock'
import {onBeforeMount, toRaw} from 'vue'
import {useTheme} from 'vuetify'
import {useApp} from '@/useApp'
import {useRuntimeStore} from '@/stores/runtime'
import {useDailychangesStore} from '@/stores/dialogs/dailychanges'

const settings = useSettingsStore()
const records = useRecordsStore()
const online = useOnlineStore()
const runtime = useRuntimeStore()
const theme = useTheme()
const { CONS } = useApp()

onBeforeMount(() => {
  console.log('APP: onBeforeMount')
  return new Promise(async (resolve): Promise<void> => {
    const {notice} = useApp()
    // NOTE: set app instance or background instance
    const onStorageChange = async (
      change: Record<string, browser.storage.StorageChange>
    ): Promise<void> => {
      console.info('BACKGROUND: onStorageChange', change)
      return new Promise(async (resolve) => {
        switch (true) {
          case change.service?.oldValue !== undefined:
            settings.setServiceStoreOnly({
              name: change.service.newValue.name,
              url: change.service.newValue.url,
            })
            await browser.runtime.sendMessage({
              type: CONS.SEND_API.PUT__SERVICE,
              data: {name: change.service.newValue.name, url: change.service.newValue.url},
            })
            break
          case change.skin?.oldValue !== undefined:
            theme.global.name.value = change.skin.newValue // NOTE: change theme app instance
            break
          case change.indexes?.oldValue !== undefined:
            settings.setIndexesStoreOnly(change.indexes.newValue)
            break
          case change.materials?.oldValue !== undefined:
            settings.setMaterialsStoreOnly(change.materials.newValue)
            break
          case change.exchanges?.oldValue.length < change.exchanges?.newValue.length:
            await browser.runtime.sendMessage({
              type: CONS.FETCH_API.ASK__EXCHANGES_DATA,
              data: change.exchanges.newValue,
            })
            break
          case change.exchanges?.oldValue.length > change.exchanges?.newValue.length:
            settings.setExchangesStoreOnly(change.exchanges.newValue)
            break
        }
        resolve()
      })
    }
    const onMessage = async (ev: MessageEvent): Promise<void> => {
      console.info('APP: onMessage', ev)
      return new Promise(async (resolve) => {
        const addstock = useAddstockStore()
        const dailychanges = useDailychangesStore()
        const codes: string[] = []
        const materials: Array<[string, unknown]> = []
        const indexes: Array<[string, unknown]> = []
        if (ev.data === undefined) {
          notice(['Sorry, no data arrived'])
        } else {
          switch (ev.type) {
            case CONS.FETCH_API.ANSWER__DAILY_CHANGES:
              dailychanges.setTmpChanges([...dailychanges.tmpChanges, ...ev.data])
              break
            case CONS.FETCH_API.FINISH__DAILY_CHANGES:
              dailychanges.setTmpChangesWithNoDuplicates([
                ...toRaw(
                  new Map(
                    dailychanges.tmpChanges.map((obj: IChange) => [obj.key, obj])
                  ).values()
                ),
              ])
              dailychanges.tmpChangesWithNoDuplicates.sort((a: IChange, b: IChange) => {
                return a.value.change - b.value.change
              })
              online.setChanges(dailychanges.tmpChangesWithNoDuplicates)
              break
            case CONS.FETCH_API.ANSWER__DAILY_CHANGES_ALL:
              dailychanges.setTmpChanges([...dailychanges.tmpChanges, ...ev.data])
              break
            case CONS.FETCH_API.FINISH__DAILY_CHANGES_ALL:
              dailychanges.setTmpChangesWithNoDuplicates([
                ...toRaw(
                  new Map(
                    dailychanges.tmpChanges.map((obj: IChange) => [obj.key, obj])
                  ).values()
                ),
              ])
              dailychanges.tmpChangesWithNoDuplicates.sort((a: IChange, b: IChange) => {
                return a.value.change - b.value.change
              })
              online.setChanges(dailychanges.tmpChangesWithNoDuplicates)
              break
            case CONS.FETCH_API.ANSWER__COMPANY_DATA:
              addstock.setCompany(ev.data.company)
              addstock.setWKN(ev.data.wkn.toUpperCase())
              addstock.setSymbol(ev.data.symbol.toUpperCase())
              break
            case CONS.FETCH_API.ANSWER__EXCHANGES_DATA:
              for (let i = 0; i < ev.data.length; i++) {
                online.setExchangesItem({key: ev.data[i].key, value: ev.data[i].value})
                codes.push(ev.data[i].key)
              }
              settings.setExchangesStoreOnly(codes)
              break
            case CONS.FETCH_API.ANSWER__MATERIAL_DATA:
              for (let i = 0; i < ev.data.length; i++) {
                materials.push([ev.data[i].key, ev.data[i].value])
              }
              online.setMaterials(new Map(materials))
              break
            case CONS.FETCH_API.ANSWER__INDEX_DATA:
              for (let i = 0; i < ev.data.length; i++) {
                indexes.push([ev.data[i].key, ev.data[i].value])
              }
              online.setIndexes(new Map(indexes))
              break
            case CONS.FETCH_API.ANSWER__MIN_RATE_MAX:
              online.setMinRateMax(ev.data)
              runtime.setShowPartialDrawer(false)
              records.updatePage(records.stocks.active_page)
              records.setDrawerDepot()
              break
            case CONS.FETCH_API.ANSWER__DATES_DATA:
              runtime.updateDatesForPage(records.stocks.active_page - 1, false)
              for (let i = 0; i < ev.data.length; i++) {
                online.dates.set(ev.data[i].key, ev.data[i].value)
                const rec =
                  records.stocks.active[records._getActiveStocksIndexById(ev.data[i].key)]
                if (rec.cMeetingDay < ev.data[i].value.gm) {
                  rec.cMeetingDay = ev.data[i].value.gm
                }
                if (rec.cQuarterDay < ev.data[i].value.qf) {
                  rec.cQuarterDay = ev.data[i].value.qf
                }
                if (
                  rec.cMeetingDay < ev.data[i].value.gm ||
                  rec.cQuarterDay < ev.data[i].value.qf
                ) {
                  await records.updateStock(rec)
                }
              }
              break
          }
          resolve()
        }
      })
    }

    if (!browser.storage.onChanged.hasListener(onStorageChange)) {
      // noinspection JSDeprecatedSymbols
      browser.storage.onChanged.addListener(onStorageChange)
    }
    if (!browser.runtime.onMessage.hasListener(onMessage)) {
      // noinspection JSDeprecatedSymbols
      browser.runtime.onMessage.addListener(onMessage)
    }
    await browser.runtime.sendMessage({
      type: CONS.SEND_API.PUT__SERVICE,
      data: toRaw(settings.service),
    })
    await browser.runtime.sendMessage({
      type: CONS.FETCH_API.ASK__EXCHANGES_DATA,
      data: toRaw(settings.exchanges),
    })
    await browser.runtime.sendMessage({
      type: CONS.FETCH_API.ASK__MATERIAL_DATA,
      data: [],
    })
    await browser.runtime.sendMessage({
      type: CONS.FETCH_API.ASK__INDEX_DATA,
      data: [],
    })
    /* Listen to onKeyup, onKeyDown:
     * - set the service to tgate if ctrl + alt + t is pressed.
     * - clear the local storage if ctrl + alt + r is pressed.
     */
    const keyStrokeController: string[] = []
    const onKeyDown = (ev: KeyboardEvent): void => {
      keyStrokeController.push(ev.key)
      if (
        keyStrokeController.includes('Control') &&
        keyStrokeController.includes('Alt') &&
        ev.key === 't'
      ) {
        settings.setServiceStoreOnly({
          name: 'tgate',
          url: CONS.SERVICES.tgate.HOME,
        })
      }
      if (
        keyStrokeController.includes('Control') &&
        keyStrokeController.includes('Alt') &&
        ev.key === 'r'
      ) {
        browser.storage.local.clear()
      }
    }
    const onKeyUp = (ev: KeyboardEvent): void => {
      keyStrokeController.splice(keyStrokeController.indexOf(ev.key), 1)
    }
    window.addEventListener('keydown', onKeyDown, false)
    window.addEventListener('keyup', onKeyUp, false)
    //
    window.addEventListener(
      'beforeunload',
      () => {
        browser.tabs
          .query({url: 'about:addons'})
          .then((foundTabs) => {
            if (foundTabs.length > 0) {
              browser.tabs
                .remove(foundTabs[0].id ?? 0)
                .then()
                .catch((err: ErrorEvent) => {
                  notice([err.message])
                })
            }
            records.dbi.close()
          })
          .catch((err: ErrorEvent) => {
            notice([err.message])
          })
      },
      false
    )
    await settings.loadStorageIntoStore(theme)
    await records.openDatabase()
    await records.loadDatabaseIntoStore()
    resolve(null)
  })
})

console.log('--- App.vue setup ---')
</script>
