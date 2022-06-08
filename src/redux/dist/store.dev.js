'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true,
});
exports['default'] = void 0;

var _toolkit = require('@reduxjs/toolkit');

var _contract = _interopRequireDefault(require('./reducer/contract'));

var _message = _interopRequireDefault(require('./reducer/message'));

var _model = _interopRequireDefault(require('./reducer/model'));

var _settings = _interopRequireDefault(require('./reducer/settings'));

var _walletConnect = _interopRequireDefault(require('./reducer/walletConnect'));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var _default = (0, _toolkit.configureStore)({
    reducer: {
        contract: _contract['default'],
        message: _message['default'],
        model: _model['default'],
        settings: _settings['default'],
        walletConnect: _walletConnect['default'],
    },
    middleware: function middleware(getDefaultMiddleware) {
        return getDefaultMiddleware({
            serializableCheck: false,
        });
    },
});

exports['default'] = _default;
