'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true,
});
exports['default'] =
    exports.walletConnectActions =
    exports.walletConnectSlice =
    exports.initialWalletConnect =
    exports.bridge =
        void 0;

var _walletConnect = _interopRequireDefault(require('../constants/walletConnect'));

var _client = _interopRequireDefault(require('@walletconnect/client'));

var _toolkit = require('@reduxjs/toolkit');

var _api = require('../../scripts/api');

var _reducers;

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys(source, true).forEach(function (key) {
                _defineProperty(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
            ownKeys(source).forEach(function (key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
        }
    }
    return target;
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
        obj[key] = value;
    }
    return obj;
}

var UPDATE_CONNECTOR = _walletConnect['default'].UPDATE_CONNECTOR,
    UPDATE_ADDRESS = _walletConnect['default'].UPDATE_ADDRESS,
    UPDATE_ACCOUNTS = _walletConnect['default'].UPDATE_ACCOUNTS,
    UPDATE_CHAIN = _walletConnect['default'].UPDATE_CHAIN,
    UPDATE_ASSETS = _walletConnect['default'].UPDATE_ASSETS,
    UPDATE_DATA = _walletConnect['default'].UPDATE_DATA,
    RESET = _walletConnect['default'].RESET,
    DEPLOY_CHANGE = _walletConnect['default'].DEPLOY_CHANGE;
var bridge = 'https://bridge.walletconnect.org';
exports.bridge = bridge;
var connector = new _client['default']({
    bridge: bridge,
});
var initialWalletConnect = {
    connector: null,
    address: '',
    chain: _api.ChainType.TestNet,
    assets: [],
    accounts: [],
    deployChange: 0,
};
exports.initialWalletConnect = initialWalletConnect;

if (connector._connected) {
    exports.initialWalletConnect = initialWalletConnect = _objectSpread({}, initialWalletConnect, {
        connector: connector,
        address: connector.accounts[0],
        accounts: connector.accounts,
    });
}

var walletConnectSlice = (0, _toolkit.createSlice)({
    name: 'walletConnect',
    initialState: initialWalletConnect,
    reducers:
        ((_reducers = {}),
        _defineProperty(_reducers, UPDATE_CONNECTOR, function (state, action) {
            var payload = action.payload;
            state.connector = payload.connector;
            return state;
        }),
        _defineProperty(_reducers, UPDATE_ADDRESS, function (state, action) {
            var payload = action.payload;
            state.address = payload.address;
            return state;
        }),
        _defineProperty(_reducers, UPDATE_ACCOUNTS, function (state, action) {
            var payload = action.payload;
            state.accounts = payload.accounts;
            return state;
        }),
        _defineProperty(_reducers, UPDATE_CHAIN, function (state, action) {
            var payload = action.payload;
            state.chain = payload.chain;
            return state;
        }),
        _defineProperty(_reducers, UPDATE_ASSETS, function (state, action) {
            var payload = action.payload;
            state.assets = payload.assets;
            return state;
        }),
        _defineProperty(_reducers, UPDATE_DATA, function (state, action) {
            var payload = action.payload;
            return _objectSpread({}, state, {}, payload.data);
        }),
        _defineProperty(_reducers, RESET, function () {
            return {
                connector: null,
                address: '',
                chain: _api.ChainType.TestNet,
                assets: [],
                accounts: [],
                deployChange: 0,
            };
        }),
        _defineProperty(_reducers, DEPLOY_CHANGE, function (state) {
            state.deployChange = state.deployChange + 1;
            return state;
        }),
        _reducers),
});
exports.walletConnectSlice = walletConnectSlice;
var walletConnectActions = walletConnectSlice.actions;
exports.walletConnectActions = walletConnectActions;
var _default = walletConnectSlice.reducer;
exports['default'] = _default;
