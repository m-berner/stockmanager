import { defineStore } from 'pinia';
import { useRecordsStore } from '@/stores/records';
import { useAppLibrary } from '@/libraries/useApp';
import { useConstants } from '@/libraries/useConstants';
import { useModaldialogStore } from '../modaldialog';
const CONS = useConstants();
const { notice } = useAppLibrary();
export const useImportdatabaseStore = defineStore('importdatabase', {
    state: () => {
        return {
            _file_name: []
        };
    },
    getters: {
        fileName: (state) => {
            return state._file_name;
        }
    },
    actions: {
        setFileName(value) {
            this._file_name = value;
        },
        async import() {
            console.log('IMPORTDATABASE: import');
            const records = useRecordsStore();
            const modaldialog = useModaldialogStore();
            await records.cleanStoreAndDatabase();
            await new Promise((resolve, reject) => {
                const onError = (err) => {
                    notice([err.message]);
                    reject(err.message);
                };
                const onLoadBackup = () => {
                    console.log('HEADERBAR: onLoadBackup');
                    if (typeof fr.result === 'string') {
                        const bkupObject = JSON.parse(fr.result);
                        if (bkupObject.sm.cDBVersion < CONS.DB.MINVERSION) {
                            notice(['HEADERBAR:onLoadBackup', 'Invalid backup file version']);
                            reject(new Error('Invalid backup file version'));
                        }
                        else {
                            records.setBkupObject(bkupObject);
                            resolve('Backup file loaded successfully!');
                        }
                    }
                    else {
                        notice(['HOMEPAGE:onLoadBackup', 'Could not read backup file']);
                        reject(new Error('Could not read backup file!'));
                    }
                };
                const fr = new FileReader();
                fr.readAsText(this._file_name, 'UTF-8');
                fr.addEventListener(CONS.EVENTS.LOAD, onLoadBackup, CONS.SYSTEM.ONCE);
                fr.addEventListener(CONS.EVENTS.ERR, onError, CONS.SYSTEM.ONCE);
            });
            records.loadBkupObjectIntoStore();
            records.updateWrapper(1);
            const result = await records.loadStoreIntoDatabase();
            if (result !== '') {
                console.info('IMPORTDATABASE: onLoad', result);
                modaldialog.toggleVisibility();
            }
            else {
                notice(['IMPORTDATABASE: onLoad', result]);
            }
        }
    }
});
console.log('--- importdatabase.js ---');
