import AsyncStorage from '@react-native-async-storage/async-storage';
import {VALID_DOCUMENT_NAME_TYPE} from '../libs/fuixlabs-documentor/constants/type';
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
export const isCanTrade = name =>
  VALID_DOCUMENT_NAME_TYPE.find(item => item.name === name)?.type === 'trade';
export const clearStorage = async () => {
  await AsyncStorage.clear();
};
const Constants = {
  STATUS: ['Issued', 'Revoked'],
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
  LIST_ISSUER: ['Ghana Food & Drug'],
  FORM_LABEL: {
    name: 'Name',
    title: 'Document title',
    remarks: 'Remarks',
    type: 'Document type',
    fileName: 'File name',
    did: 'DID',
    intention: 'Intention',
    stress: 'Stress',
    address: 'Address',
    additionalAddress: 'Additional address',
    telephoneNumber: 'Telephone number',
    designation: 'Designation',
    date: 'Date',
    shippingInformation: 'Shipping information',
    customInformation: 'Custom information',
    declarationInformation: 'Declaration information',
    certification: 'Certification',
    general: 'General',
    countryName: 'Country name',
    declarationName: 'Declaration name',
    certificationName: 'Certification name',
    signature: 'Signature',
    analysisResults: 'Analysis Results',
    water: 'Water Insoluble Matter',
    nameAddressCountry: "Farmer's name, address and country:",
    farmerName: "Farmer's Name",
    zipCode: 'Zip Code',
    CuSO45H2O: 'CuSO4.5H2O',
  },
  READ_ONLY_FIELD: ['name', 'intention', 'signature'],
  STORAGE: {
    encryptedKey: 'encryptedKey',
    network: 'network',
    currency: 'currency',
    accounts: 'accounts',
    currentAccount: 'currentAccount',
    onboardingViewed: 'onboardingViewed',
    access_token: 'access_token',
    connectedAuthServer: 'connectedAuthServer',
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
  // authServer:
  //   'https://enigmatic-sands-00024.herokuapp.com/18.139.84.180:12000/api/auth/',
  authServer: 'http://18.139.84.180:12000/api/auth/',
  // authServer: 'http://192.168.1.10:15000/api/auth/',
};
export default Constants;
