import { createContext } from 'react';

export interface ContextType {
    userAddress: string | undefined;
  }
  
  const AppContext = createContext<ContextType>({
    userAddress: undefined
  })
  
  export default AppContext