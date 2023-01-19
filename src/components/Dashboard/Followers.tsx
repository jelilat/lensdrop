import { useQuery } from '@apollo/client'
import { GET_FOLLOWERS } from '@graphql/Queries/Follow'
import { useAppContext } from '@components/utils/AppContext'
import Image from 'next/image';
import { Moneybag } from 'tabler-icons-react';
import { getEarnings } from '@components/utils/airdrops';
import { useState, useEffect } from 'react';

type Props = {
    airdrops: any;
    sponsoredPosts: number;
}

export default function Followers({ airdrops, sponsoredPosts }: Props) {
    const { profiles } = useAppContext();
    const { data, loading } = useQuery(GET_FOLLOWERS, {
      variables: {
        request: {
          profileId: profiles[0]?.id,
          limit: 5
        }
      }
    })
    const [earnings, setEarnings] = useState(0)
    const defaultSrc = "https://cdn.stamp.fyi/avatar/eth:0x7a07fd44df4b26842dd9d07094a24248e62378e2?s=200"

    useEffect(() => {
      const getTotalEarnings = async () => {
        const earning = await getEarnings(profiles[0]?.ownedBy)
        setEarnings(earning)
      }
      getTotalEarnings()
    }, [profiles])
    
    if (loading) return <div>Loading...</div>
    
    return (
       <div className='my-10 mx-3 '>
            <div className="rounded-2xl shadow-xl border-gray-400 h-fit mx-2 p-10 mr-5 w-72">
              <Moneybag className="w-10 h-10 my-1"
                  strokeWidth={2}
                  color="#61acf9"
                  />
              <div className="font-bold text-3xl my-3">
                  {earnings} MATIC
              </div>
              <div className="font-medium text-xl">
                  Earnings
              </div>
            </div>
            <div className="mt-10">
              <div className='font-bold text-2xl mb-5 p-1'>
                  Recent Followers
              </div>
              <div className='rounded-2xl shadow-xl border-gray-400 p-3'>
                  {data?.followers?.items?.map((follower: any, index: number) => (
                      <div key={index} className="flex p-3 pr-10">
                        <Image className='rounded-lg'
                          src={
                            follower?.wallet?.defaultProfile?.picture?.original?.url! || defaultSrc
                            } alt="profile-image" width={50} height={50} />
                          <h1 className='px-5 text-sm'>@{follower?.wallet?.defaultProfile?.handle}</h1>
                      </div>
                  ))}
              </div>
            </div>
       </div>
    )
}