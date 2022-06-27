import { FC, useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { GET_FOLLOWERS } from '@graphql/Queries/Follow'
import { Follower, Profile } from '@generated/types'
import { useAccount } from 'wagmi'
import { GET_DEFAULT_PROFILE } from '@graphql/Queries/Profile'
import Image from 'next/image'
import CsvDownloader from 'react-csv-downloader';

const Followers: FC = () => {
    const { data: account } = useAccount()
    const [followers, setFollowers] = useState<string[]>([])
    const [defaultProfile, setDefaultProfile] = useState<Profile>()
    const [showFollowers, setShowFollowers] = useState<boolean>(false)
    const [datas, setdatas] = useState<{address: string}[]>([])

    const [getFollowers] = useLazyQuery(GET_FOLLOWERS, {
        variables: {
            request: {
                profileId: defaultProfile?.id
            }
        },
        fetchPolicy: "no-cache",
        onCompleted(data) {
            const follow = data?.followers?.items; 
            follow.map((follower: Follower) => {
                const address = follower?.wallet?.address; 
                setFollowers(followers => [...followers, address]); 
                setdatas(datas => [...datas, {address: address}])
            })
        }
    })

    useQuery(GET_DEFAULT_PROFILE, {
        variables: {
            request: {
                ethereumAddress: account?.address
            }
        },
        fetchPolicy: 'no-cache',
        onCompleted(data) {
            setDefaultProfile(data?.defaultProfile);
        }
    })


    return (
        <>
            <div className="flex text-sm">
                <div className="lg:w-1/4 sm:w-1/7 md:w-2/7"></div>
                <div className="lg:w-1/2 sm:w-full grow">
                    { !showFollowers ? 
                        <button className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
                                onClick={() => {
                                    getFollowers()
                                    setShowFollowers(true)
                                }}>
                            View Followers
                        </button>
                       : <div>
                           <div className="my-5 font-semibold">
                               Followers addresses
                            </div>
                           <div>
                               <textarea className="h-96 w-full p-3 rounded-lg border-2 border-b-black-500" 
                                    value={followers} readOnly />
                           </div>
                        <div>
                            <CsvDownloader 
                                datas={datas}
                                extension='.csv'
                                filename="Followers addresses"
                            >
                                <button className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
                                    >
                                Download as CSV
                                </button>
                            </CsvDownloader>
                            
                        </div>
                       </div>
                    }
                </div>
                <div className="lg:w-1/4 sm:w-1/7 md:w-2/7"></div>
            </div>
        </>
    )
}

export default Followers