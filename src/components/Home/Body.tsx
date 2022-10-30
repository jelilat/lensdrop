import { useState, useEffect } from 'react'
import { 
    chain as chains,
    useContractWrite, 
    erc20ABI, 
    useBalance, 
    useContractRead, 
    useNetwork,
    useSwitchNetwork,
    useAccount
 } from 'wagmi'
import { MultisenderAbi } from 'src/abis/Airdrop'
import { Modal } from '@components/UI/Modal'
import { MULTISENDER_ADDRESS } from 'src/constants'
import { useAppContext } from '@components/utils/AppContext'
import Filter from '@components/Filter'
import { Filterer } from '@components/utils/Filterer'
import { utils } from 'ethers'
import { BuildTwitterUrl } from '@components/utils/TwitterURLBuilter'
import { Alchemy, Network } from "alchemy-sdk";
import Connect from '@components/Home/Connect'
import PrizeDraw from '@components/Download/PrizeDraw'

const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.MATIC_MAINNET,
}

const alchemy = new Alchemy(config)

const Body = ()=> {
    type Func = 'batchSendNativeToken' | 'batchSendERC20' | 'batchSendNFT'
    const { profiles, followers, followings, filters, recipients, setRecipients } = useAppContext();
    const { chain } = useNetwork(); 
    const { isConnected, address } = useAccount();
    const { switchNetwork } = useSwitchNetwork();
    const [state, setState] = useState<"Prepare" | "Approve" | "Airdrop">("Prepare")
    const [defaultProfile, setDefaultProfile] = useState(profiles[0]?.id)
    const [func, setFunc] = useState<Func>("batchSendNativeToken")
    const [tokenAddress, setTokenAddress] = useState<string>("")
    const [tokenBalances, setTokenBalances] = useState<Array<{name: string, address: string, balance: string}>>([])
    const [nftBalances, setNftBalances] = useState<Array<{name: string, address: string, tokenId: string}>>([])
    const [amount, setAmount] = useState<string>("0")
    const [decimal, setDecimal] = useState<number>(0)
    const [modal, setModal] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [loading, isLoading] = useState<boolean>()
    const [connectModal, setConnectModal] = useState<boolean>(false)

    const tokenContract = useContractWrite({
        addressOrName: tokenAddress,
        contractInterface: erc20ABI,
        functionName: 'approve', 
        args: [MULTISENDER_ADDRESS, BigInt(parseFloat(amount) * decimal * recipients.length)],
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
        contractInterface: MultisenderAbi,
        functionName: func, 
        args: func !== "batchSendNativeToken" ? [recipients, BigInt(parseFloat(amount) * decimal), tokenAddress] : [recipients, utils.parseEther(amount)],
        overrides: {
            from: address,
            value: func === "batchSendNativeToken" ? utils.parseEther(amount).mul(BigInt(recipients.length)) : 0,
            gasLimit: 1e6
          },
        onSuccess(data){
            isLoading(false)
            setErrorMessage("Transaction successful!")
            setModal(true)
            // window.location.reload
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
        functionName: 'decimals', 
        chainId: 137
    })

    const name = useContractRead({
        addressOrName: tokenAddress,
        contractInterface: erc20ABI,
        functionName: 'name', 
        chainId: 137
    })

    const allowance = useContractRead({
        addressOrName: tokenAddress,
        contractInterface: erc20ABI,
        functionName: 'allowance',
        args: [address, MULTISENDER_ADDRESS],
        chainId: 137
    })

    const balanceOf = useContractRead({
        addressOrName: tokenAddress,
        contractInterface: erc20ABI,
        functionName: 'balanceOf', 
        args: [address],
        chainId: 137
    })

    const balance = useBalance({
        addressOrName: address!,
        chainId: 137
    })

    useEffect(() => {
        if (chain?.name !== "Polygon" && address) {
            switchNetwork?.(chains.polygon.id)
            window.location.reload()
          }
    }, [address, chain, switchNetwork])

    useEffect(() => {
        setRecipients(followers)
    }, [followers, setRecipients])

    const _continue = async () => {
        if (func !== 'batchSendNativeToken' && tokenAddress === "") {
            setModal(true)
            setErrorMessage("Enter a token address")
            return
        } 

        if (amount === "") {
            setModal(true)
            setErrorMessage("Enter a valid amount")
            return
        }

        if (!isConnected) {
            setModal(true)
            setErrorMessage("Connect your wallet")
            return
        }

        if (filters[0].reaction !== "") {
            const filteredAddresses = await Filterer(filters);
            if (filteredAddresses.length > 0) {
                let addresses: string[]
                if (recipients[0] !== "") {
                    addresses = filteredAddresses?.filter(address => {
                        return recipients.includes(address)
                    })
                } else {
                    addresses = filteredAddresses
                }
      
                setRecipients(addresses)
            } else {
                setRecipients([])
            }
        }

        if (recipients[0] === "") {
            filters[0].reaction === "" ? setModal(true): setState("Approve")
            setErrorMessage(`${filters[0].reaction === "" &&
            "Can't airdrop tokens to 0 addresses. Adjust your filters"}`)
            return
        }

        setState("Approve")
    }

    const approve = () => {
        if (recipients.length > 50) {
            alert("Can only airdrop tokens to 50 addresses at a time")
        }

        let bal;
        if (func === "batchSendNativeToken") {
            const formattedBalance = balance?.data?.formatted !== undefined ? balance?.data?.formatted : '0'
            bal = parseFloat(formattedBalance)
        } else {
            const formattedBalance = balanceOf?.data?._hex
            bal = parseInt(formattedBalance)/decimal
        }

        if (bal < parseFloat(amount) * recipients.length) {
            setModal(true)
            setErrorMessage("Insufficient funds")
            return
        }

        const allowed = parseInt(allowance?.data?._hex)/decimal
        if (func !== "batchSendNativeToken" && allowed >= parseFloat(amount) * recipients.length){
            isLoading(false)
            setState("Airdrop")
            return
        }

        if (func !== "batchSendNativeToken") {
            tokenContract.write()
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
        const nftBalances = await alchemy.nft.getNftsForOwner(address!)
        if ((nftBalances.ownedNfts).length > 0) {
            setNftBalances([])
        }

        for (let nft of nftBalances.ownedNfts) {
            if (nft.tokenType === "ERC721") {
                setNftBalances((prev) => [...prev, {name: nft.rawMetadata?.name!, address: nft?.contract?.address!, tokenId: nft.tokenId!}])
            }
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
                        <div>
                            <div className="font-semibold my-1">
                                Token type
                            </div>
                            <select onChange={(e)=>{
                                setFunc(e.target.value as unknown as Func);
                                if (e.target.value === "batchSendERC20") {
                                    getAddressTokens()
                                }

                                if (e.target.value === "batchSendNFT") {
                                    getNftBalances()
                                }
                            }}
                                className="my-1 p-2 border-2 border-b-black-500 px-2 rounded-lg h-10 w-full">
                                <option value="batchSendNativeToken">NATIVE - (MATIC)</option>
                                <option value="batchSendERC20">FT - (ERC20)</option>
                                <option value="batchSendNFT">NFT - (ERC721)</option>
                            </select>
                        </div>
                        {func !== "batchSendNativeToken" && <div>
                            <div className="font-semibold">
                                Token address
                            </div>
                            <input type="text" list="tokenAddresses" onChange={(e)=> {
                                    setTokenAddress(e.target.value);
                            }}
                                className="my-1 p-2 border-2 border-b-black-500 px-2 rounded-lg h-10 w-full" />
                            <datalist id="tokenAddresses">
                                <select onChange={(e)=> {
                                    const token = e.target.value
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
                                                key={nft.address}>{nft.name + " (token " + nft.tokenId + ")"}</option>
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
                                recipients
                            </div>
                            <select onChange={(e) => {
                                setRecipients((e.target.value).split(","))
                            }}
                                className="my-1 p-2 border-2 border-b-black-500 px-2 rounded-lg h-10 w-full">
                                <option value={followers}>Followers ({profiles[0]?.stats?.totalFollowers})</option>
                                <option value={followings}>Following ({profiles[0]?.stats?.totalFollowing})</option>
                                <option value={[]}>Any</option>
                            </select>
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
                            <PrizeDraw addresses={recipients} type="Onchain" />
                        </div>
                        <div>
                            <button onClick={()=>{
                                isLoading(true)
                                approve()
                            }}
                                className={`w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800`}
                                disabled={loading}
                                >
                                {loading ? "Approving..." : "Approve"}
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
                            <button onClick={()=>{
                                airdropContract.write()
                                return
                            }}
                                className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
                                disabled={loading}
                                >
                                {loading ? "Confirming..." : "Complete"}
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
                                                <div>
                                                    <a 
                                                        className="text-blue-600"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        href={BuildTwitterUrl(`I just airdropped ${parseFloat(amount) * recipients.length} ${func === "batchSendNativeToken" ? "MATIC" : name?.data} to ${recipients.length} friends on @LensProtocol with Lensdrop`)}>
                                                                <button onClick={() => {
                                                                    setModal(false)
                                                                    }}>
                                                                    Share to twitter
                                                                </button>
                                                    </a>
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
