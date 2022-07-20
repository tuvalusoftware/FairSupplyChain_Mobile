import {get, omitBy, sortBy} from 'lodash';
import {keccak256} from 'js-sha3';
import {_flatten} from './flatten';

const isKeyOrValueUndefined = (value, key) =>
  value === undefined || key === undefined;

const flattenHashArray = data => {
  const flattenedData = omitBy(_flatten(data), isKeyOrValueUndefined);
  return Object.keys(flattenedData).map(k => {
    const obj = {};
    obj[k] = flattenedData[k];
    return keccak256(JSON.stringify(obj));
  });
};

/**
 * @param {Object} document
 */
export const digestDocument = document => {
  // Prepare array of hashes from filtered data
  const hashedDataArray = get(document, 'privacy.obfuscatedData', []);

  // Prepare array of hashes from visible data
  const unhashedData = get(document, 'data');
  const hashedUnhashedDataArray = flattenHashArray(unhashedData);

  // Combine both array and sort them to ensure determinism
  const combinedHashes = hashedDataArray.concat(hashedUnhashedDataArray);
  const sortedHashes = sortBy(combinedHashes);

  // Finally, return the digest of the entire set of data
  return keccak256(JSON.stringify(sortedHashes));
};
