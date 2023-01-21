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

    const getUrl = (url: string) => {
      if (!url) return defaultSrc
      if (url.startsWith('ipfs://')) {
        return `https://lensdrop.infura-ipfs.io/ipfs/${url.replace('ipfs://', '')}`
      }
      return url
    }
    
    if (loading) return <div>Loading...</div>
    
    return (
       <div className='my-10 mx-3 sm:flex'>
            <div className="rounded-2xl shadow-xl border-gray-400 h-fit mx-2 p-10 sm:p-5 lg:mr-5 lg:w-72 w-1/3">
              <Moneybag className="w-10 h-10 my-1 sm:w-5"
                  strokeWidth={2}
                  color="#61acf9"
                  />
              <div className="font-bold text-3xl my-3 sm:my-1 sm:text-lg">
                  {earnings} MATIC
              </div>
              <div className="font-medium text-xl sm:text-sm">
                  Earnings
              </div>
            </div>
            <div className="lg:mt-10">
              <div className='font-bold text-2xl mb-5 sm:mb-1 p-1 sm:text-lg'>
                  Recent Followers
              </div>
              <div className='rounded-2xl shadow-xl border-gray-400 p-3 sm:p-1 scroll-smooth hover:scroll-auto'>
                  {data?.followers?.items?.map((follower: any, index: number) => (
                      <div key={index} className="flex p-3 lg:pr-10">
                        <img className='rounded-lg'
                          src={
                            getUrl(follower?.wallet?.defaultProfile?.picture?.original?.url!)
                            } alt='profile-image' width={50} height={50} />
                          <h1 className='px-5 sm:px-2 text-sm sm:text-xs'>@{follower?.wallet?.defaultProfile?.handle}</h1>
                      </div>
                  ))}
              </div>
            </div>
       </div>
    )
}