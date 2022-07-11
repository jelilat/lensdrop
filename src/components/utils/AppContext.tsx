import { 
  createContext, 
  Dispatch, 
  ReactNode, 
  SetStateAction, 
  useContext,
  useState 
} from 'react';
import { Profile, Post} from '@generated/types'

export type Filter = {
  reaction: "Comment" | "Mirror" | "Collect" | "Like" | ""
  publicationId: string
  publication: Post | undefined
}

export interface ContextType {
    address: string | undefined;
    profiles: Profile[];
    followers: string[];
    followings: string[];
    filters: Filter[];
    setUserAddress: Dispatch<SetStateAction<string>>;
    setProfiles: Dispatch<SetStateAction<Profile[]>>;
    setFollowers: Dispatch<SetStateAction<string[]>>;
    setFollowings: Dispatch<SetStateAction<string[]>>;
    setFilters: Dispatch<SetStateAction<Filter[]>>;
  }

type Props = {
  children: ReactNode;
};
  
const AppContext = createContext<ContextType>({
  address: undefined,
  profiles: [],
  followers: [],
  followings: [],
  filters: [],
  setUserAddress: () => {},
  setProfiles: () => {},
  setFollowers: () => {},
  setFollowings: () => {},
  setFilters: () => {}
})

export function AppWrapper({ children }: Props) {
  const [address, setUserAddress] = useState("")
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [followers, setFollowers] = useState<string[]>([])
  const [followings, setFollowings] = useState<string[]>([])
  const [filters, setFilters] = useState<Filter[]>([]);

  const value = {
    address,
    profiles,
    followers,
    followings,
    filters,
    setUserAddress,
    setProfiles,
    setFollowers,
    setFollowings,
    setFilters
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