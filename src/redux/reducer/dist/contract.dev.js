'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true,
});
exports['default'] = exports.contractSlice = void 0;

var _toolkit = require('@reduxjs/toolkit');

var _contract = _interopRequireDefault(require('../constants/contract'));

var _reducers;

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
        obj[key] = value;
    }
    return obj;
}

var REQUEST_CONTRACTS = _contract['default'].REQUEST_CONTRACTS,
    REQUEST_CONTRACTS_SUCCESS = _contract['default'].REQUEST_CONTRACTS_SUCCESS,
    REQUEST_CONTRACTS_FAILURE = _contract['default'].REQUEST_CONTRACTS_FAILURE;
var contractSlice = (0, _toolkit.createSlice)({
    name: 'contract',
    initialState: {
        isRequesting: false,
        isFetching: false,
        listContract: [],
    },
    reducers:
        ((_reducers = {}),
        _defineProperty(_reducers, REQUEST_CONTRACTS, function (state) {
            state.isRequesting = true;
        }),
        _defineProperty(_reducers, REQUEST_CONTRACTS_SUCCESS, function (state) {
            state.isRequesting = false;
        }),
        _defineProperty(_reducers, REQUEST_CONTRACTS_FAILURE, function (state) {
            state.isRequesting = false;
        }),
        _reducers),
}); // export const {} = contractSlice.actions;

exports.contractSlice = contractSlice;
var _default = contractSlice.reducer;
exports['default'] = _default;
