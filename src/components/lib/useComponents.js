import { useModaldialogStore } from '@/stores/modaldialog';
import { storeToRefs } from 'pinia';
export const useComponents = () => {
    const validators = {
        dottedPositiveNumber2: (vstr) => {
            const found = vstr.match(/^0$|^[0-9]\d*(\.?\d{1,2})$/g);
            return found !== null ? true : 'A dot formatted positive number is required.';
        },
        dottedPositiveNumber5: (vstr) => {
            const found = vstr.match(/^0$|^[0-9]\d*(\.?\d{1,5})$/g);
            return found !== null ? true : 'A dot formatted positive number is required.';
        },
        integer: (v) => {
            const vstr = v.toString();
            const found = vstr.match(/^(-)?[1-9][0-9]*$/g);
            return found !== null ? true : 'Input is required.';
        },
        positiveInteger: (v) => {
            if (v === null || v === undefined) {
                return 'Input is required.';
            }
            else {
                const found = v.match(/^[1-9][0-9]*$/g);
                return found !== null ? true : 'Input is required.';
            }
        },
        isin: (v) => {
            if (v === null || v === undefined) {
                return 'Input is required.';
            }
            else {
                const found = v.match(/^[a-zA-Z]{2}[a-zA-Z0-9]{10}$/g);
                return found !== null ? true : 'Input is required.';
            }
        },
        wkn: (v) => {
            const found = v.match(/^[a-hj-np-zA-HJ-NP-Z0-9]{6}$/g);
            return found !== null ? true : 'Length 6 is required. I,O are not allowed.';
        },
        url: (v) => {
            const found = v.match(/^[htps]{4,5}:\/\/\S*$/g);
            return found !== null ? true : 'Input is required.';
        },
        isoDate: (v) => {
            if (v === null || v === undefined) {
                return 'Input is required.';
            }
            else {
                const found = v.match(/^([1-2])?[0-9]{3}-(1[0-1]|0?[1-9])-(3[01]|[12][0-9]|0?[1-9])$/g);
                return found !== null ? true : 'Input is required.';
            }
        },
        notEmpty: (v) => {
            const found = v.length;
            return found > 0 ? true : 'Input is required.';
        },
        positiveNumber: (v) => {
            const found = Number.parseFloat(v);
            return found > 0 ? true : 'Input is required.';
        },
        negativeNumber: (v) => {
            const found = Number.parseFloat(v);
            return found < 0 ? true : 'Input is required.';
        }
    };
    const resetValidation = () => {
        const modaldialog = useModaldialogStore();
        const { _form } = storeToRefs(modaldialog);
        _form.value?.resetValidation();
    };
    return { validators, resetValidation };
};
