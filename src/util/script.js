/* eslint-disable no-undef */
/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */

import * as HaskellShelley from '../libs/HaskellShelley';
import Constants, {getStorage, NODE, setStorage, NETWORK_ID} from './Constants';
import crypto from 'crypto';
import provider from '../util/provider';
import {mnemonicToEntropy} from 'react-native-bip39';
import {
  getTransactions,
  getWrappedDocumentsContent,
} from '../libs/fuixlabs-documentor';
// import {getDidDocument} from '../libs/fuixlabs-documentor/utils/document';
import {_pullNFTs} from '../libs/fuixlabs-documentor/rest/client.rest';
import {deepUnsalt} from '../libs/fuixlabs-documentor/utils/data';
import {searchDocument} from '../libs/fuixlabs-documentor/rest/client.rest';
import * as CardanoMessageSigning from '../libs/CardanoMessageSigning';
import {CLIENT_PATH} from '../libs/fuixlabs-documentor/rest/client.path';
import axios from 'axios';
import {Alert} from 'react-native';
const _getTransactions = getTransactions;
const STORAGE = Constants.STORAGE;
function cryptoRandomString({length}) {
  return crypto.randomBytes(length).toString('hex');
}

export const compact = (string = '', lg = 20, position) => {
  if (position === 'end') {
    return string.substr(0, lg) + '...';
  }
  if (string?.length > lg) {
    return (
      string.substring(0, lg / 2) +
      '...' +
      string.substring(string.length - lg / 2, string.length)
    );
  }

  return string;
};

export const encryptWithPassword = async (password, rootKeyBytes) => {
  const rootKeyHex = Buffer.from(rootKeyBytes, 'hex').toString('hex');
  const passwordHex = Buffer.from(password).toString('hex');
  const salt = cryptoRandomString({length: 2 * 16});
  const nonce = cryptoRandomString({length: 2 * 6});
  //   console.log({passwordHex, salt, nonce, rootKeyHex});
  return HaskellShelley.encrypt_with_password(
    passwordHex,
    salt,
    nonce,
    rootKeyHex,
  );
};
export const createWallet = async (name, seedPhrase, password) => {
  try {
    let entropy = mnemonicToEntropy(seedPhrase);
    let rootKey = await HaskellShelley.Bip32PrivateKey.from_bip39_entropy(
      Buffer.from(entropy, 'hex'),
      Buffer.from(''),
    );
    let bytes = await rootKey.as_bytes();
    entropy = null;
    const encryptedRootKey = await encryptWithPassword(password, bytes);
    rootKey.free();
    rootKey = null;

    await setStorage(STORAGE.encryptedKey, encryptedRootKey);
    await setNetwork({
      id: NETWORK_ID.testnet,
      node: NODE.testnet,
    });
    // await setStorage(
    //   STORAGE.network,
    //   JSON.stringify({
    //     id: NETWORK_ID.mainnet,
    //     node: NODE.mainnet,
    //   }),
    // );

    await setStorage(STORAGE.currency, 'usd');
    const index = await createAccount(name, password);
    console.log('createAccount', index);
    //check for sub accounts
    // let searchIndex = 1;
    // while (true) {
    //   let {paymentKey, stakeKey} = await requestAccountKey(
    //     password,
    //     searchIndex,
    //   );
    //   console.log('white', 1);
    //   paymentKey = await paymentKey.to_public();
    //   stakeKey = await stakeKey.to_public();
    //   console.log('white', 2);
    //   console.log('white', 3);
    //   let f_p = await HaskellShelley.StakeCredential.from_keyhash(
    //     await paymentKey.hash(),
    //   );
    //   let s_p = await HaskellShelley.StakeCredential.from_keyhash(
    //     await stakeKey.hash(),
    //   );

    //   let paymentAddr = await HaskellShelley.BaseAddress.new(
    //     Constants.network.mainnet,
    //     f_p,
    //     s_p,
    //   );
    //   console.log('white', 4);
    //   paymentAddr = await paymentAddr.to_address();
    //   console.log('white', 5);
    //   paymentAddr = await paymentAddr.to_bech32();
    //   console.log('paymentAddr', paymentAddr);
    //   const transactions = await blockfrostRequest(
    //     `/addresses/${paymentAddr}/transactions`,
    //   );

    //   console.log('transactions', searchIndex, transactions);
    //   if (transactions && !transactions.error && transactions.length >= 1) {
    //     createAccount(`Account ${searchIndex}`, password, searchIndex);
    //   } else {
    //     console.log('break co loi roi');
    //     break;
    //   }
    //   searchIndex++;
    // }
    await switchAccount(index);
    return true;
    // password = null;
  } catch (err) {
    console.log('createWallet Error', err);
  }
};

