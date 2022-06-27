import { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { useAccount, useContractWrite, erc20ABI, useBalance, useContractRead } from 'wagmi'
import { GET_PROFILES } from '@graphql/Queries/Profile'
import { GET_FOLLOWING, GET_FOLLOWERS } from '@graphql/Queries/Follow'
import { Profile, Follower, Following } from '@generated/types'
import { MultisenderAbi } from 'src/abis/Airdrop'
import { Modal } from '@components/UI/Modal'
import { MULTISENDER_ADDRESS } from 'src/constants'
import { BigNumber, ethers } from 'ethers'
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
    const [amount, setAmount] = useState<string>("")
    const [receivers, setReceivers] = useState<string[]>([])
    const [decimal, setDecimal] = useState<number>(10**18)
    const [modal, setModal] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [loading, isLoading] = useState<boolean>()

    const tokenContract = useContractWrite({
        addressOrName: tokenAddress,
        contractInterface: erc20ABI,
    }, 'approve', {
        args: [MULTISENDER_ADDRESS, parseFloat(amount) * decimal],
        onSuccess(data){
            isLoading(false)
            setState("Airdrop")
        },
        onError(err){
            isLoading(false)
            setErrorMessage(`Transaction failed ${err.message}`)
            setModal(true)
        }
    })

    const airdropContract = useContractWrite({
        addressOrName: MULTISENDER_ADDRESS,
        contractInterface: MultisenderAbi
    }, func, {
        args: func !== "batchSendNativeToken" ? [receivers, parseFloat(amount) * decimal, tokenAddress] : [receivers, parseFloat(amount) * 10**18],
        overrides: {
            from: account?.address,
            value: func === "batchSendNativeToken" ? parseFloat(amount) * receivers.length * 10**18 : 0,
          },
        onSuccess(data){
            isLoading(false)
            setErrorMessage("Transaction successful!")
            setModal(true)
            window.location.reload
        },
        onError(err){
            isLoading(false)
            setErrorMessage(`Transaction failed ${err.message}`)
            setModal(true)
        }
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

    const allowance = useContractRead({
        addressOrName: tokenAddress,
        contractInterface: erc20ABI,
    }, 'allowance', {
        args: [account?.address, MULTISENDER_ADDRESS],
        chainId: 137
    })

    const balanceOf = useContractRead({
        addressOrName: tokenAddress,
        contractInterface: erc20ABI,
    }, 'balanceOf', {
        args: [account?.address],
        chainId: 137
    })

    const balance = useBalance({
        addressOrName: account?.address,
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

        if (amount === "") {
            setModal(true)
            setErrorMessage("Please enter a valid amount")
            return
        }

        if (account?.address === undefined) {
            setModal(true)
            setErrorMessage("Please connect your wallet")
            return
        }

        if (profiles.length === 0) {
            setModal(true)
            setErrorMessage("You don't have a Lens profile")
            return
        }

        if (receivers.length === 0) {
            setModal(true)
            setErrorMessage("Can't airdrop tokens to 0 addresses")
            return
        }
        setState("Approve")
    }

    const approve = () => {
        let bal;
        if (func === "batchSendNativeToken") {
            const formattedBalance = balance?.data?.formatted !== undefined ? balance?.data?.formatted : '0'
            bal = parseFloat(formattedBalance)
        } else {
            const formattedBalance = balanceOf?.data?._hex
            bal = parseInt(formattedBalance)/decimal
        }

        if (bal < parseFloat(amount) * receivers.length) {
            setModal(true)
            setErrorMessage("Insufficient funds")
            return
        }

        const allowed = parseInt(allowance?.data?._hex)/decimal
        if (func !== "batchSendNativeToken" && allowed >= parseFloat(amount) * receivers.length){
            setState("Airdrop")
            return
        }

        tokenContract.write()
    }

    return (
        <>
            <div className="flex text-sm my-3 mb-10">
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
                                setAmount(e.target.value);
                            }}
                                className="border-2 border-b-black-500 my-2 px-2 rounded-lg h-10 w-full" />
                        </div> :
                        <div>
                            <div className="font-semibold my-1">
                                Token Id
                            </div>
                            <input type="number" onChange={(e)=> {
                                setAmount(e.target.value);
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
                            {func !== "batchSendNFT" ? <div>{(parseFloat(amount) * receivers.length) + " "} <span>
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
                            <button onClick={()=>{
                                isLoading(true)
                                approve()
                            }}
                                className={`w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800`}
                                disabled={loading}
                                >
                                {loading ? "Confirming..." : "Approve"}
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
                { state === "Airdrop" && 
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
                            {func !== "batchSendNFT" ? <div>{(parseFloat(amount) * receivers.length) + " "} <span>
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
                            <button onClick={()=>{
                                airdropContract.write()
                            }}
                                className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
                                disabled={loading}
                                >
                                {loading ? "Confirming..." : "Complete"}
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
        </>
    )
}

export default Body