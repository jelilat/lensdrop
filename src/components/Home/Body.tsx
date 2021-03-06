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

const Body = ()=> {
    type Func = 'batchSendNativeToken' | 'batchSendERC20' | 'batchSendNFT'
    const { address, profiles, followers, followings, filters } = useAppContext();
    const { chain } = useNetwork(); 
    const { isConnected } = useAccount();
    const { switchNetwork } = useSwitchNetwork();
    const [state, setState] = useState<"Prepare" | "Approve" | "Airdrop">("Prepare")
    const [defaultProfile, setDefaultProfile] = useState(profiles[0]?.id)
    const [func, setFunc] = useState<Func>("batchSendNativeToken")
    const [tokenAddress, setTokenAddress] = useState<string>("")
    const [amount, setAmount] = useState<string>("0")
    const [receivers, setReceivers] = useState<string[]>([])
    const [decimal, setDecimal] = useState<number>(0)
    const [modal, setModal] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [loading, isLoading] = useState<boolean>()

    const tokenContract = useContractWrite({
        addressOrName: tokenAddress,
        contractInterface: erc20ABI,
        functionName: 'approve', 
        args: [MULTISENDER_ADDRESS, parseFloat(amount) * decimal * receivers.length],
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
        args: func !== "batchSendNativeToken" ? [receivers, utils.parseEther(amount).mul(decimal).div(utils.parseEther("1")), tokenAddress] : [receivers, utils.parseEther(amount)],
        overrides: {
            from: address,
            value: func === "batchSendNativeToken" ? utils.parseEther(amount).mul(receivers.length) : 0,
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
        addressOrName: address,
        chainId: 137
    })

    useEffect(() => {
        if (chain?.name !== "Polygon" && address) {
            switchNetwork?.(chains.polygon.id)
            window.location.reload()
          }
    }, [address, chain, switchNetwork])

    useEffect(() => {
        setReceivers(followers)
    }, [followers])

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
                if (receivers[0] !== "") {
                    addresses = filteredAddresses?.filter(address => {
                        return receivers.includes(address)
                    })
                } else {
                    addresses = filteredAddresses
                }
      
                setReceivers(addresses)
            } else {
                setReceivers([])
            }
        }

        if (receivers[0] === "") {
            filters[0].reaction === "" ? setModal(true): setState("Approve")
            setErrorMessage(`${filters[0].reaction === "" &&
            "Can't airdrop tokens to 0 addresses. Adjust your filters"}`)
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
                                setFunc(e.target.value as unknown as Func);
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
                                <option value={followings}>Following ({followings?.length})</option>
                                <option value={[]}>Any</option>
                            </select>
                            <Filter />
                        </div>
                        {func !== "batchSendNFT" ? <div>
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
                                        setErrorMessage("")
                                    }}>
                                        <div className="font-semibold text-center dark:text-white mb-10">
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
                                                src={`https://app.uniswap.org/#/swap?exactField=output&exactAmount=${parseFloat(amount) * receivers.length}&outputCurrency=${tokenAddress}`}
                                                // height="660px"
                                                width="100%"
                                                className="border-2 border-b-black-500 my-2 w-full h-96"
                                            /> }
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
                                                        href={BuildTwitterUrl(`I just airdropped ${parseFloat(amount) * receivers.length} ${func === "batchSendNativeToken" ? "MATIC" : name?.data} to ${receivers.length} friends on @LensProtocol with Lensdrop`)}>
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
                    <div className="lg:w-1/4 sm:w-1/7 md:w-2/7"></div>
                </div>}
        </>
    )
}

export default Body