export const createAccount = async (name, password, accountIndex = 0) => {
  const index = accountIndex;
  let {accountKey, paymentKey, stakeKey} = await requestAccountKey(
    password,
    index,
  );
  let firstParams = await accountKey.to_public();
  firstParams = await firstParams.as_bytes();
  const publicKey = Buffer.from(firstParams).toString('hex'); // BIP32 Public key
  const paymentKeyPub = await paymentKey.to_public();
  const stakeKeyPub = await stakeKey.to_public();

  accountKey.free();
  paymentKey.free();
  stakeKey.free();
  accountKey = null;
  paymentKey = null;
  stakeKey = null;
  let _paymentKey = await paymentKeyPub.hash();
  const paymentKeyHash = Buffer.from(
    await _paymentKey.to_bytes(),
    'hex',
  ).toString('hex');
  let _stakeKeyPub = await stakeKeyPub.hash();
  const stakeKeyHash = Buffer.from(
    await _stakeKeyPub.to_bytes(),
    'hex',
  ).toString('hex');
  //   let mainnet = await HaskellShelley.NetworkInfo;
  //   console.log('mainnet', mainnet);

  let f_p = await HaskellShelley.StakeCredential.from_keyhash(
    await paymentKeyPub.hash(),
  );
  let s_p = await HaskellShelley.StakeCredential.from_keyhash(
    await stakeKeyPub.hash(),
  );
  let paymentAddrMainnet = await HaskellShelley.BaseAddress.new(
    Constants.network.mainnet,
    f_p,
    s_p,
  );
  paymentAddrMainnet = await paymentAddrMainnet.to_address();
  paymentAddrMainnet = await paymentAddrMainnet.to_bech32();

  let rewardAddrMainnet = await HaskellShelley.RewardAddress.new(
    Constants.network.mainnet,
    s_p,
  );
  rewardAddrMainnet = await rewardAddrMainnet.to_address();
  rewardAddrMainnet = await rewardAddrMainnet.to_bech32();

  let paymentAddrTestnet = await HaskellShelley.BaseAddress.new(
    Constants.network.testnet,
    f_p,
    s_p,
  );
  paymentAddrTestnet = await paymentAddrTestnet.to_address();
  paymentAddrTestnet = await paymentAddrTestnet.to_bech32();

  let rewardAddrTestnet = await HaskellShelley.RewardAddress.new(
    Constants.network.testnet,
    s_p,
  );
  rewardAddrTestnet = await rewardAddrTestnet.to_address();
  rewardAddrTestnet = await rewardAddrTestnet.to_bech32();

  const networkDefault = {
    lovelace: null,
    minAda: 0,
    assets: [],
    history: {confirmed: [], details: {}},
  };

  const newAccount = {
    [index]: {
      index,
      publicKey,
      paymentKeyHash,
      stakeKeyHash,
      name,
      [NETWORK_ID.mainnet]: {
        ...networkDefault,
        paymentAddr: paymentAddrMainnet,
        rewardAddr: rewardAddrMainnet,
      },
      [NETWORK_ID.testnet]: {
        ...networkDefault,
        paymentAddr: paymentAddrTestnet,
        rewardAddr: rewardAddrTestnet,
      },
      avatar: Math.random().toString(),
    },
  };

  await setStorage(STORAGE.accounts, JSON.stringify({...newAccount}));
  return index;
};

export const requestAccountKey = async (password, accountIndex) => {
  // console.log('password, accountIndex', password, accountIndex);
  const encryptedRootKey = await getStorage(STORAGE.encryptedKey);
  let accountKey = {};
  try {
    let decryptedHex = await decryptWithPassword(password, encryptedRootKey);
    if (!decryptedHex) {
      throw new Error('Incorrect Password');
    }
    accountKey = await HaskellShelley.Bip32PrivateKey.from_bytes(
      Buffer.from(decryptedHex, 'hex'),
    );
    accountKey = await accountKey.derive(harden(1852));
    accountKey = await accountKey.derive(harden(1815));
    accountKey = await accountKey.derive(harden(parseInt(accountIndex, 10)));
  } catch (e) {
    console.log('requestAccountKey error', e);
    throw new Error(e.message);
  }
  let paymentKey = await accountKey.derive(0);
  paymentKey = await paymentKey.derive(0);
  paymentKey = await paymentKey.to_raw_key();
  let stakeKey = await accountKey.derive(2);
  stakeKey = await stakeKey.derive(0);
  stakeKey = await stakeKey.to_raw_key();
  return {
    accountKey,
    paymentKey,
    stakeKey,
  };
};

