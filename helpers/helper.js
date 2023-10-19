import _ from 'lodash';
import toast from 'react-hot-toast';

import { UNITS } from './defaults';

const omitEmptyKeys = (obj, excludes = []) =>
  _.omitBy(obj, (value, key) => {
    return (
      !excludes.includes(key) &&
      (value === '' || value === undefined || value === null)
    );
  });

const omitNullishKeys = (obj, excludes = []) =>
  _.omitBy(obj, (value, key) => {
    return !excludes.includes(key) && !value;
  });

const pickExactObjKeys = (obj, pickObj) => _.pick(pickObj, Object.keys(obj));

const bytesFormat = (x) => {
  let index = 0;
  let value = parseInt(x, 10) || 0;

  while (value >= 1024 && ++index) {
    value = value / 1024;
  }

  return value.toFixed(value < 10 && index > 0 ? 1 : 0) + ' ' + UNITS[index];
};

const validateDropzoneSingleFile = (rejectedFiles, maxSize) => {
  const rejectedFile = rejectedFiles[0];
  if (rejectedFile) {
    const {
      errors: [{ code }],
      file: { name },
    } = rejectedFile;
    switch (code) {
      case 'file-too-large': {
        toast.error(`${name} is larger than ${bytesFormat(maxSize)}`);

        break;
      }
      default:
        break;
    }
  }
};

const stringBool = {
  true: true,
  false: false,
};

export {
  omitEmptyKeys,
  omitNullishKeys,
  pickExactObjKeys,
  validateDropzoneSingleFile,
  stringBool,
};
