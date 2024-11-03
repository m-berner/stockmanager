/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {useModaldialogStore} from '@/stores/modaldialog'
import {storeToRefs} from 'pinia'

export const useVueLibrary = () => {
  const validators = {
    // commaCurrencyString2: (v: string) => {
    //   const found = v.match(/^0$|^\d*(,?\d{1,2})\s[€|$]$/g)
    //   return found !== null ? true : 'A comma formatted currency value is required.'
    // },
    // commaCurrencyString5: (v: string) => {
    //   const found = v.match(/^0$|^\d*(,?\d{1,5})\s[€|$]$/g)
    //   return found !== null ? true : 'A comma formatted currency value is required.'
    // },
    // dottedNumber2: (vstr: string) => {
    //   const found = vstr.match(/^(-)?0$|^(-)?[0-9]\d*(\.?\d{1,2})$/g)
    //   return found !== null ? true : 'A dot formatted number is required.'
    // },
    dottedPositiveNumber2: (vstr: string): boolean | string => {
      const found = vstr.match(/^0$|^[0-9]\d*(\.?\d{1,2})$/g)
      return found !== null ? true : 'A dot formatted positive number is required.'
    },
    dottedPositiveNumber5: (vstr: string): boolean | string => {
      const found = vstr.match(/^0$|^[0-9]\d*(\.?\d{1,5})$/g)
      return found !== null ? true : 'A dot formatted positive number is required.'
    },
    integer: (v: number) => {
      const vstr = v.toString()
      const found = vstr.match(/^(-)?[1-9][0-9]*$/g)
      return found !== null ? true : 'Input is required.'
    },
    positiveInteger: (v: string): boolean | string => {
      if (v === null || v === undefined) {
        return 'Input is required.'
      } else {
        const found = v.match(/^[1-9][0-9]*$/g)
        return found !== null ? true : 'Input is required.'
      }
    },
    isin: (v: string) => {
      if (v === null || v === undefined) {
        return 'Input is required.'
      } else {
        const found = v.match(/^[a-zA-Z]{2}[a-zA-Z0-9]{10}$/g)
        return found !== null ? true : 'Input is required.'
      }
    },
    wkn: (v: string) => {
      const found = v.match(/^[a-hj-np-zA-HJ-NP-Z0-9]{6}$/g)
      return found !== null ? true : 'Length 6 is required. I,O are not allowed.'
    },
    url: (v: string) => {
      const found = v.match(/^[htps]{4,5}:\/\/\S*$/g)
      return found !== null ? true : 'Input is required.'
    },
    isoDate: (v: string) => {
      if (v === null || v === undefined) {
        return 'Input is required.'
      } else {
        const found = v.match(/^([1-2])?[0-9]{3}-(1[0-1]|0?[1-9])-(3[01]|[12][0-9]|0?[1-9])$/g)
        return found !== null ? true : 'Input is required.'
      }
    },
    notEmpty: (v: string) => {
      const found = v.length
      return found > 0 ? true : 'Input is required.'
    },
    positiveNumber: (v: string) => {
      const found = Number.parseFloat(v)
      return found > 0 ? true : 'Input is required.'
    },
    negativeNumber: (v: string) => {
      const found = Number.parseFloat(v)
      return found < 0 ? true : 'Input is required.'
    }
  }
  const resetValidation = (): void => {
    const modaldialog = useModaldialogStore()
    const {_form} = storeToRefs(modaldialog)
    _form.value?.resetValidation()
  }
  return {validators, resetValidation}
}
