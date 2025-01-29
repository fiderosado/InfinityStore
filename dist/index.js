'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

/***
 * InfinityStore is a powerful hook that allows you to manage multiple states in a single React hook for managing a state storage without limits
 * @param name
 * @param initialStore
 * @param callback
 * @returns {{state: null, store: ((function(*): (unknown))|*)}|(function(): *)|((function(): {handler: string}) & {get: (function(): boolean), put: put})}
 * @constructor
 */
var InfinityStore = function InfinityStore(name, initialStore) {
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
    return {};
  };
  /**
   * Retrieves the stored state from localStorage using the provided name.
   * If no stored state is found, returns an empty object.
   *
   * @type {Object}
   */
  var storedState = JSON.parse(localStorage.getItem(name) || "{}");
  /**
   * React state hook that combines the initial state with the stored state.
   *
   * @type {[Object, function]}
   */
  var _useState = react.useState(_objectSpread2(_objectSpread2({}, initialStore), storedState)),
    _useState2 = _slicedToArray(_useState, 2),
    states = _useState2[0],
    setStates = _useState2[1];
  /**
   * React ref to store the current state.
   *
   * @type {Object}
   */
  var stateRef = react.useRef(states);
  /**
   * React ref for the BroadcastChannel.
   *
   * @type {Object}
   */
  var channelRef = react.useRef(null);
  /**
   * React ref for the state proxy.
   *
   * @type {Object}
   */
  var stateProxy = react.useRef(null);
  /***
   * stateManager is a function that allows you to manage the state
   * @type {function(*): {set: function(*, *): void, get: function(): *, value: *}}
   */
  var stateManager = react.useCallback(function (key) {
    /***
     * set is a function that allows you to update the state
     * @param valueOrUpdater
     * @param callback
     */
    var set = function set(valueOrUpdater, callback) {
      setStates(function (prev) {
        var _channelRef$current;
        var currentValue = prev[key];
        var newValue;
        if (typeof valueOrUpdater === "function") {
          newValue = valueOrUpdater(currentValue);
        } else if (_typeof(currentValue) === "object" && currentValue !== null && _typeof(valueOrUpdater) === "object" && valueOrUpdater !== null && !Array.isArray(valueOrUpdater)) {
          newValue = _objectSpread2(_objectSpread2({}, currentValue), valueOrUpdater);
        } else {
          newValue = valueOrUpdater;
        }
        var updatedState = _objectSpread2(_objectSpread2({}, prev), {}, _defineProperty({}, key, newValue));
        if (callback) callback(updatedState[key]);
        (_channelRef$current = channelRef.current) === null || _channelRef$current === void 0 || _channelRef$current.postMessage({
          type: "stateChange",
          state: updatedState
        });
        return updatedState;
      });
    };
    return {
      value: states[key],
      set: set,
      get: function get() {
        return states[key];
      }
    };
  }, [states]);
  if (!stateProxy.current) {
    /***
     * stateProxy is a function that allows you to manage the state
     * @type {{}}
     */
    stateProxy.current = new Proxy({}, {
      get: function get(_, prop) {
        if (prop in states) {
          var _stateManager = stateManager(prop),
            value = _stateManager.value,
            get = _stateManager.get,
            set = _stateManager.set;
          var getterFunction = function getterFunction() {
            return value;
          };
          getterFunction.set = set;
          getterFunction.get = get;
          return Object.assign(getterFunction, callback(stateProxy.current));
        }
        return Object.assign(function () {
          return {
            handler: "target"
          };
        }, {
          get: function get() {
            return false;
          },
          put: function put() {}
        });
      }
    });
  }

  /***
   * storeResponse is a function that allows you to get the current
   * @type {(function(*): (unknown))|*}
   */
  var storeResponse = react.useCallback(function (keys) {
    /***
     * keys is a function that allows you to get the current state
     */
    if (!keys) {
      return _objectSpread2({}, states);
    }
    /***
     * keys is a function that allows you to get the current state
     */
    if (!Array.isArray(keys)) {
      throw new Error("La entrada a getAll debe ser un array de claves.");
    }
    /***
     * result is a function that allows you to get the current state
     */
    return keys.reduce(function (result, key) {
      if (key in states) {
        result[key] = states[key];
      } else {
        throw new Error("El estado con clave \"".concat(key, "\" no existe."));
      }
      return result;
    }, {});
  }, [states]);

  /**
   * useEffect hook to handle storage changes and channel messages.
   * It updates the state when the localStorage or BroadcastChannel changes.
   *
   * @param {string} name - The name used as the key in localStorage and BroadcastChannel.
   * @param {function} setStates - Function to update the state.
   */
  react.useEffect(function () {
    /**
     * Handles changes in localStorage and updates the state.
     *
     * @param {StorageEvent} event - The storage event that triggers the state update.
     */
    var handleStorageChange = function handleStorageChange(event) {
      if (event.key === name && event.newValue) {
        var newState = JSON.parse(event.newValue);
        setStates(newState);
      }
    };
    /**
     * Handles messages from the BroadcastChannel and updates the state.
     *
     * @param {MessageEvent} event - The message event that triggers the state update.
     */
    var handleChannelMessage = function handleChannelMessage(event) {
      if (event.data.type === "stateChange") {
        setStates(event.data.state);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    channelRef.current = new BroadcastChannel(name);
    channelRef.current.addEventListener("message", handleChannelMessage);
    return function () {
      var _channelRef$current2;
      window.removeEventListener("storage", handleStorageChange);
      (_channelRef$current2 = channelRef.current) === null || _channelRef$current2 === void 0 || _channelRef$current2.close();
    };
  }, [name]);
  react.useEffect(function () {
    stateRef.current = states;
    localStorage.setItem(name, JSON.stringify(states));
  }, [name, states]);
  react.useEffect(function () {
  }, []);
  return {
    state: stateProxy.current,
    store: storeResponse
  };
};

exports["default"] = InfinityStore;
//# sourceMappingURL=index.js.map
