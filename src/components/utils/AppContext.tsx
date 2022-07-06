import { 
  createContext, 
  Dispatch, 
  ReactNode, 
  SetStateAction, 
  useContext,
  useState 
} from 'react';
import { Profile } from '@generated/types'

export interface ContextType {
    address: string | undefined;
    profiles: Profile[];
    followers: string[];
    followings: string[];
    setUserAddress: Dispatch<SetStateAction<string>>;
    setProfiles: Dispatch<SetStateAction<Profile[]>>;
    setFollowers: Dispatch<SetStateAction<string[]>>;
    setFollowings: Dispatch<SetStateAction<string[]>>;
  }

type Props = {
  children: ReactNode;
};
  
const AppContext = createContext<ContextType>({
  address: undefined,
  profiles: [],
  followers: [],
  followings: [],
  setUserAddress: () => {},
  setProfiles: () => {},
  setFollowers: () => {},
  setFollowings: () => {}
})

export function AppWrapper({ children }: Props) {
  const [address, setUserAddress] = useState("")
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [followers, setFollowers] = useState<string[]>([])
  const [followings, setFollowings] = useState<string[]>([])

  const value = {
    address,
    profiles,
    followers,
    followings,
    setUserAddress,
    setProfiles,
    setFollowers,
    setFollowings
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  return useContext(AppContext)
}
  
export default AppContext