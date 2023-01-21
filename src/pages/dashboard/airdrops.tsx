import Menu from '@components/Dashboard/Menu';
import { Copy } from 'tabler-icons-react';
import { useState, useEffect } from 'react';
import { AssetTransfersResult } from 'alchemy-sdk';
import {
    getAirdrops,
    startMoralis,
    getRecipients
} from '@components/utils/airdrops';
import { collectedPost } from '@components/utils/gate';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { accessList } from '@components/Dashboard/access'
import Connect from '@components/Home/Connect';

const Airdrops = () => {
    const { address, isConnected } = useAccount();
    const [airdrops, setAirdrops] = useState<AssetTransfersResult[]>();
    const [totalRecipients, setTotalRecipients] = useState<number[]>([]);
    const [tokenNames, setTokenNames] = useState<string[]>([]);
    const [tokenType, setTokenType] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasAccess, setHasAccess] = useState<boolean>(false);
    const [checkedAccess, setCheckedAccess] = useState<boolean>(false);

    const copyToClipboard = (text: string | number) => {
        navigator.clipboard.writeText(text.toString());
    }

    useEffect(() => {
        const airdrops = async () => {
            await startMoralis();
            const allAirdrops = await getAirdrops(address!);
            setAirdrops(allAirdrops?.transfers);
            let allRecipients = []
            let allTokenNames = []
            let allTokenType = []
            for (let i = 0; i < 10; i++) {
                if (i == allAirdrops?.transfers.length) {
                    break;
                }
                let recipients = await getRecipients(allAirdrops?.transfers[i]?.hash)
                allRecipients.push(recipients[0])
                allTokenNames.push(recipients[1])
                allTokenType.push(recipients[2])
            }
            setTotalRecipients(allRecipients)
            setTokenNames(allTokenNames)
            setTokenType(allTokenType)
            setLoading(false);
        }
        const checkAccess = async () => {
            if (accessList.includes(address!) || await collectedPost("0x0187f4-0x50", address!)) {
                setHasAccess(true);
                airdrops();
            }
            setCheckedAccess(true);
        }
        if (address) {
            checkAccess()
        }  
    }, [address]);

    if (!isConnected) {
        return (
            <>
                <div className="flex items-center justify-center h-screen">
                    <Connect />
                </div>
            </>
        )
    }

    if (!hasAccess && checkedAccess) {
        return (
            <>
                <div className="flex flex-col items-center justify-center h-screen">
                    <div className="text-2xl font-bold">You do not have access to this page</div>
                    <span>
                    Collect <a className='text-blue-500'
                        href="https://lenster.xyz/posts/0x0187f4-0x50" target="_blank" rel="noreferrer">this post</a> to get access.
                    </span>
                        {/* <Post publication={publication!} /> */}
                    <div className='flex my-3'>
                        <a href="https://lenster.xyz/posts/0x0187f4-0x50" target="_blank" rel="noreferrer">
                            <button type="button" className="text-white bg-blue-500 hover:bg-blue-400 focus:ring-4 focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center">
                                Collect post
                            </button>
                        </a>
                        <Link href="/">
                            <button type="button" className="text-white bg-blue-500 hover:bg-blue-400 focus:ring-4 focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center">
                                Go back
                            </button>
                        </Link>
                    </div>
                </div>
            </>
        )
    }

    return(
        <>
            {
                loading ? 
                    <div className="p-4 max-w-sm w-full mx-auto flex justify-center items-center h-screen">
                        <button disabled type="button" className="text-white bg-blue-500 hover:bg-blue-400 focus:ring-4 focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center">
                            <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                            </svg>
                            Processing...
                        </button>
                    </div>
                :
                    <div className="flex justify-start w-screen">
                        <div className='lg:flex'>
                            <Menu />
                            <div className='m-10 sm:m-5'>
                                <div className='font-bold text-2xl sm:text-lg mb-5 sm:mb-3'>
                                    Recent Airdrops
                                </div>
                                <div className='shadow-lg rounded-lg'>
                                <table className='w-screen table-auto overflow-x-auto text-sm sm:text-xs text-left text-gray-500 mt-5'>
                                    <thead>
                                        <tr>
                                            <th className="px-6 sm:px-2 py-3 sm:py-2 border-b-2 border-gray-300 text-left text-sm lg:leading-4 font-medium text-gray-500 lg:uppercase tracking-wider">
                                            
                                            </th>
                                            <th className="px-6 sm:px-2 py-3 sm:py-2 border-b-2 border-gray-300 text-left text-sm lg:leading-4 font-medium text-gray-500 lg:uppercase tracking-wider">
                                                Transaction Hash
                                            </th>
                                            <th className="px-6 sm:px-2 py-3 sm:py-2 border-b-2 border-gray-300 text-left text-sm lg:leading-4 font-medium text-gray-500 lg:uppercase tracking-wider">
                                                Token Name
                                            </th>
                                            <th className="px-6 sm:px-2 py-3 sm:py-2 border-b-2 border-gray-300 text-left text-sm lg:leading-4 font-medium text-gray-500 lg:uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 sm:px-2 py-3 sm:py-2 border-b-2 border-gray-300 text-left text-sm lg:leading-4 font-medium text-gray-500 lg:uppercase tracking-wider">
                                                No of Recipients
                                            </th>
                                            <th className="px-6 sm:px-2 py-3 sm:py-2 border-b-2 border-gray-300 text-left text-sm lg:leading-4 font-medium text-gray-500 lg:uppercase tracking-wider">
                                                Token Type
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {airdrops?.slice(0,10)?.map((airdrop, index) => (
                                            <tr key={index}>
                                                <td className="px-6 sm:px-2 py-4 sm:py-2 sm:text-xs whitespace-no-wrap border-b border-gray-500">
                                                    {index+1}
                                                </td>
                                                <td className="px-6 sm:px-2 py-4 sm:py-2 whitespace-no-wrap border-b border-gray-500">
                                                    <div className="flex items-center">
                                                        <div className="flex text-sm sm:text-xs leading-5 sm:leading-3 font-medium">
                                                            <a href={`https://polygonscan.com/tx/${airdrop?.hash!}`} className="hover:underline hover:underline-offset-2 text-blue-500" target="_blank" rel="noreferrer">
                                                                {airdrop?.hash?.slice(0, 10)}...{airdrop?.hash?.slice(airdrop?.hash?.length - 10, airdrop?.hash?.length)}
                                                            </a>
                                                            <Copy className="w-3 h-3 ml-2 cursor-pointer" onClick={() => copyToClipboard(airdrop?.hash!)} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 sm:px-2 py-4 sm:py-2 whitespace-no-wrap border-b border-gray-500">
                                                    <div className="text-sm leading-5 sm:leading-3 sm:text-xs text-gray-900">{tokenNames[index]}</div>
                                                </td>
                                                <td className="px-6 sm:px-2 py-4 whitespace-no-wrap border-b border-gray-500">
                                                    <div className="text-sm leading-5 sm:leading-3 sm:text-xs text-gray-900">{
                                                        tokenNames[index] == "MATIC" ? Math.round(airdrop?.value! * 100) / 100 :
                                                            totalRecipients[index] 
                                                    }</div>
                                                </td>
                                                <td className="px-6 sm:px-2 py-4 whitespace-no-wrap border-b border-gray-500">
                                                    <div className="text-sm leading-5 sm:leading-3 sm:text-xs text-gray-900">{totalRecipients[index]}</div>
                                                </td>
                                                <td className="px-6 sm:px-2 py-4 whitespace-no-wrap border-b border-gray-500">
                                                    <div className="text-sm leading-5 sm:leading-3 sm:text-xs text-gray-900">{tokenType[index]}</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default Airdrops;