'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true,
});
exports['default'] = exports.settingsActions = exports.settingsSlice = void 0;

var _toolkit = require('@reduxjs/toolkit');

var _settings = _interopRequireDefault(require('../constants/settings'));

var _themes = _interopRequireDefault(require('../../themes'));

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

var UPDATE_THEME = _settings['default'].UPDATE_THEME;
var themeId = window.localStorage.getItem('themeId');
var theme = _themes['default'][0];

if (themeId) {
    theme = _themes['default'].find(function (item) {
        return item.id === Number(themeId);
    });
}

var initialSettings = {
    isRequesting: false,
    isFetching: false,
    theme: theme ? theme : _themes['default'][0],
};
var settingsSlice = (0, _toolkit.createSlice)({
    name: 'settings',
    initialState: initialSettings,
    reducers: _defineProperty({}, UPDATE_THEME, function (state, action) {
        var payload = action.payload;
        window.localStorage.setItem('themeId', payload.theme.id);
        return _objectSpread({}, state, {
            theme: payload.theme,
        });
    }),
});
exports.settingsSlice = settingsSlice;
var settingsActions = settingsSlice.actions;
exports.settingsActions = settingsActions;
var _default = settingsSlice.reducer;
exports['default'] = _default;
