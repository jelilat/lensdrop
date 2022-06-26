import { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { useAccount, useContractWrite, erc20ABI, erc721ABI, useContractRead } from 'wagmi'
import { GET_PROFILES } from '@graphql/Queries/Profile'
import { GET_FOLLOWING, GET_FOLLOWERS } from '@graphql/Queries/Follow'
import { Profile, Follower, Following } from '@generated/types'
import { AirdropAbi } from 'src/abis/Airdrop'
import { Modal } from '@components/UI/Modal'
import { BigNumber } from 'ethers'
import Image from 'next/image'

const Body = ()=> {
    const { data: account } = useAccount()
    const [state, setState] = useState<"Prepare" | "Approve" | "Airdrop">("Prepare")
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [defaultProfile, setDefaultProfile] = useState(profiles[0]?.id)
    const [followers, setFollowers] = useState<string[]>([])
    const [following, setFollowing] = useState<string[]>([])
    const [func, setFunc] = useState<string>("batchSendNativeToken")
    const [tokenAddress, setTokenAddress] = useState<string>("")
    const [amount, setAmount] = useState<number>(0)
    const [receivers, setReceivers] = useState<string[]>([])
    const [decimal, setDecimal] = useState<number>(10**18)
    const [modal, setModal] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const tokenContract = useContractWrite({
        addressOrName: tokenAddress,
        contractInterface: func === "batchsendNFT" ? erc721ABI : erc20ABI
    }, 'approve', {
        args: ['', amount]
    })

    const airdropContract = useContractWrite({
        addressOrName: "",
        contractInterface: AirdropAbi
    }, func, {
        args: func !== "batchSendNativeToken" ? [receivers, amount, tokenAddress] : [receivers, amount]
    })

    const decimals = useContractRead({
        addressOrName: tokenAddress,
        contractInterface: erc20ABI,
    }, 'decimals', {
        chainId: 137
    })

    const name = useContractRead({
        addressOrName: tokenAddress,
        contractInterface: erc20ABI,
    }, 'name', {
        chainId: 137
    })

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
            const follow = data?.followers?.items; 
            follow.map((follower: Follower) => {
                const address = follower?.wallet?.address; 
                setFollowers(followers => [...followers, address]); 
            })
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
            const follow = data?.following?.items; 
            follow.map((following: Following) => {
                const address = following?.profile?.ownedBy; 
                setFollowing(following => [...following, address]);
            })
        }
    })

    useEffect(() => {
        getFollowing()
        getFollowers()
    }, [defaultProfile, getFollowing, getFollowers])

    useEffect(() => {
        setReceivers(followers)
    }, [followers])

    const _continue = () => {
        if (func !== 'batchSendNativeToken' && tokenAddress === "") {
            setModal(true)
            setErrorMessage("Please enter a token address")
            return
        } 

        if (amount === 0) {
            setModal(true)
            setErrorMessage("Please enter a valid amount")
            return
        }
        setState("Approve")
    }

    return (
        <>
            <div className="flex text-sm my-3">
                <div className="lg:w-1/4 sm:w-1/7 md:w-2/7"></div>
                <div className="lg:w-1/2 sm:w-full md:2/3 flex">
                    <div className="flex w-1/3">
                        <div className={`mx-1 h-5 w-5 rounded-full border-1 font-bold flex items-center justify-center ${state === 'Prepare' ?
                                'text-white bg-black' : 'text-black bg-white'}`}>
                            1
                        </div>
                        <div>Prepare</div>
                    </div>
                    <div className="flex w-1/3 justify-center">
                        <div className={`mx-1 h-5 w-5 rounded-full border-2 border-black font-bold flex items-center justify-center ${state === 'Approve' ?
                                'text-white bg-black' : 'text-black bg-white'}`}>
                            2
                        </div>
                        <div>Approve</div>
                    </div>
                    <div className="flex w-1/3 justify-center">
                        <div className={`mx-1 h-5 w-5 rounded-full border-2 border-black font-bold flex items-center justify-center ${state === 'Airdrop' ?
                                'text-white bg-black' : 'text-black bg-white'}`}>
                            3
                        </div>
                        <div>Airdrop</div>
                    </div>
                </div>
                <div className="lg:w-1/4 sm:w-1/7 md:w-2/7"></div>
            </div>
            { state === "Prepare" && 
                <div className="flex text-sm">
                    <div className="lg:w-1/4 sm:w-1/7 md:w-2/7">

                    </div>
                    <div className="lg:w-1/2 sm:w-full grow rounded-lg border-2 border-b-black-500 p-5">
                        <div>
                            <div className="font-semibold my-1">
                                Token type
                            </div>
                            <select onChange={(e)=>{
                                setFunc(e.target.value);
                            }}
                                className="my-1 p-2 border-2 border-b-black-500 px-2 rounded-lg h-10 w-full">
                                <option value="batchSendNativeToken">NATIVE - (MATIC)</option>
                                <option value="batchSendERC20">FT - (ERC20)</option>
                                {/* <option value="batchSendNFT">NFT - (ERC721)</option> */}
                            </select>
                        </div>
                        {func !== "batchSendNativeToken" && <div>
                            <div className="font-semibold">
                                Token address
                            </div>
                            <input type="text" onChange={(e)=> {
                                setTokenAddress(e.target.value);
                            }}
                                className="my-1 p-2 border-2 border-b-black-500 px-2 rounded-lg h-10 w-full" />
                        </div>}
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
                            <select onChange={(e) => {
                                setReceivers((e.target.value).split(","))
                            }}
                                className="my-1 p-2 border-2 border-b-black-500 px-2 rounded-lg h-10 w-full">
                                <option value={followers}>Followers ({followers?.length})</option>
                                <option value={following}>Following ({following?.length})</option>
                            </select>
                        </div>
                        {func !== "batchSendNFT" ? <div>
                            <div className="font-semibold my-1">
                                Amount per address
                            </div>
                            <input type="number" onChange={(e)=> {
                                const decimal = decimals?.data
                                let multiplier: number
                                if (func === "batchSendERC20") {
                                    multiplier = decimal === undefined ? 1 : 10**(Number(decimal))
                                } else {
                                    multiplier = 10**18
                                }; 
                                setDecimal(multiplier)
                                setAmount(parseFloat(e.target.value) * multiplier);
                            }}
                                className="border-2 border-b-black-500 my-2 px-2 rounded-lg h-10 w-full" />
                        </div> :
                        <div>
                            <div className="font-semibold my-1">
                                Token Id
                            </div>
                            <input type="number" onChange={(e)=> {
                                setAmount(parseFloat(e.target.value));
                            }}
                                className="border-2 border-b-black-500 my-2 px-2 rounded-lg h-10 w-full" />
                        </div>}
                        <div>
                            <button onClick={()=>{
                                _continue()
                            }}
                                className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
                                data-bs-toggle="modal"
                                >
                                Continue
                                <Modal
                                    title=""
                                    show={modal}
                                    onClose={()=>{
                                        setModal(false)
                                    }}>
                                        <div className="text-red-500 text-center mb-10">
                                            {errorMessage}
                                        </div>
                                </Modal>
                            </button>
                        </div>
                    </div>
                    <div className="lg:w-1/4 sm:w-1/7 md:w-2/7"></div>
                </div>}
                { state === "Approve" && 
                <div className="flex text-sm">
                    <div className="lg:w-1/4 sm:w-1/7 md:w-2/7">

                    </div>
                    <div className="lg:w-1/2 sm:w-full rounded-lg border-2 border-b-black-500 p-5">
                        {func !== "batchSendNativeToken" && <div>
                            <div className="font-semibold my-2">
                                Token Address
                            </div>
                            <div>{tokenAddress}</div>
                        </div>}
                        <div>
                            <div className="font-semibold my-1">
                                Total tokens
                            </div>
                            {func !== "batchSendNFT" ? <div>{(amount * receivers.length)/decimal + " "} <span>
                                {func === "batchSendNativeToken" ? "MATIC" : name?.data}</span></div> :
                                <div>{receivers.length}</div>}
                        </div>
                        <div>
                            <div className="font-semibold my-1">
                                Recepients
                            </div>
                            <div>
                               <textarea className="h-96 w-full p-3 rounded-lg border-2 border-b-black-500" 
                                    value={receivers} readOnly />
                           </div>
                        </div>
                        <div>
                            <button onClick={()=>{setState("Airdrop")}}
                                className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
                                >
                                Approve
                            </button>
                        </div>
                    </div>
                    <div className="lg:w-1/4 sm:w-1/7 md:w-2/7"></div>
                </div>}
                { state === "Airdrop" && 
                <div className="flex text-sm">
                    <div className="lg:w-1/4 sm:w-1/7 md:w-2/7">

                    </div>
                    <div className="lg:w-1/2 sm:w-full rounded-lg border-2 border-b-black-500 p-5">
                        <div>
                            <div className="font-semibold">
                                Token Address
                            </div>
                        </div>
                        <div>
                            <div className="font-semibold my-1">
                                Total tokens
                            </div>
                        </div>
                        <div>
                            <div className="font-semibold my-1">
                                Recepients
                            </div>
                        </div>
                        <div>
                            <button onClick={()=>{setState("Prepare")}}
                                className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
                                >
                                Complete
                            </button>
                        </div>
                    </div>
                    <div className="lg:w-1/4 sm:w-1/7 md:w-2/7"></div>
                </div>}
        </>
    )
}

export default Body