export const decryptWithPassword = async (password, encryptedKeyHex) => {
  const passwordHex = Buffer.from(password).toString('hex');
  let decryptedHex;
  try {
    decryptedHex = await HaskellShelley.decrypt_with_password(
      passwordHex,
      encryptedKeyHex,
    );
  } catch (err) {
    console.log('decryptWithPassword error', err);
  }
  // console.log('decryptedHex', decryptedHex);
  return decryptedHex;
};

const harden = num => {
  return 0x80000000 + num;
};

export async function blockfrostRequest(endpoint, headers, body, signal) {
  const network = await getNetwork();
  let result;
  // console.log('blockfrostRequest 1', network);
  while (!result || result.status_code === 500) {
    // console.log('blockfrostRequest 2', result);
    if (result) {
      await delay(100);
    }
    const rawResult = await fetch(provider.api.base(network.node) + endpoint, {
      headers: {
        ...provider.api.key(network.id),
        ...provider.api.header,
        ...headers,
        'Cache-Control': 'no-cache',
      },
      method: body ? 'POST' : 'GET',
      body,
      signal,
    });
    result = await rawResult.json();
  }

  return result;
}

export const getNetwork = async () => {
  let network = await getStorage(STORAGE.network);
  // console.log('getNetwork', network);
  if (network) {
    return JSON.parse(network);
  }
  return {
    id: NETWORK_ID.mainnet,
    node: NODE.mainnet,
  };
};

export const getAddress = async () => {
  const currentAccount = await getCurrentAccount();
  // console.log('currentAccount', currentAccount);
  let f_p = await HaskellShelley.Address.from_bech32(
    currentAccount.paymentAddr,
  );
  f_p = await f_p.to_bytes();
  const paymentAddr = await Buffer.from(f_p, 'hex').toString('hex');
  return paymentAddr;
};

export const getCurrentAccount = async () => {
  const currentAccountIndex = await getCurrentAccountIndex();
  const accounts = await getAccounts();
  const network = await getNetwork();
  if (!accounts) {
    return null;
  }
  return accountToNetworkSpecific(accounts[currentAccountIndex], network);
};

export const getCurrentAccountIndex = async () =>
  getStorage(STORAGE.currentAccount);

export const getAccounts = async () => {
  let a = await getStorage(STORAGE.accounts);
  if (a) {
    return JSON.parse(a);
  }
  return null;
};

export const setNetwork = async network => {
  return setStorage(STORAGE.network, JSON.stringify(network));
};

export const switchAccount = async accountIndex => {
  await setStorage(STORAGE.currentAccount, accountIndex.toString());
  //   const address = await getAddress();
  return true;
};
const accountToNetworkSpecific = (account, network) => {
  const assets = account[network.id].assets.length
    ? account[network.id].assets
    : [asset];
  const lovelace = account[network.id].lovelace;
  const history = account[network.id].history;
  const minAda = account[network.id].minAda;
  const collateral = account[network.id].collateral;
  const recentSendToAddresses = account[network.id].recentSendToAddresses;
  const paymentAddr = account[network.id].paymentAddr;
  const rewardAddr = account[network.id].rewardAddr;

  return {
    ...account,
    paymentAddr,
    rewardAddr,
    assets,
    lovelace,
    minAda,
    collateral,
    history,
    recentSendToAddresses,
  };
};

export const fetchPrice = async currency => {
  let price = await provider.api.price(currency);
  return price;
};

export const asset = {
  decimals: 6,
  name: 'ADA',
  unitName: '₳',
  amount: '0',
};

