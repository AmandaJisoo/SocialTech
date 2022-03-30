import React from "react";
import APIStorage from "./APIStorage";

const context  = React.createContext(new APIStorage());
export const useStore = () => React.useContext(context);
