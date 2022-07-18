import { useEffect } from 'react';
import { useAccount } from 'wagmi'
import { useAppContext } from '@components/utils/AppContext'
import { useLazyQuery } from '@apollo/client'
import { GET_PROFILES } from '@graphql/Queries/Profile'
import { GET_FOLLOWING, GET_FOLLOWERS } from '@graphql/Queries/Follow'
import { Follower, Following } from '@generated/types'

const SetContext = () => {
    const { address, isConnected } = useAccount()
    const { 
        profiles,
        setUserAddress, 
        setProfiles, 
        setFollowers, 
        setFollowings 
      } = useAppContext();
    
     const [getProfiles] = useLazyQuery(GET_PROFILES, {
        variables: {
          request: {
            ownedBy: address
          }
        },
        fetchPolicy: 'no-cache',
        onCompleted(data) {
          setProfiles(data?.profiles?.items);
        },
      })
    
      const [getFollowing] = useLazyQuery(GET_FOLLOWING, {
        variables: {
          request: {
            address: address
          }
        },
        fetchPolicy: 'no-cache',
        onCompleted(data) {
          let followings: string[] = [];
          const follow = data?.following?.items; 
          follow.map((following: Following) => {
              const address = following?.profile?.ownedBy; 
              followings.push(address);
          })
          setFollowings(followings);
        }
      })
    
      const [getFollowers] = useLazyQuery(GET_FOLLOWERS, {
        variables: {
          request: {
            profileId: profiles[0]?.id
          }
        },
        fetchPolicy: 'no-cache',
        onCompleted(data) {
          let followers: string[] = [];
          const follow = data?.followers?.items; 
          follow.map((follower: Follower) => {
              const address = follower?.wallet?.address; 
              followers.push(address);
          }); 
          setFollowers(followers);
        }
      })
    
      useEffect(() => {
        if (isConnected) {
          setUserAddress(address!);
          getProfiles();
          getFollowing();
          getFollowers();
        }
      }, [isConnected, address, setUserAddress, getProfiles, getFollowers, getFollowing]);
    
      return (
        <></>
      )
}

export default SetContext