export const getBalance = async () => {
  const currentAccount = await getCurrentAccount();
  if (!currentAccount) {
    return {...asset};
  }
  const result = await blockfrostRequest(
    `/addresses/${currentAccount.paymentAddr}`,
  );
  if (result.error) {
    console.log('getBalance error', result.error);
    return {...asset};
    // if (result.status_code === 400);
    // else if (result.status_code === 500) throw APIError.InternalError;
    // else return HaskellShelley.Value.new(HaskellShelley.BigNum.from_str('0'));
  }
  const value = await assetsToValue(result.amount);
  let coin = await value.coin();
  coin = await coin.to_str();
  let amount = await formatBigNumWithDecimals(coin, 6);
  return {
    ...asset,
    amount,
  };
};
export const assetsToValue = async assets => {
  const multiAsset = await HaskellShelley.MultiAsset.new();
  const lovelace = assets.find(_asset => _asset.unit === 'lovelace');
  const policies = [
    ...new Set(
      assets
        .filter(_asset => _asset.unit !== 'lovelace')
        .map(_asset => _asset.unit.slice(0, 56)),
    ),
  ];
  policies.forEach(async policy => {
    const policyAssets = assets.filter(
      _asset => _asset.unit.slice(0, 56) === policy,
    );
    const assetsValue = await HaskellShelley.Assets.new();
    policyAssets.forEach(async _asset => {
      assetsValue.insert(
        await HaskellShelley.AssetName.new(
          Buffer.from(_asset.unit.slice(56), 'hex'),
        ),
        await HaskellShelley.BigNum.from_str(_asset.quantity),
      );
    });
    multiAsset.insert(
      await HaskellShelley.ScriptHash.from_bytes(Buffer.from(policy, 'hex')),
      assetsValue,
    );
  });
  const value = await HaskellShelley.Value.new(
    await HaskellShelley.BigNum.from_str(lovelace ? lovelace.quantity : '0'),
  );
  if (assets.length > 1 || !lovelace) {
    value.set_multiasset(multiAsset);
  }
  return value;
};

export const formatBigNumWithDecimals = async (num, decimals) => {
  let singleUnit = await HaskellShelley.BigNum.from_str(
    '1' + '0'.repeat(decimals),
  );
  singleUnit = await singleUnit.to_str();
  const wholeUnits = Math.floor(num / singleUnit);
  const fractionalUnits = num % singleUnit;
  return (
    wholeUnits.toString() +
    '.' +
    fractionalUnits.toString().padStart(decimals, '')
  );
};

export const loginAuthServer = async (params, access_token) => {
  let result;
  try {
    const rawResult = await axios.post(Constants.authServer + 'login', params, {
      withCredentials: true,
      header: {
        'Content-Type': 'application/json',
        Cookie: `access_token=${access_token}`,
      },
    });
    result = rawResult;
  } catch (err) {
    console.log(err);
    throw Error('Login Auth Failed ' + (err?.message || err));
  }
  if (!result) {
    throw Error('Login Auth Failed no result');
  }
  return result;
};
//need to update lib
export const getRandomNumber = async () => {
  let result;
  try {
    const rawResult = await fetch(Constants.authServer + 'getRandomNumber', {
      method: 'GET',
    });
    result = await rawResult.json();
  } catch (err) {
    console.log('getRandomNumber error', err);
    throw Error('Get Random Number faild ' + err.message);
  }
  if (!result) {
    throw Error('Get Random Number faild');
  }
  return result;
};
//need to update lib
export const verifyAccessToken = async access_token => {
  // console.log('access_token', access_token);
  let result;
  try {
    const rawResult = await fetch(Constants.authServer + 'getRandomNumber', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `access_token=${access_token}`,
      },
    });
    result = await rawResult.json();
  } catch (err) {
    console.log('verifyAccessToken error', err.request._headers);
    throw new Error(err.message);
  }
  return result;
};

