import Constants, {NODE} from './Constants';
import {version} from '../../package.json';

export default {
  api: {
    ipfs: 'https://ipfs.blockfrost.dev/ipfs',
    base: (node = NODE.mainnet) => node,
    header: {['dummy']: version},
    key: (network = 'mainnet') => ({
      project_id: Constants.apiKey[network],
    }),
    price: (currency = 'usd') =>
      fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=${currency}`,
      )
        .then(res => res.json())
        .then(res => res.cardano[currency]),
  },
};
