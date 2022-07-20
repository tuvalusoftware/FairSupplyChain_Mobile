import axiosClient from './client.base';
import axios from 'axios';
import Constants, {getStorage} from '../../../util/Constants';
const BASE_URL = 'http://192.168.2.1:8000/';
export const sendWrappedDocument = async (path, data) => {
  let _access_token = await getStorage(Constants.STORAGE.access_token);
  let config = {
    headers: {
      Cookie: `access_token=${_access_token}`,
    },
  };
  return await axios.post(`${BASE_URL}${path}`, data, config);
};

/**
 * Call cardano service for verifying CNFT
 * @param {String} path
 * @param {Object} data
 * @return {Promise}
 */
export const requestVerifyCNFT = async (path, data) => {
  const {hashOfDocument, policyId} = data;
  let _access_token = await getStorage(Constants.STORAGE.access_token);
  return await axiosClient.get(`${BASE_URL}${path}`, {
    headers: {
      hashOfDocument,
      policyId,
      Cookie: `access_token=${_access_token}`,
    },
  });
};

/**
 * Call cardano service for verifying signature rely on targetHash and public-key
 * @param {String} path
 * @param {Object} data
 * @return {Promise}
 */
export const requestVerifySignature = async (path, data) => {
  const {address, payload, signature} = data;
  return await axiosClient.get(`${BASE_URL}${path}`, {
    headers: {
      address,
      payload,
      signature,
    },
  });
};

/**
 * Check the exists of did's wrapped document through url resolver
 * @param {String} path
 * @param {Object} data
 * @return {Promise}
 */
export const checkExistsDidoWrappedDoc = async (path, data) => {
  let _access_token = await getStorage(Constants.STORAGE.access_token);
  return await axiosClient.get(`${BASE_URL}${path}`, {
    headers: {...data, Cookie: `access_token=${_access_token}`},
  });
};

/**
 * Get did-document by did of wrapped-document
 * @param {String} path
 * @param {Object} data
 * @return {Promise}
 */

export const getDidDocumentByDid = async (path, data) => {
  const {did, exclude} = data;
  let _access_token = await getStorage(Constants.STORAGE.access_token);
  // * only parameter to represent when you need to get a specific object from the DIDController side
  const queryParams = `?only=${exclude}`;
  return await axiosClient.get(`${BASE_URL}${path}${queryParams}`, {
    headers: {
      did: did,
      Cookie: `access_token=${_access_token}`,
    },
  });
};

/**
 * Get list of nfts from cardano service by policy-id
 * @param {String} path
 * @param {Object} data - example: {policyId: 'xxxx'}
 * @return {Promise}
 */
export const _pullNFTs = async (path, data) => {
  const {policyId} = data;
  return await axiosClient.get(`${BASE_URL}${path}`, {
    headers: {
      policyId: policyId,
    },
  });
};

/**
 * @param {String} path
 * @param {Object} data
 * @return {Promise}
 */
export const requestPullTransactions = async (path, data) => {
  let _access_token = await getStorage(Constants.STORAGE.access_token);
  return await axiosClient.get(`${BASE_URL}${path}`, {
    headers: {...data, Cookie: `access_token=${_access_token}`},
  });
};

/**
 * @param {String} path
 * @param {Object} data
 * @return {Promise}
 */
export const requestCreateCredential = async (path, data) => {
  return await axiosClient.post(`${BASE_URL}${path}`, data);
};

/**
 * @param {String} path
 * @param {Object} data
 * @return {Promise}
 */
export const requestPublicKey = async (path, data) => {
  const {address, user} = data;
  return await axiosClient.get(
    `${BASE_URL}${path}?address=${address}&&user=${user}`,
  );
};

/**
 * @param {String} path
 * @param {Object} data
 * @return {Promise}
 */
export const requestUpdateDidDocument = async (path, data) => {
  return await axiosClient.put(`${BASE_URL}${path}`, data);
};
