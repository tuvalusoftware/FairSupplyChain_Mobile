import AsyncStorage from '@react-native-async-storage/async-storage';
export const NODE = {
  mainnet: 'https://cardano-mainnet.blockfrost.io/api/v0',
  testnet: 'https://cardano-testnet.blockfrost.io/api/v0',
};

export const NETWORK_ID = {
  mainnet: 'mainnet',
  testnet: 'testnet',
};
export const getStorage = key => AsyncStorage.getItem(key);
export const setStorage = (key, value) => AsyncStorage.setItem(key, value);
const Constants = {
  STATUS: ['Verified', 'Verifying', 'Rejected'],
  LIST_TYPE_DOCUMENT: [
    'Certificate of Analysis (COA)',
    'Packing List',
    'Certificate of Soil Management',
    'Certificate Of Organic Farming',
    'Certificate of Inspection',
    'Certificate of Origin',
    'Bill of Lading (BOL)',
    'Insurance Certificate Other',
  ],
  LIST_ISSUER: [
    'Ghana Food & Drug',
    'Ministry of Food & Agriculture',
    'Ghana Irrigation Development Authority (GIDA)',
    'Agricultural law in Ghana',
    'Other',
  ],
  STORAGE: {
    encryptedKey: 'encryptedKey',
    network: 'network',
    currency: 'currency',
    accounts: 'accounts',
    currentAccount: 'currentAccount',
  },
  network: {
    mainnet: 1,
    testnet: 0,
  },
  apiKey: {
    mainnet: 'mainnetUxZ1oGgRnSRbrsR0DUuyNY2hCL5tGqBy',
    testnet: 'testnetJe6W7FM1Jwkh0PxNMZt9OzNND3T1mS1T',
  },
  getStorage,
  setStorage,
  isManager: role => role === 3,
};
export default Constants;
