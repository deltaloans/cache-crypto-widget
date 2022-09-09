import React, { useContext } from 'react';
import { globalState } from '.';
const AppContext = React.createContext<globalState>({
  token: {
    address: '',
    name: '',
    symbol: '',
    decimals: 0,
    chainId: 0,
  },
  setToken: () => {},
});
export const useAppContext = () => useContext(AppContext);
export default AppContext;
