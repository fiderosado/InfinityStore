"use client"
import { useEffect , useState , useRef , useCallback } from "react";

/***
 * InfinityStore is a powerful hook that allows you to manage multiple states in a single React hook for managing a state storage without limits
 * @param name
 * @param initialStore
 * @param callback
 * @returns {{state: null, store: ((function(*): (unknown))|*)}|(function(): *)|((function(): {handler: string}) & {get: (function(): boolean), put: put})}
 * @constructor
 */
const InfinityStore = (
  name ,
  initialStore ,
  callback = () => ({})
) => {
  /**
   * Retrieves the stored state from localStorage using the provided name.
   * If no stored state is found, returns an empty object.
   *
   * @type {Object}
   */
  function getInitialState(){
    if ( typeof window !== "undefined" ){
      const storedState = JSON.parse(localStorage.getItem(name) || "{}");
      return { ...initialStore , ...storedState };
    }
    return initialStore;
  }
  /**
   * React state hook that combines the initial state with the stored state.
   *
   * @type {[Object, function]}
   */
  const [states , setStates] = useState(getInitialState());
  /**
   * React ref to store the current state.
   *
   * @type {Object}
   */
  const stateRef = useRef(states);
  /**
   * React ref for the BroadcastChannel.
   *
   * @type {Object}
   */
  const channelRef = useRef(null);
  /**
   * React ref for the state proxy.
   *
   * @type {Object}
   */
  const stateProxy = useRef(null);
  /***
   * stateManager is a function that allows you to manage the state
   * @type {function(*): {set: function(*, *): void, get: function(): *, value: *}}
   */
  const stateManager = useCallback(
    (key) => {
      /***
       * set is a function that allows you to update the state
       * @param valueOrUpdater
       * @param callback
       */
      const set = (valueOrUpdater , callback) => {
        setStates((prev) => {
          const currentValue = prev[key];
          let newValue;
          if ( typeof valueOrUpdater === "function" ){
            newValue = valueOrUpdater(currentValue);
          } else if (
            typeof currentValue === "object" &&
            currentValue !== null &&
            typeof valueOrUpdater === "object" &&
            valueOrUpdater !== null &&
            !Array.isArray(valueOrUpdater)
          ){
            newValue = { ...currentValue , ...valueOrUpdater };
          } else {
            newValue = valueOrUpdater;
          }
          const updatedState = { ...prev , [key]: newValue };
          if ( callback ) callback(updatedState[key]);
          channelRef.current?.postMessage({ type: "stateChange" , state: updatedState });
          return updatedState;
        });
      };
      return {
        value: states[key] ,
        set ,
        get: () => states[key]
      };
    } ,
    [states]
  );

  if ( !stateProxy.current ){
    /***
     * stateProxy is a function that allows you to manage the state
     * @type {{}}
     */
    stateProxy.current = new Proxy(
      {} ,
      {
        get(_ , prop){
          if ( prop in states ){
            const { value , get , set } = stateManager(prop);
            const getterFunction = () => value;
            getterFunction.set = set;
            getterFunction.get = get;
            return Object.assign(getterFunction , callback(stateProxy.current));
          }
          return Object.assign(() => ({ handler: "target" }) , {
            get: () => false ,
            put: () => {
            }
          });
        }
      }
    );
  }

  /***
   * storeResponse is a function that allows you to get the current
   * @type {(function(*): (unknown))|*}
   */
  const storeResponse = useCallback(
    (keys) => {
      /***
       * keys is a function that allows you to get the current state
       */
      if ( !keys ){
        return { ...states };
      }
      /***
       * keys is a function that allows you to get the current state
       */
      if ( !Array.isArray(keys) ){
        throw new Error("La entrada a getAll debe ser un array de claves.");
      }
      /***
       * result is a function that allows you to get the current state
       */
      return keys.reduce(
        (result , key) => {
          if ( key in states ){
            result[key] = states[key];
          } else {
            throw new Error(`El estado con clave "${ key }" no existe.`);
          }
          return result;
        } ,
        {}
      );
    } ,
    [states]
  );

  /**
   * useEffect hook to handle storage changes and channel messages.
   * It updates the state when the localStorage or BroadcastChannel changes.
   *
   * @param {string} name - The name used as the key in localStorage and BroadcastChannel.
   * @param {function} setStates - Function to update the state.
   */
  useEffect(() => {
    if ( typeof window !== "undefined" ) {
      /**
       * Handles changes in localStorage and updates the state.
       *
       * @param {StorageEvent} event - The storage event that triggers the state update.
       */
      const handleStorageChange = (event) => {
        if (event.key === name && event.newValue) {
          const newState = JSON.parse(event.newValue);
          setStates(newState);
        }
      };
      /**
       * Handles messages from the BroadcastChannel and updates the state.
       *
       * @param {MessageEvent} event - The message event that triggers the state update.
       */
      const handleChannelMessage = (event) => {
        if (event.data.type === "stateChange") {
          setStates(event.data.state);
        }
      };
      window.addEventListener("storage", handleStorageChange);
      channelRef.current = new BroadcastChannel(name);
      channelRef.current.addEventListener("message", handleChannelMessage);
      return () => {
        window.removeEventListener("storage", handleStorageChange);
        channelRef.current?.close();
      };
    }
  } , [name]);

  useEffect(() => {
    if ( typeof window !== "undefined" ) {
      stateRef.current = states;
      localStorage.setItem(name, JSON.stringify(states));
    }
  } , [name , states]);

  useEffect(() => {
    const syncState = (event) => {
      if ( event.key === name ){
        const newState = JSON.parse(event.newValue);
        setStates(newState);
      }
    };
  } , []);

  return {
    state: stateProxy.current ,
    store: storeResponse
  };
};

export default InfinityStore;
