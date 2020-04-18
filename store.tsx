// store.js
import React, { createContext, useReducer } from "react";

const initialState = {};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state: any, action: any) => {
    switch (action.type) {
      case "setRepeatOrder": {
        return {
          ...state,
          repeatOrderData: action.order,
        };
      }

      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
