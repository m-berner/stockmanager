/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import type {StoreDefinition} from 'pinia'
import {defineStore} from 'pinia'
import {useOnlineStore} from '@/stores/online'
import {useApp} from '@/useApp'

interface IDailychangesStore {
  _progress: boolean
  _search: string
  _tmpChanges: IChange[];
  _tmpChangesWithNoDuplicates: IChange[];
}

const { CONS } = useApp()

export const useDailychangesStore: StoreDefinition<'dailychanges', IDailychangesStore> = defineStore('dailychanges', {
  state: (): IDailychangesStore => {
    return {
      _progress: true,
      _search: '',
      _tmpChanges: [],
      _tmpChangesWithNoDuplicates: []
    }
  },
  getters: {
    // progress: (state: IDailychangesStore) => {
    //   return state._progress
    // },
    search: (state: IDailychangesStore) => {
      return state._search
    },
    tmpChanges: (state: IDailychangesStore) => {
      return state._tmpChanges
    },
    tmpChangesWithNoDuplicates: (state: IDailychangesStore) => {
      return state._tmpChangesWithNoDuplicates
    }
  },
  actions: {
    setTmpChanges(value: IChange[]): void {
      this._tmpChanges = value
    },
    setTmpChangesWithNoDuplicates(value: IChange[]): void {
      this._tmpChangesWithNoDuplicates = value
    },
    searchDailyChanges(): void {
      if (this.search !== null && this._search.length > 2) {
        const online = useOnlineStore()
        const matches = online.changes.filter((item: IChange) => {
          return (
            item.key.toLowerCase().includes(this._search) ||
            item.key.toUpperCase().includes(this._search) ||
            item.key.includes(this._search)
          )
        })
        const elemId: string = matches[0].key ?? ''
        const elem = document.getElementById(elemId)
        if (elem !== null) {
          elem.scrollIntoView()
        }
      }
    },
    async getDailyChanges(mode): Promise<void> {
      console.log('DAILYCHANGES: getDailyChanges')
      const online = useOnlineStore()
      online.setChanges([])
      this.setTmpChanges([]) // let tmpChanges: IChange[] = []
      this.setTmpChangesWithNoDuplicates([]) // let tmpChangesWithNoDuplicates: IChange[] = []
      // const onMessage = (ev: MessageEvent) => {
      //   console.info('DAILYCHANGES: onMessage', ev.type)
      //   switch (ev.type) {
      //     case CONS.FETCH_API.ANSWER__DAILY_CHANGES:
      //       tmpChanges = [...tmpChanges, ...ev.data]
      //       break
      //     case CONS.FETCH_API.FINISH__DAILY_CHANGES:
      //       tmpChangesWithNoDuplicates = [...new Map(tmpChanges.map((obj: IChange) => [obj.key, obj])).values()]
      //       tmpChangesWithNoDuplicates.sort((a: IChange, b: IChange) => {
      //         return a.value.change - b.value.change
      //       })
      //       online.setChanges(tmpChangesWithNoDuplicates)
      //       break
      //     case CONS.FETCH_API.ANSWER__DAILY_CHANGES_ALL:
      //       tmpChanges = [...tmpChanges, ...ev.data]
      //       break
      //     case CONS.FETCH_API.FINISH__DAILY_CHANGES_ALL:
      //       tmpChangesWithNoDuplicates = [...new Map(tmpChanges.map((obj: IChange) => [obj.key, obj])).values()]
      //       tmpChangesWithNoDuplicates.sort((a: IChange, b: IChange) => {
      //         return a.value.change - b.value.change
      //       })
      //       online.setChanges(tmpChangesWithNoDuplicates)
      //       break
      //   }
      // }
      this._progress = true
      // if (!browser.runtime.onMessage.hasListener(onMessage)) {
      //   browser.runtime.onMessage.addListener(onMessage)
      // }
      if (mode === CONS.DIALOGS.DAILYCHANGES) {
        for (let i = 0; i < CONS.SERVICES.tgate.CHS.length; i++) {
          await browser.runtime.sendMessage({
            type: CONS.FETCH_API.ASK__DAILY_CHANGES,
            data: CONS.SERVICES.tgate.CHS[i]
          })
        }
        await browser.runtime.sendMessage({
          type: CONS.FETCH_API.END__DAILY_CHANGES,
          data: []
        })
      } else {
        for (let i = 0; i < CONS.SERVICES.tgate.CHB.length; i++) {
          await browser.runtime.sendMessage({
            type: CONS.FETCH_API.ASK__DAILY_CHANGES_ALL,
            data: CONS.SERVICES.tgate.CHB[i]
          })
        }
        await browser.runtime.sendMessage({
          type: CONS.FETCH_API.END__DAILY_CHANGES_ALL
        })
      }
      this._progress = false
    }
  }
})

console.log('--- dailychanges.js ---')
