import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi'
import { useAppContext } from '@components/utils/AppContext'
import { useLazyQuery } from '@apollo/client'
import { GET_PROFILES } from '@graphql/Queries/Profile'
import { GET_FOLLOWING, GET_FOLLOWERS } from '@graphql/Queries/Follow'
import { Follower, Following } from '@generated/types'

const SetContext = () => {
  const [pageInfo, setPageInfo] = useState({next: "{\"offset\":0}", prev: "{\"offset\":0}"})
  const [pageInfoz, setPageInfoz] = useState({next: "{\"offset\":0}", prev: "{\"offset\":0}"})
    const { address, isConnected } = useAccount()
    const { 
        profiles,
        followers,
        followings,
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
            address: address,
            cursor: pageInfoz.next
          }
        },
        fetchPolicy: 'no-cache',
        onCompleted(data) {
          setPageInfoz(data?.following?.pageInfo)
          let _followings: string[] = [];
          const follow = data?.following?.items; 
          follow.map((following: Following) => {
              const address = following?.profile?.ownedBy; 
              _followings.push(address);
          })
          setFollowings(followings => [...followings, ..._followings]);
        }
      })
    
      const [getFollowers] = useLazyQuery(GET_FOLLOWERS, {
        variables: {
          request: {
            profileId: profiles[0]?.id,
            cursor: pageInfo.next
          }
        },
        fetchPolicy: 'no-cache',
        onCompleted(data) {
          setPageInfo(data?.followers?.pageInfo);
          let _followers: string[] = [];
          const follow = data?.followers?.items; 
          follow.map((follower: Follower) => {
              const address = follower?.wallet?.address; 
              _followers.push(address);
          }); 
          setFollowers(followers => [...followers, ..._followers]);
        }
      })
    
      useEffect(() => {
        if (isConnected) {
          setUserAddress(address!);
          getProfiles();
          getFollowers();
          getFollowing();
        }
      }, [isConnected, address, profiles, setUserAddress, getProfiles, getFollowers, getFollowing]);
    
      return (
        <></>
      )
}

export default SetContext