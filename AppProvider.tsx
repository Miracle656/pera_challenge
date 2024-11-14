import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PeraWalletConnect } from '@perawallet/connect'

interface AppContextInterface {
  chainet: any;
  setChainNet: (name: any) => void;

  accountAddress: any;
  setAccountAddress: (name: any) => void;

  peraWallet: PeraWalletConnect;
}

const AppContext = createContext<AppContextInterface | undefined>(undefined);

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [appID, setAppID] = useState<string>('');
  const [accountAddress, setAccountAddress] = useState<any>("")
  const [chainet, setChainNet] = useState<any>(416001)

  let peraWallet = new PeraWalletConnect({
    chainId: chainet
})

  return (
    <AppContext.Provider value={{ accountAddress, setAccountAddress, chainet, setChainNet, peraWallet }}>
      {children}
    </AppContext.Provider>
  );

}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppProvider
