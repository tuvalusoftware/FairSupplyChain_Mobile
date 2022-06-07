'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true,
});
exports['default'] = exports.modelActions = exports.modelSlice = void 0;

var _toolkit = require('@reduxjs/toolkit');

var _model = _interopRequireDefault(require('../constants/model'));

var _Constant = _interopRequireDefault(require('../../util/Constant'));

var _Example = _interopRequireDefault(require('../../components/WorkBoard/Example'));

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

var UPDATE_MODEL = _model['default'].UPDATE_MODEL,
    UPDATE_INSTANCE = _model['default'].UPDATE_INSTANCE;
var isExample = window.location.pathname === '/example';
var elements = window.localStorage.getItem('elements');

if (elements) {
    elements = JSON.parse(elements);
    elements.forEach(function (item) {
        if (!_Constant['default'].isConnection(item)) {
            item.className = item.data.typeBlock;
        } else {
            item.animated = false;
            item.label = item.data.label;
        }
    });
} else {
    elements = [];
}

var initialModel = {
    isRequesting: false,
    isFetching: false,
    elements: isExample ? _Example['default'] : elements,
    isExample: isExample,
    ref: null,
};
var modelSlice = (0, _toolkit.createSlice)({
    name: 'model',
    initialState: initialModel,
    reducers:
        ((_reducers = {}),
        _defineProperty(_reducers, UPDATE_MODEL, function (state, action) {
            var payload = action.payload;

            if (!isExample && Array.isArray(payload.elements)) {
                window.localStorage.setItem('elements', JSON.stringify(payload.elements));
            }

            return _objectSpread({}, state, {
                elements: payload.elements,
            });
        }),
        _defineProperty(_reducers, UPDATE_INSTANCE, function (state, action) {
            var payload = action.payload;
            return _objectSpread({}, state, {
                ref: payload.ref,
            });
        }),
        _reducers),
});
exports.modelSlice = modelSlice;
var modelActions = modelSlice.actions;
exports.modelActions = modelActions;
var _default = modelSlice.reducer;
exports['default'] = _default;
