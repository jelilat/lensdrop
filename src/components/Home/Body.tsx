import { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { useAccount } from 'wagmi'
import { GET_PROFILES, GET_DEFAULT_PROFILE } from '@graphql/Queries/Profile'
import { GET_FOLLOWING, GET_FOLLOWERS } from '@graphql/Queries/Follow'
import { Profile, Follower, PaginatedFollowingResult } from '@generated/types'
import Image from 'next/image'

const Body = ()=> {
    const { data: account } = useAccount()
    const [state, setState] = useState<"Prepare" | "Approve" | "Drop">("Prepare")
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [defaultProfile, setDefaultProfile] = useState(profiles[0]?.id)
    const [followers, setFollowers] = useState<Follower[]>([])
    const [following, setFollowing] = useState<PaginatedFollowingResult[]>([])
    const [tokenAddress, setTokenAddress] = useState<string>("")
    const [amount, setAmount] = useState<string>("")

    useQuery(GET_PROFILES, {
        variables: {
            request: {
                ownedBy: account?.address
            }
        },
        fetchPolicy: "no-cache",
        onCompleted(data) {
            setProfiles(data?.profiles?.items)
            setDefaultProfile(data?.profiles?.items[0])
            console.log(data?.profiles)
        }
    })

    const [getFollowers] = useLazyQuery(GET_FOLLOWERS, {
        variables: {
            request: {
                profileId: defaultProfile?.id
            }
        },
        fetchPolicy: 'no-cache',
        onCompleted(data) {
            setFollowers(data?.followers?.items)
            console.log(data)
        }
    })

    const [getFollowing] = useLazyQuery(GET_FOLLOWING, {
        variables: {
            request: {
                address: defaultProfile?.ownedBy
            }
        },
        fetchPolicy: 'no-cache',
        onCompleted(data) {
            setFollowing(data?.following?.items)
        }
    })

    useEffect(() => {
        getFollowing()
        getFollowers()
    }, [defaultProfile, getFollowing, getFollowers])

    return (
        <>
            <div className="flex text-sm">
                <div className="w-1/4">

                </div>
                <div className="w-1/2 rounded-lg border-2 border-b-black-500 p-5">
                    <div>
                        <div className="font-semibold">
                            Token address
                        </div>
                        <input type="text" onChange={(e)=> {
                            setTokenAddress(e.target.value);
                        }}
                            className="my-1 p-2 border-2 border-b-black-500 px-2 rounded-lg h-10 w-full" />
                    </div>
                    <div>
                        <div className="font-semibold my-1">
                            Profile
                        </div>
                        <select className="my-1 p-2 border-2 border-b-black-500 px-2 rounded-lg h-10 w-full"
                            value={defaultProfile?.id}
                            onChange={(e)=> {
                                setDefaultProfile(e.target.value);
                            }}>
                            {profiles?.map((profile, index) => {
                                return (
                                    <option key={index} value={profile?.handle}
                                        className="border-1 rounded-md border-b-black-500">
                                        {profile?.handle}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div>
                        <div className="font-semibold my-1">
                            Receivers
                        </div>
                        <select className="my-1 p-2 border-2 border-b-black-500 px-2 rounded-lg h-10 w-full">
                            <option value="">Followers ({followers?.length})</option>
                            <option value="">Following ({following?.length})</option>
                        </select>
                    </div>
                    <div>
                        <div className="font-semibold my-1">
                            Amount
                        </div>
                        <input type="number" onChange={(e)=> {
                            setAmount(e.target.value);
                        }}
                            className="border-2 border-b-black-500 my-2 px-2 rounded-lg h-10 w-full" />
                    </div>
                    <div>
                        <button className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
                            >
                            Continue
                        </button>
                    </div>
                </div>
                <div className="w-1/4"></div>
            </div>
        </>
    )
}

export default Body