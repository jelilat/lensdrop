import { useState, useEffect } from 'react'
import { 
    useContractWrite, 
    erc20ABI, 
    erc721ABI,
    useContractRead, 
    useNetwork,
    useSwitchNetwork,
    useWaitForTransaction, 
    useAccount
 } from 'wagmi'
import { LensdropAbi } from 'src/abis/Airdrop'
import { Modal } from '@components/UI/Modal'
import { LENSDROP_CONTRACT_ADDRESS } from 'src/constants'
import { useAppContext } from '@components/utils/AppContext'
import Filter from '@components/Filter'
import { Filterer } from '@components/utils/Filterer'
import { BigNumber, utils } from 'ethers'
import { BuildTwitterUrl } from '@components/utils/TwitterURLBuilter'
import { Alchemy, Network } from "alchemy-sdk";
import Connect from '@components/Home/Connect'
import PrizeDraw from '@components/Download/PrizeDraw'
import Post from '@components/Post'
import { Button } from '@components/UI/Button'
import { isFollowing, isFollowedByMe } from '@components/utils/gate'

const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.MATIC_MAINNET,
}

const alchemy = new Alchemy(config)

const Body = ()=> {
    type Func = 'batchSendNativeToken' | 'batchSendERC20' | 'batchSendNFT'
    const { profiles, followers, followings, filters, recipients, minimumFollowers, setRecipients, setMinimumFollowers } = useAppContext();
    const { chain } = useNetwork(); 
    const { isConnected, address } = useAccount();
    const { switchNetwork } = useSwitchNetwork();
    const [state, setState] = useState<"Prepare" | "Approve" | "Airdrop">("Prepare")
    const [defaultProfile, setDefaultProfile] = useState(profiles[0]?.id)
    const [func, setFunc] = useState<Func>("batchSendNativeToken")
    const [tokenAddress, setTokenAddress] = useState<`0x${string}`>()
    const [tokenIds, setTokenIds] = useState<Array<string>>([])
    const [tokenBalances, setTokenBalances] = useState<Array<{name: string, address: string, balance: string}>>([])
    const [nftBalances, setNftBalances] = useState<Array<{name: string, address: string, tokenId: string, tokenType: string}>>([])
    const [amount, setAmount] = useState<string>("0")
    const [decimal, setDecimal] = useState<number>(0)
    const [modal, setModal] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [loading, isLoading] = useState<boolean>(false)
    const [validate, setValidator] = useState<boolean>(false)
    const [connectModal, setConnectModal] = useState<boolean>(false)
    const [recipientType, setRecipientType] = useState<"Followers" | "Followings" | "Any">("Followers")
    const [transactionHash, setTransactionHash] = useState<string>("")
    const [fee, setFee] = useState<BigNumber>(utils.parseEther("1").div(100))

    const tokenContract = useContractWrite({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'approve', 
        args: [LENSDROP_CONTRACT_ADDRESS, BigNumber.from(BigInt(parseFloat(amount) * decimal * recipients.length))],
        mode: 'recklesslyUnprepared',
        onSuccess(data){
            setTransactionHash(data?.hash)
        },
        onError(err){
            isLoading(false)
            setErrorMessage(`Transaction failed ${err.message}`)
            setModal(true)
        }
    })

    const setApproval = useContractWrite({
        address: tokenAddress,
        abi: erc721ABI,
        functionName: 'setApprovalForAll',
        args: [LENSDROP_CONTRACT_ADDRESS, true],
        mode: 'recklesslyUnprepared',
        onSuccess(data){
            setTransactionHash(data?.hash)
        },
        onError(err){
            isLoading(false)
            setErrorMessage(`Transaction failed ${err.message}`)
            setModal(true)
        }
    })

    const airdropContract = useContractWrite({
        address: LENSDROP_CONTRACT_ADDRESS,
        abi: LensdropAbi,
        functionName: func, 
        args: func !== "batchSendNativeToken" ? [recipients, BigInt(parseFloat(amount) * decimal), tokenAddress] : [recipients, utils.parseEther(amount)],
        overrides: {
            from: address,
            value: func === "batchSendNativeToken" ? (utils.parseEther(amount).mul(BigInt(recipients.length))).add(fee) : fee,
          },
        mode: 'recklesslyUnprepared',
        onSuccess(data){
            setTransactionHash(data?.hash)
            setErrorMessage("")
        },
        onError(err){
            isLoading(false)
            setErrorMessage(`Transaction failed ${err.message}`)
            setModal(true)
        }
    })

    const airdropNFT = useContractWrite({
        address: LENSDROP_CONTRACT_ADDRESS,
        abi: LensdropAbi,
        functionName: nftBalances[0]?.tokenType === "ERC721" ? "batchSendERC721" : "batchSendERC1155",
        args: [tokenAddress, recipients, tokenIds],
        overrides: {
            from: address,
            value: fee,
            },
        mode: 'recklesslyUnprepared',
        onSuccess(data){
            setTransactionHash(data?.hash)
            setErrorMessage("")
        },
        onError(err){
            isLoading(false)
            setErrorMessage(`Transaction failed ${err.message}`)
            setModal(true)
        }
    })

    const verifyTransaction = useWaitForTransaction({
        hash: transactionHash as `0x${string}`,
        onSuccess(data){
            if (data?.status === 1) {
                isLoading(false)
                setErrorMessage("Transaction successful!")
                if (state === "Approve") {
                    setState("Airdrop")
                } else {
                    setModal(true)
                }
            } else if (data?.status === 0) {
                isLoading(false)
                setErrorMessage("Transaction failed!")
                setModal(true)
            }
        }
    })

    const decimals = useContractRead({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'decimals', 
        chainId: 137
    })

    const name = useContractRead({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'name', 
        chainId: 137
    })

    const allowance = useContractRead({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [address!, LENSDROP_CONTRACT_ADDRESS],
        chainId: 137
    })

    const approval = useContractRead({
        address: tokenAddress,
        abi: erc721ABI,
        functionName: 'isApprovedForAll',
        args: [address!, LENSDROP_CONTRACT_ADDRESS],
        chainId: 137
    })

    const balanceOf = useContractRead({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'balanceOf', 
        args: [address!],
        chainId: 137
    })

    useEffect(() => {
        if (chain?.name !== "Polygon" && address) {
            switchNetwork?.(137)
          }
    }, [address, chain, switchNetwork])

    useEffect(() => {
        if (recipients.length == 0 && validate) {
            setModal(true)
            setErrorMessage("Can't airdrop tokens to 0 addresses. Adjust your filters")
            return
        } else if (recipients.length > 0 && validate) {
            setState("Approve")
        }
    }, [recipients])

    const _continue = async () => {
        setValidator(true)
        if (func !== 'batchSendNativeToken' && tokenAddress === "" as `0x${string}`) {
            setModal(true)
            setErrorMessage("Enter a token address")
            return
        } 

        if (amount === "") {
            setModal(true)
            setErrorMessage("Enter a valid amount")
            return
        }

        if (amount === "0" && func !== 'batchSendNFT') {
            setModal(true)
            setErrorMessage("Amount cannot be 0")
            return
        }

        if (!isConnected) {
            setModal(true)
            setErrorMessage("Connect your wallet")
            return
        }

        if (func === 'batchSendNFT') {
            // Filter nftBalances
            const filtered = nftBalances.filter(nft => nft.address === tokenAddress)
            setNftBalances(filtered)
        }

        let addresses: string[]
        if (filters[0].reaction !== "") {
            const filteredAddresses = await Filterer(filters, minimumFollowers);  
            if (filteredAddresses.length > 0) {
                if (recipientType === "Followers") {
                    addresses = filteredAddresses?.filter(async (address) => {
                        return await isFollowing(address, profiles[0]?.id)
                    }); 
                } else if (recipientType === "Followings") {
                    addresses = filteredAddresses?.filter(async (address) => {
                        return await isFollowedByMe(address, profiles[0]?.id)
                    });  
                } else {
                    addresses = filteredAddresses
                }
      
                setRecipients(addresses)
                return
            } else {
                setRecipients([])
            }
        } else {
            if (recipientType === "Followings") {
                if (profiles[0]?.stats?.totalFollowing > 2000) {
                    setModal(true)
                    setErrorMessage("Can't fetch too many addresses at a time. Please add filters")
                    return
                } else {
                    addresses = followings
                    setRecipients(addresses)
                }
            } if (recipientType == "Any") {
                setModal(true)
                setErrorMessage("Can't airdrop tokens to 0 addresses. Adjust your filters")
                return
            } else {
                if (profiles[0]?.stats?.totalFollowers > 2000) {
                    setModal(true)
                    setErrorMessage("Can't fetch too many addresses at a time. Please add filters")
                    return
                } else {
                    addresses = followers
                    setRecipients(addresses)
                }
            }
        }
    }

    const approve = async () => {
        if (!recipients) {
            alert("Can't airdrop tokens to 0 addresses. Adjust your filters")
        }

        if (func === "batchSendNFT") {
            if (recipients.length > nftBalances.length) {
                alert("Insufficient token balance. Can't airdrop more NFTs than you have")
                isLoading(false)
                return
            }
            for (let i = 0; i < recipients.length; i++) {
                let tokenId: string = (nftBalances[i].tokenId).toString()
                setTokenIds((prev) => [...prev, tokenId])
            }
        }

        let bal;
        if (func === "batchSendNativeToken") {
            bal = await alchemy.core.getBalance(address!) as unknown as number
        } else {
            const formattedBalance = balanceOf?.data?._hex
            bal = parseInt(formattedBalance!)/decimal
        }

        if (bal < parseFloat(amount) * recipients.length) {
            setModal(true)
            setErrorMessage("Insufficient funds")
            isLoading(false)
            return
        }

        if (func === "batchSendERC20"){
            const allowed = parseInt(allowance?.data?._hex!)/decimal
            if (allowed >= parseFloat(amount) * recipients.length) {
                isLoading(false)
                setState("Airdrop")
                return
            }    
        } else if (func === "batchSendNFT") {
            if (approval?.data) {
                isLoading(false)
                setState("Airdrop")
                return
            }
        }

        if (func === "batchSendERC20") {
            const send = tokenContract as any
            send?.write()
            while (loading) {
                verifyTransaction?.data
                // wait for 5 seconds
                await new Promise(r => setTimeout(r, 5000));
            }
            
            return
        } else if (func === "batchSendNFT") {
            const approve = setApproval as any
            approve?.write()
            while (loading) {
                verifyTransaction.data; 
                // wait for 5 seconds
                await new Promise(r => setTimeout(r, 5000));
            }

            return
        } else {
            isLoading(false)
            setState("Airdrop")
        }
    }

    const getAddressTokens = async () => {
        const balances = await alchemy.core.getTokenBalances(address!)
        const nonZeroBalances = balances.tokenBalances.filter((token) => {
            return token.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000";
          })

        if (tokenBalances.length > 0) {
            setTokenBalances([])
        }

        for (let token of nonZeroBalances) {
            // Get balance of token
            let balance = token.tokenBalance;
        
            // Get metadata of token
            const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
        
            // Compute token balance in human-readable format
            const tokenBalance = parseInt(balance!, 16) / Math.pow(10, metadata.decimals!);
            balance = tokenBalance.toFixed(2);

            // append metadata to list of tokens
            setTokenBalances((prev) => [...prev, {name: metadata.name!, address: token.contractAddress!, balance: balance!}])
        }
    }

    const getNftBalances = async () => {
        const _nftBalances = await alchemy.nft.getNftsForOwner(address!)
        if ((_nftBalances.ownedNfts).length > 0) {
            setNftBalances([])
        }

        for (let nft of _nftBalances.ownedNfts) {
            setNftBalances((prev) => [...prev, {name: nft.rawMetadata?.name!, address: nft?.contract?.address!, tokenId: nft.tokenId!, tokenType: nft.tokenType!}])
        }
    }

    return (
        <>
            <div className="flex text-sm my-3 mb-10">
                <div className="lg:w-1/4 md:w-1/5"></div>
                <div className="lg:w-1/2 md:w-3/5 sm:w-full flex">
                    <div className="flex w-1/3 justify-center">
                        <div className={`mx-1 h-5 w-5 rounded-full border-2 border-black font-bold flex items-center justify-center ${state === 'Prepare' ?
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
                <div className="lg:w-1/4 md:w-1/5"></div>
            </div>
            { state === "Prepare" && 
                <div className="flex text-sm">
                    <div className="lg:w-1/4 sm:w-3 md:w-1/5">

                    </div>
                    <div className="lg:w-1/2 md:w-3/5 sm:w-full grow rounded-lg border-2 border-b-black-500 p-5">
                        <div className="group">
                            <div className="font-semibold my-1">
                                Token type
                            </div>
                            <select disabled={!isConnected} onChange={(e)=>{
                                setFunc(e.target.value as unknown as Func);
                                if (e.target.value === "batchSendERC20") {
                                    getAddressTokens()
                                }

                                if (e.target.value === "batchSendNFT") {
                                    getNftBalances()
                                }
                            }}
                                className="flex my-1 p-2 border-2 border-b-black-500 px-2 rounded-lg h-10 w-full">
                                <option value="batchSendNativeToken">NATIVE - (MATIC)</option>
                                <option value="batchSendERC20">FT - (ERC20)</option>
                                <option value="batchSendNFT">NFT</option>
                            </select>
                            <div className={`invisible ${!isConnected && "group-hover:visible"} inline-block absolute z-10 py-2 px-3 rounded-lg shadow-sm transition-opacity duration-300 max-w-lg text-white bg-gradient-to-r from-cyan-400 to-blue-400`}>  
                                <div className="rounded-lg">
                                            <span>Connect wallet to select token type</span>
                                        </div>
                            </div>
                        </div>
                        {func !== "batchSendNativeToken" && <div>
                            <div className="font-semibold">
                                Token address
                            </div>
                            <input type="text" list="tokenAddresses" onChange={(e)=> {
                                    setTokenAddress(e.target.value as `0x${string}`);
                            }}
                                className="my-1 p-2 border-2 border-b-black-500 px-2 rounded-lg h-10 w-full" />
                            <datalist id="tokenAddresses">
                                <select onChange={(e)=> {
                                    const token = e.target.value as `0x${string}`;
                                    setTokenAddress(token);
                                }}>
                                    <option value=""></option>
                                    {func === "batchSendERC20" ?
                                        tokenBalances.map((token) => {
                                            return <option value={token.address}
                                                key={token.address}>{token.name + " Balance (" + token.balance + ")"}</option>
                                        })
                                        :
                                        nftBalances.map((nft) => {
                                            return <option value={nft.address}
                                                key={nft.address + nft.tokenId}>{nft.name + " (token " + nft.tokenId + ")"}</option>
                                        })
                                    }
                                </select>
                            </datalist>
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
                                Recipients
                            </div>
                            <select onChange={(e) => {
                                const value = e.target.value;
                                if (value === "Followers") {
                                    setRecipientType("Followers");
                                } else if (value === "Followings") {
                                    setRecipientType("Followings");
                                } else {
                                    setRecipientType("Any")
                                }
                            }}
                                className="my-1 p-2 border-2 border-b-black-500 px-2 rounded-lg h-10 w-full">
                                <option value="Followers">Followers ({profiles[0]?.stats?.totalFollowers})</option>
                                <option value="Followings">Following ({profiles[0]?.stats?.totalFollowing})</option>
                                <option value="Any">Any</option>
                            </select>
                            <div className="font-semibold my-1">
                                Has a minimum of 
                            </div>
                            <input defaultValue={minimumFollowers} type="number" min="0" placeholder="30" 
                            onKeyDown={(e)=> {
                                if (e.key === ".") {
                                    e.preventDefault();
                                }
                            }}
                                onChange={(e)=> {
                                setMinimumFollowers(parseInt(e.target.value));
                            }}
                                className="border-2 border-b-black-500 my-2 px-2 rounded-lg h-10 sm:w-20 mr-1" /> followers
                            <Filter />
                        </div>
                        {func !== "batchSendNFT" && <div>
                            <div className="font-semibold my-1">
                                Amount per address
                            </div>
                            <input type="number" min="0" onChange={(e)=> {
                                const decimal = decimals?.data;
                                let multiplier: number
                                if (func === "batchSendERC20") {
                                    multiplier = decimal === undefined ? 1 : 10**(Number(decimal))
                                } else {
                                    multiplier = 10**18
                                }; 
                                setDecimal(multiplier)
                                setAmount(e.target.value ? e.target.value : "0");
                            }}
                                className="border-2 border-b-black-500 my-2 px-2 rounded-lg h-10 w-full" />
                        </div> }
                        <div>
                            <button onClick={async ()=>{
                                isLoading(true)
                                await _continue(); 
                                isLoading(false)
                            }}
                                className="w-full h-12 px-6 my-2 text-white transition-colors duration-150 rounded-lg focus:shadow-outline  bg-gradient-to-r from-cyan-400 to-blue-400"
                                data-bs-toggle="modal"
                                disabled={!((profiles[0]?.stats?.totalFollowers <= followers.length || followers.length >= 2000) && (profiles[0]?.stats?.totalFollowing <= followings.length || followings.length >= 2000) && !loading && isConnected) || (!profiles[0])}
                                >
                                {
                                    (profiles[0]?.stats?.totalFollowers <= followers.length || followers.length >= 2000) && (profiles[0]?.stats?.totalFollowing <= followings.length || followings.length >= 2000) && !loading ?
                                    "Continue"
                                    :
                                    <div className="flex justify-center">
                                        {
                                            isConnected && profiles[0] != null ? <div className="flex">Fetching data. Please wait...<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-t-2 border-r-2 border-gray-100 mx-3"></div>
                                            </div>
                                             : "Continue"
                                        }
                                    </div>
                                }
                                <Modal
                                    title=""
                                    show={modal}
                                    onClose={()=>{
                                        setModal(false)
                                        setErrorMessage("")
                                    }}>
                                        <div className="font-semibold text-center dark:text-white mb-10">
                                            {errorMessage === "Connect your wallet" ?
                                                <div>
                                                    {!isConnected ?
                                                    <div>
                                                        <button className="rounded-lg bg-black text-white p-2"
                                                            onClick={() => {
                                                                setConnectModal(true)
                                                            }}
                                                            data-bs-toggle="modal">
                                                            Connect wallet
                                                            <Modal
                                                                title="Connect Wallet"
                                                                show={connectModal}
                                                                onClose={()=>{
                                                                    setConnectModal(false)
                                                                    setModal(false)
                                                                }}>
                                                                    <Connect />
                                                            </Modal>
                                                        </button> to continue
                                                    </div>
                                                    : <div>Wallet Connected. Close modal to continue</div>
                                                }
                                                </div>
                                            : <div>{errorMessage}</div>}
                                        </div>
                                </Modal>
                            </button>
                        </div>
                    </div>
                    <div className="lg:w-1/4 sm:w-3 md:w-1/5"></div>
                </div>}
                { state === "Approve" && 
                <div className="flex text-sm">
                    <div className="lg:w-1/4 sm:w-3 md:w-1/5">

                    </div>
                    <div className="lg:w-1/2 md:w-3/5 sm:w-full rounded-lg border-2 border-b-black-500 p-5">
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
                            {func !== "batchSendNFT" ? <div>{(parseFloat(amount) * recipients.length) + " "} <span>
                                {func === "batchSendNativeToken" ? "MATIC" : name?.data}</span></div> :
                                <div>{recipients.length}</div>}
                        </div>
                        {
                            func !== "batchSendNFT" ?
                                <div>
                                    <div className="font-semibold my-1">
                                        Recepients
                                    </div>
                                    <div>
                                        <textarea className="h-96 w-full p-3 rounded-lg border-2 border-b-black-500" 
                                                value={recipients} readOnly />
                                    </div>
                                </div>
                                :
                                <div className="my-3">
                                    <table className="overflow-y-scroll flex flex-col table-auto w-full border-2 rounded-lg">
                                        {/* <thead>
                                        </thead> */}
                                        <tbody className="overflow-y-scroll h-64 w-full">
                                            <tr>
                                                <th className="border px-4 py-2 w-1/2">Recipient</th>
                                                <th className="border px-4 py-2 w-1/2">Token ID</th>
                                            </tr>
                                            {recipients.map((recipient, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className="border px-4 py-2 w-1/2">{recipient}</td>
                                                        <td className="border px-4 py-2 w-1/2">{nftBalances[index] ? nftBalances[index].tokenId : ""}</td>
                                                    </tr>
                                                )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                        }
                        <div>
                            <PrizeDraw addresses={recipients} type="Onchain" sharePost={false} />
                        </div>
                        <div>
                            <button onClick={()=>{
                                isLoading(true); 
                                approve()
                            }}
                                className={`w-full h-12 px-6 my-2 text-white transition-colors duration-150 rounded-lg focus:shadow-outline bg-gradient-to-r from-cyan-400 to-blue-400`}
                                disabled={loading}
                                >
                                {loading ? <div className="flex justify-center">
                                        Approving... 
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-t-2 border-r-2 border-gray-100 mx-3"></div>
                                    </div> : "Approve"}
                                <Modal
                                    title=""
                                    show={modal}
                                    onClose={()=>{
                                        setModal(false)
                                        isLoading(false)
                                        setErrorMessage("")
                                    }}>
                                        <div className="font-semibold text-center dark:text-white mb-10">
                                            {errorMessage}
                                            {errorMessage === "Insufficient funds" &&
                                                <iframe
                                                src={`https://app.uniswap.org/#/swap?exactField=output&exactAmount=${parseFloat(amount) * recipients.length}&outputCurrency=${tokenAddress}`}
                                                // height="660px"
                                                width="100%"
                                                className="border-2 border-b-black-500 my-2 w-full h-96"
                                            /> }
                                        </div>
                                </Modal>
                            </button>
                        </div>
                    </div>
                    <div className="lg:w-1/4 sm:w-3 md:w-1/5"></div>
                </div>}
                { state === "Airdrop" && 
                <div className="flex text-sm">
                    <div className="lg:w-1/4 sm:w-3 md:w-1/5">

                    </div>
                    <div className="lg:w-1/2 md:w-3/5 sm:w-full rounded-lg border-2 border-b-black-500 p-5">
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
                            {func !== "batchSendNFT" ? <div>{(parseFloat(amount) * recipients.length) + " "} <span>
                                {func === "batchSendNativeToken" ? "MATIC" : name?.data}</span></div> :
                                <div>{recipients.length}</div>}
                        </div>
                        <div>
                            <div className="font-semibold my-1">
                                Recepients
                            </div>
                            <div>
                               <textarea className="h-96 w-full p-3 rounded-lg border-2 border-b-black-500" 
                                    value={recipients} readOnly />
                           </div>
                        </div>
                        <div>
                            <button onClick={async ()=>{
                                let fee = recipients.length
                                if (fee > 100) {
                                    fee = 100
                                }
                                setFee(utils.parseEther(fee.toString()).div(100))
                                setModal(false)
                                isLoading(true);
                                if (func !== "batchSendNFT") {
                                    const airdrop = airdropContract as any
                                    airdrop?.write(); 
                                    while (loading) {
                                        verifyTransaction.data
                                        // wait for 5 seconds
                                        await new Promise(r => setTimeout(r, 5000));
                                    }
                                    
                                } else {
                                    const airdrop = airdropNFT as any
                                    airdrop?.write(); 
                                    while (loading) {
                                        verifyTransaction.data
                                        // wait for 5 seconds
                                        await new Promise(r => setTimeout(r, 5000));
                                    }

                                }
                                return
                            }}
                                className="w-full h-12 px-6 my-2 text-white transition-colors duration-150 rounded-lg focus:shadow-outline bg-gradient-to-r from-cyan-400 to-blue-400"
                                disabled={loading}
                                >
                                {loading ? <div className="flex justify-center">
                                        Airdropping...
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-t-2 border-r-2 border-gray-100 mx-3"></div>
                                </div>
                                 : "Complete"}
                            </button>
                                <Modal
                                    title=""
                                    show={modal}
                                    onClose={()=>{
                                        setModal(false)
                                        setErrorMessage("")
                                    }}>
                                        <div className="font-semibold dark:text-white text-center mb-10">
                                            {errorMessage}
                                            {errorMessage === "Transaction successful!" && 
                                                <div className="my-5">
                                                    <a 
                                                        className="my-3"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        href={BuildTwitterUrl(`I just airdropped ${func !== 'batchSendNFT' ? parseFloat(amount) * recipients.length : recipients.length} ${func === "batchSendNativeToken" ? "MATIC" : name?.data} to ${recipients.length} friends on @LensProtocol with @lensdropxyz`)}>
                                                                <Button className="my-3"
                                                                    onClick={() => {
                                                                    setModal(false)
                                                                    }}>
                                                                    Share to twitter
                                                                </Button>
                                                    </a>
                                                    <Post variant="primary"
                                                        content={`I just airdropped ${func !== 'batchSendNFT' ? parseFloat(amount) * recipients.length : recipients.length} ${func === "batchSendNativeToken" ? "MATIC" : name?.data} to`}
                                                        recipients={recipients}
                                                        />
                                                </div>}
                                        </div>
                                </Modal>
                        </div>
                    </div>
                    <div className="lg:w-1/4 sm:w-3 md:w-1/5"></div>
                </div>}
        </>
    )
}

export default Body
