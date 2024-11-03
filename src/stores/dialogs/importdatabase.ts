/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {defineStore, type StoreDefinition} from 'pinia'
import {useRecordsStore} from '@/stores/records'
import {useAppLibrary} from '@/libraries/useApp'
import {useConstants} from '@/libraries/useConstants'
import {useModaldialogStore} from '../modaldialog'

interface IImportdatabaseStore {
  _file_name: File[]
}

const CONS = useConstants()
const {notice} = useAppLibrary()

export const useImportdatabaseStore: StoreDefinition<'importdatabase', IImportdatabaseStore> = defineStore('importdatabase', {
  state: (): IImportdatabaseStore => {
    return {
      _file_name: []
    }
  },
  getters: {
    fileName: (state: IImportdatabaseStore) => {
      return state._file_name
    }
  },
  actions: {
    setFileName(value: File[]): void {
      this._file_name = value
    },
    async import(): Promise<void> {
      console.log('IMPORTDATABASE: import')
      const records = useRecordsStore()
      const modaldialog = useModaldialogStore()
      // NOTE: only database version 21.0 or newer could be restored
      await records.cleanStoreAndDatabase()
      // read backup file into records store bkup object
      await new Promise((resolve, reject) => {
        const onError = (err: ErrorEvent): void => {
          notice([err.message])
          reject(err.message)
        }
        const onLoadBackup = (): void => {
          console.log('HEADERBAR: onLoadBackup')
          if (typeof fr.result === 'string') {
            const bkupObject: IBackup = JSON.parse(fr.result)
            if (bkupObject.sm.cDBVersion < CONS.DB.MINVERSION) {
              notice(['HEADERBAR:onLoadBackup', 'Invalid backup file version'])
              reject(new Error('Invalid backup file version'))
            } else {
              records.setBkupObject(bkupObject)
              resolve('Backup file loaded successfully!')
            }
          } else {
            notice(['HOMEPAGE:onLoadBackup', 'Could not read backup file'])
            reject(new Error('Could not read backup file!'))
          }
        }
        const fr: FileReader = new FileReader()
        fr.readAsText(this._file_name, 'UTF-8')
        fr.addEventListener(CONS.EVENTS.LOAD, onLoadBackup, CONS.SYSTEM.ONCE)
        fr.addEventListener(CONS.EVENTS.ERR, onError, CONS.SYSTEM.ONCE)
      })
      records.loadBkupObjectIntoStore()
      records.updateWrapper(1)
      const result = await records.loadStoreIntoDatabase()
      if (result !== '') {
        console.info('IMPORTDATABASE: onLoad', result)
        modaldialog.toggleVisibility()
      } else {
        notice(['IMPORTDATABASE: onLoad', result as string])
      }
    }

  }
})

console.log('--- importdatabase.js ---')
