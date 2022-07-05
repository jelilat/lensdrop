import { FC, useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { GET_FOLLOWING } from '@graphql/Queries/Follow'
import { Following, Profile } from '@generated/types'
import { useAccount } from 'wagmi'
import { GET_DEFAULT_PROFILE } from '@graphql/Queries/Profile'
import Image from 'next/image'
import CsvDownloader from 'react-csv-downloader';

const Followers: FC = () => {
    const { address } = useAccount()
    const [followings, setFollowings] = useState<string[]>([])
    const [defaultProfile, setDefaultProfile] = useState<Profile>()
    const [showFollowing, setShowFollowing] = useState<boolean>(false)
    const [datas, setdatas] = useState<{address: string}[]>([])

    const [getFollowing] = useLazyQuery(GET_FOLLOWING, {
        variables: {
            request: {
                address: defaultProfile?.ownedBy
            }
        },
        fetchPolicy: "no-cache",
        onCompleted(data) {
            const follow = data?.following?.items; 
            follow.map((following: Following) => {
                const address = following?.profile?.ownedBy; 
                setFollowings(followings => [...followings, address]); 
                setdatas(datas => [...datas, {address: address}])
            })
        }
    })

    useQuery(GET_DEFAULT_PROFILE, {
        variables: {
            request: {
                ethereumAddress: address
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
                    { !showFollowing ? 
                        <button className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
                                onClick={() => {
                                    getFollowing()
                                    setShowFollowing(true)
                                }}>
                            View Following
                        </button>
                       : address == undefined ? 
                       <div className="text-center">
                           Connect your wallet to view following
                       </div>
                       : <div>
                           <div className="my-5 font-semibold">
                           Following addresses
                            </div>
                           <div>
                               <textarea className="h-96 w-full p-3 rounded-lg border-2 border-b-black-500" 
                                    value={followings} readOnly />
                           </div>
                        <div>
                            <CsvDownloader 
                                datas={datas}
                                extension='.csv'
                                filename="Following addresses"
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