export const signData = async (
  address,
  payload,
  password,
  accountIndex = 0,
) => {
  try {
    let {paymentKey, stakeKey} = await requestAccountKey(
      password,
      accountIndex,
    );
    let typeAddress = await getTypeAddress(address);
    const accountKey = typeAddress === 'payment' ? paymentKey : stakeKey;
    const publicKey = await accountKey.to_public();

    const protectedHeaders = await CardanoMessageSigning.HeaderMap.new();
    await protectedHeaders.set_algorithm_id(
      await CardanoMessageSigning.Label.from_algorithm_id(
        await CardanoMessageSigning.AlgorithmId.EdDSA,
      ),
    );
    await protectedHeaders.set_key_id(await publicKey.as_bytes());
    await protectedHeaders.set_header(
      await CardanoMessageSigning.Label.new_text('address'),
      await CardanoMessageSigning.CBORValue.new_bytes(
        Buffer.from(address, 'hex'),
      ),
    );
    const protectedSerialized =
      await CardanoMessageSigning.ProtectedHeaderMap.new(protectedHeaders);
    const unprotectedHeaders = await CardanoMessageSigning.HeaderMap.new();
    const headers = await CardanoMessageSigning.Headers.new(
      protectedSerialized,
      unprotectedHeaders,
    );
    const builder = await CardanoMessageSigning.COSESign1Builder.new(
      headers,
      Buffer.from(payload, 'hex'),
      false,
    );
    const toSign = await (await builder.make_data_to_sign()).to_bytes();
    const signedSigStruc = await (await accountKey.sign(toSign)).to_bytes();
    const coseSign1 = await builder.build(signedSigStruc);

    stakeKey.free();
    stakeKey = null;
    paymentKey.free();
    paymentKey = null;

    return Buffer.from(await coseSign1.to_bytes(), 'hex').toString('hex');
  } catch (err) {
    throw Error(err.message);
  }
};

export const signDataCIP30 = async (
  address,
  payload,
  password,
  accountIndex,
) => {
  const keyHash = await extractKeyHash(address);
  const prefix = keyHash.slice(0, 5);
  let {paymentKey, stakeKey} = await requestAccountKey(password, accountIndex);
  const accountKey = prefix === 'hbas_' ? paymentKey : stakeKey;

  const publicKey = accountKey.to_public();
  if (keyHash !== publicKey.hash().to_bech32(prefix)) {
    throw 'DataSignError.ProofGeneration';
  }
  const protectedHeaders = await CardanoMessageSigning.HeaderMap.new();
  await protectedHeaders.set_algorithm_id(
    await CardanoMessageSigning.Label.from_algorithm_id(
      CardanoMessageSigning.AlgorithmId.EdDSA,
    ),
  );
  // protectedHeaders.set_key_id(publicKey.as_bytes()); // Removed to adhere to CIP-30
  await protectedHeaders.set_header(
    await CardanoMessageSigning.Label.new_text('address'),
    await CardanoMessageSigning.CBORValue.new_bytes(
      Buffer.from(address, 'hex'),
    ),
  );
  const protectedSerialized =
    await CardanoMessageSigning.ProtectedHeaderMap.new(protectedHeaders);
  const unprotectedHeaders = await CardanoMessageSigning.HeaderMap.new();
  const headers = await CardanoMessageSigning.Headers.new(
    protectedSerialized,
    unprotectedHeaders,
  );
  const builder = await CardanoMessageSigning.COSESign1Builder.new(
    headers,
    Buffer.from(payload, 'hex'),
    false,
  );
  const toSign = await (await builder.make_data_to_sign()).to_bytes();

  const signedSigStruc = await (await accountKey.sign(toSign)).to_bytes();
  const coseSign1 = await builder.build(signedSigStruc);

  stakeKey.free();
  stakeKey = null;
  paymentKey.free();
  paymentKey = null;

  const key = await CardanoMessageSigning.COSEKey.new(
    await CardanoMessageSigning.Label.from_key_type(
      CardanoMessageSigning.KeyType.OKP,
    ),
  );
  await key.set_algorithm_id(
    await CardanoMessageSigning.Label.from_algorithm_id(
      CardanoMessageSigning.AlgorithmId.EdDSA,
    ),
  );
  await key.set_header(
    await CardanoMessageSigning.Label.new_int(
      await CardanoMessageSigning.Int.new_negative(
        await CardanoMessageSigning.BigNum.from_str('1'),
      ),
    ),
    await CardanoMessageSigning.CBORValue.new_int(
      await CardanoMessageSigning.Int.new_i32(6), //CardanoMessageSigning.CurveType.Ed25519
    ),
  ); // crv (-1) set to Ed25519 (6)
  await key.set_header(
    await CardanoMessageSigning.Label.new_int(
      await CardanoMessageSigning.Int.new_negative(
        await CardanoMessageSigning.BigNum.from_str('2'),
      ),
    ),
    await CardanoMessageSigning.CBORValue.new_bytes(publicKey.as_bytes()),
  ); // x (-2) set to public key

  return {
    signature: Buffer.from(coseSign1.to_bytes()).toString('hex'),
    key: Buffer.from(key.to_bytes()).toString('hex'),
  };
};

