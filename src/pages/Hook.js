import React from "react";
import APIStorage from "./APIStorage";

const context  = React.createContext({
    apiStore: new APIStorage(),
    // mapStore: new MapStore() //TODO: Lynos
});
export const useStores = () => React.useContext(context);
