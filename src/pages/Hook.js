import React from "react";
import APIStorage from "./APIStorage";
import AppStore from "./AppStore";

const context  = React.createContext({
    apiStore: new APIStorage(),
    appStore: new AppStore()
});
export const useStore = () => React.useContext(context);