export const getTypeAddress = async address => {
  const baseAddr = await HaskellShelley.BaseAddress.from_address(
    await HaskellShelley.Address.from_bytes(Buffer.from(address, 'hex')),
  );
  const rewardAddr = await HaskellShelley.RewardAddress.from_address(
    await HaskellShelley.Address.from_bytes(Buffer.from(address, 'hex')),
  );
  if (baseAddr) {
    return 'payment';
  }
  if (rewardAddr) {
    return 'reward';
  }
  return null;
};

export const extractKeyHash = async address => {
  //TODO: implement for various address types
  if (!(await isValidAddressBytes(Buffer.from(address, 'hex')))) {
    throw 'DataSignError.InvalidFormat';
  }
};

const isValidAddressBytes = async address => {
  const network = await getNetwork();
  try {
    const addr = await HaskellShelley.Address.from_bytes(address);
    let net_id = await addr.network_id();
    if (
      (net_id === 1 && network.id === NETWORK_ID.mainnet) ||
      (net_id === 0 && network.id === NETWORK_ID.testnet)
    ) {
      return true;
    }
    return false;
  } catch (e) {
    console.log('isValidAddressBytes 1', e);
  }
  try {
    const addr = await HaskellShelley.ByronAddress.from_bytes(address);
    let net_id = await addr.network_id();
    if (
      (net_id === 1 && network.id === NETWORK_ID.mainnet) ||
      (net_id === 0 && network.id === NETWORK_ID.testnet)
    ) {
      return true;
    }
    return false;
  } catch (e) {
    console.log('isValidAddressBytes 2', e);
  }
  return false;
};

export const getTransitions = async () => {
  let _access_token = await getStorage(Constants.STORAGE.access_token);
  try {
    let address = await getAddress();
    let transition = await _getTransactions(address, _access_token);
    let data = await getWrappedDocumentsContent(transition, _access_token);
    data = data?.map((item, index) => ({
      ...deepUnsalt(item),
      status: transition[index]?.status,
    }));
    for (let i = 0; i < data.length; i++) {
      // let didDoc = await getDidDocument(data[i].data.fileName, _access_token);
      let {policy} = data[i].mintingNFTConfig;
      let res = await _pullNFTs(
        CLIENT_PATH.PULL_NFTS,
        {policyId: policy?.id},
        _access_token,
      );

      let history = res.data.data.map((item, index) => {
        return item?.onchainMetadata[policy.id][item.assetName]?.timestamp;
      });
      history.sort((a, b) => a - b);
      data[i] = {...data[i], history};
    }
    data.sort((a, b) => b.history[0] - a.history[0]);
    return data;
  } catch (err) {
    console.log('getTransitions', err);
    let message = err.message || err;
    Alert.alert('Error', message, [
      {
        text: '',
        onPress: () => console.log('Ask me later pressed'),
      },
      {
        text: '',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    throw new Error(err.message || err);
  }
};

export const searchTransition = async (
  searchString,
  pageNumber,
  access_token,
) => {
  try {
    let res = await searchDocument(searchString, pageNumber, access_token);
    let transactions = res.data.result;
    if (!transactions || !transactions.length) {
      return [];
    }
    // console.log('transition', transactions[0].data.fileName);
    // let data = await getWrappedDocumentsContent(transactions, access_token);

    let data = transactions?.map((item, index) => ({
      ...deepUnsalt(item),
      status: transactions[index]?.status,
    }));
    for (let i = 0; i < data.length; i++) {
      let {policy} = data[i]?.mintingNFTConfig;
      if (!policy) {
        throw new Error('mintingNFTConfig empty');
      }
      let _res = await _pullNFTs(
        CLIENT_PATH.PULL_NFTS,
        {policyId: policy?.id},
        access_token,
      );

      let history = _res.data.data.map((item, index) => {
        return item?.onchainMetadata[policy.id][item.assetName]?.timestamp;
      });
      history.sort((a, b) => a - b);
      data[i] = {...data[i], history};
    }
    data.sort((a, b) => b.history[0] - a.history[0]);
    return data;
  } catch (err) {
    console.log('searchTransition', err.message);
    let message = err.message || err;
    Alert.alert('Error', message, [
      {
        text: '',
        onPress: () => console.log('Ask me later pressed'),
      },
      {
        text: '',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    throw new Error(err.message);
  }
};
