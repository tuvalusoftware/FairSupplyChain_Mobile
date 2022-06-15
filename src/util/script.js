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

const STORAGE = Constants.STORAGE;
function cryptoRandomString({length}) {
  return crypto.randomBytes(length).toString('hex');
}

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
    console.log('entropy', Buffer.from(entropy, 'hex'));
    let rootKey = await HaskellShelley.Bip32PrivateKey.from_bip39_entropy(
      Buffer.from(entropy, 'hex'),
      Buffer.from(''),
    );
    console.log('rootKey', rootKey);
    let bytes = await rootKey.as_bytes();
    console.log('bytes', bytes);
    entropy = null;
    const encryptedRootKey = await encryptWithPassword(password, bytes);
    console.log('encryptedRootKey0', encryptedRootKey);
    rootKey.free();
    rootKey = null;

    await setStorage(STORAGE.encryptedKey, encryptedRootKey);
    await setNetwork({
      id: NETWORK_ID.mainnet,
      node: NODE.mainnet,
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
    console.log('white end');
    return true;
    // password = null;
  } catch (err) {
    console.log('createWallet Error', err);
  }
};

export const createAccount = async (name, password, accountIndex = 0) => {
  console.log('createAccount', accountIndex);
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
  const encryptedRootKey = await getStorage(STORAGE.encryptedKey);
  let accountKey = {};
  try {
    let decryptedHex = await decryptWithPassword(password, encryptedRootKey);
    accountKey = await HaskellShelley.Bip32PrivateKey.from_bytes(
      Buffer.from(decryptedHex, 'hex'),
    );
    accountKey = await accountKey.derive(harden(1852));
    accountKey = await accountKey.derive(harden(1815));
    accountKey = await accountKey.derive(harden(parseInt(accountIndex, 10)));
  } catch (e) {
    console.log('requestAccountKey error', e);
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
  console.log('decryptedHex', decryptedHex);
  return decryptedHex;
};

const harden = num => {
  return 0x80000000 + num;
};

export async function blockfrostRequest(endpoint, headers, body, signal) {
  const network = await getNetwork();
  let result;
  console.log('blockfrostRequest 1', network);
  while (!result || result.status_code === 500) {
    console.log('blockfrostRequest 2', result);
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
  if (network) {
    network = JSON.parse(network);
  }
  return network;
};

export const getAddress = async () => {
  const currentAccount = await getCurrentAccount();
  console.log('currentAccount', currentAccount);
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
  //   console.log('accounts', network);
  return accountToNetworkSpecific(accounts[currentAccountIndex], network);
};

export const getCurrentAccountIndex = async () =>
  getStorage(STORAGE.currentAccount);

export const getAccounts = async () => {
  let a = await getStorage(STORAGE.accounts);
  return JSON.parse(a);
};

export const setNetwork = async network => {
  return setStorage(STORAGE.network, JSON.stringify(network));
};

export const switchAccount = async accountIndex => {
  console.log('switchAccount', accountIndex);
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
  unitName: 'ADA',
  amount: '0',
};

export const getBalance = async () => {
  const currentAccount = await getCurrentAccount();
  console.log('getBalance', currentAccount.paymentAddr);
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
  console.log('num', num);
  let singleUnit = await HaskellShelley.BigNum.from_str(
    '1' + '0'.repeat(decimals),
  );
  singleUnit = await singleUnit.to_str();
  const wholeUnits = num / singleUnit;
  const fractionalUnits = num % singleUnit;
  return (
    wholeUnits.toString() +
    '.' +
    fractionalUnits.toString().padStart(decimals, '')
  );
};
