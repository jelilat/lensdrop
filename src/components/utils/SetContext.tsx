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
        onCompleted(data) {
          setProfiles(data?.profiles?.items);
        },
      })
    
      const [getFollowing] = useLazyQuery(GET_FOLLOWING, {
        variables: {
          request: {
            address: address,
            cursor: pageInfoz.next,
            limit: 50
          }
        },
        onCompleted(data) {
          setPageInfoz(data?.following?.pageInfo);
          let _followings: string[] = [];
          const follow = data?.following?.items; 
          if (followings.length < profiles[0]?.stats?.totalFollowing) {
            follow.map((following: Following) => {
              const address = following?.profile?.ownedBy; 
              _followings.push(address);
          }); 
          setFollowings(followings => [...followings, ..._followings]);
          }
        }
      })
    
      const [getFollowers] = useLazyQuery(GET_FOLLOWERS, {
        variables: {
          request: {
            profileId: profiles[0]?.id,
            cursor: pageInfo.next,
            limit: 50
          }
        },
        onCompleted(data) {
          setPageInfo(data?.followers?.pageInfo);
          let _followers: string[] = [];
          const follow = data?.followers?.items; 
          if (followers.length < profiles[0]?.stats?.totalFollowers) {
            follow.map((follower: Follower) => {
                const address = follower?.wallet?.address; 
                _followers.push(address);
            }); 
            setFollowers(followers => [...followers, ..._followers]);
          }
        }
      })
    
      useEffect(() => {
        if (isConnected) {
          if (!address) {
            setUserAddress(address!);
          }
          
          if (profiles.length === 0) {
            getProfiles();
          }

          const totalFollowers = profiles[0]?.stats?.totalFollowers  
          if (followers.length < totalFollowers) {
            getFollowers();
          }
          
          const totalFollowings = profiles[0]?.stats?.totalFollowing
          if (followings.length < totalFollowings) {
            getFollowing();
          }
        }
      }, [isConnected, address, profiles, followers, followings, setUserAddress, getProfiles, getFollowers, getFollowing]);
    
      return (
        <></>
      )
}

export default SetContext