'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true,
});
exports['default'] = exports.messageActions = exports.messageSlice = void 0;

var _toolkit = require('@reduxjs/toolkit');

var _message = _interopRequireDefault(require('../constants/message'));

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

var SHOW_MESSAGE = _message['default'].SHOW_MESSAGE,
    HIDE_MESSAGE = _message['default'].HIDE_MESSAGE;
var messageSlice = (0, _toolkit.createSlice)({
    name: 'message',
    initialState: {
        open: false,
        message: '',
        autoHideDuration: 6000,
        severity: 'info',
    },
    reducers:
        ((_reducers = {}),
        _defineProperty(_reducers, SHOW_MESSAGE, function (state, action) {
            var payload = action.payload;
            return (state = _objectSpread({}, state, {
                open: true,
                message: payload.message,
                autoHideDuration: payload.autoHideDuration ? payload.autoHideDuration : 6000,
                severity: payload.severity || 'info',
            }));
        }),
        _defineProperty(_reducers, HIDE_MESSAGE, function (state) {
            return (state = _objectSpread({}, state, {
                open: false,
                message: '',
                autoHideDuration: 6000,
            }));
        }),
        _reducers),
});
exports.messageSlice = messageSlice;
var messageActions = messageSlice.actions;
exports.messageActions = messageActions;
var _default = messageSlice.reducer;
exports['default'] = _default;
