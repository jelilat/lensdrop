import Menu from './Menu';
import Board from './Board';
import Header from '@components/Home/Header';
import Followers from './Followers';
import { useState, useEffect } from 'react';
import { 
    getAirdrops, 
    totalMaticAirdrops, 
    get7daysBlockNumber, 
    newFollows, 
    getSponsoredPosts,
    getDateByBlockNum,
    startMoralis,
    getRecipients
 } from '@components/utils/airdrops';
 import { AssetTransfersResult } from 'alchemy-sdk';
 import { useAppContext } from '@components/utils/AppContext';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { Home2 } from 'tabler-icons-react';

const Dashboard = () => {
    const { profiles } = useAppContext();
    const { address } = useAccount();
    const [airdrops, setAirdrops] = useState<AssetTransfersResult[]>();
    const [totalMatic, setTotalMatic] = useState<number>(0);
    const [percentageIncrease, setPercentageIncrease] = useState<number>(0);
    const [sponsoredPosts, setSponsoredPosts] = useState<number>(0);
    const [totalRecipients, setTotalRecipients] = useState<number>(0);
    const [followData, setFollowData] = useState<{
        label: string,
        value: string
    }[]>([
        {label: "Sun", value: "0"},
        {label: "Mon", value: "0"},
        {label: "Tue", value: "0"},
        {label: "Wed", value: "0"},
        {label: "Thur", value: "0"},
        {label: "Fri", value: "0"},
        {label: "Sat", value: "0"},
    ]);
    const [ready, setReady] = useState<boolean>(false);

    useEffect(() => {
        // rearrange followData so today is first
        let today = new Date();
        let day = today.getUTCDay();
        let newFollowData = followData;
        let top = newFollowData.slice(day+1);
        let bottom = newFollowData.slice(0, day+1);
        newFollowData = top.concat(bottom);
        setFollowData(newFollowData);

        const airdrops = async () => {
            await startMoralis();
            const airdrops = await getAirdrops(address!);
            setAirdrops(airdrops?.transfers);
            let allRecipients = 0
            for (let i = 0; i < airdrops?.transfers?.length; i++) {
                let recipients = await getRecipients(airdrops?.transfers[i]?.hash)
                allRecipients += recipients[0]
            }
            setTotalRecipients(allRecipients)
            let maticAirdrops = await totalMaticAirdrops(airdrops?.transfers)
            maticAirdrops = Math.round(maticAirdrops * 100) / 100;
            setTotalMatic(maticAirdrops);
                
            if (profiles[0]?.id) {
                const followers = profiles[0]?.stats?.totalFollowers;
                const sevenDaysAgo = await get7daysBlockNumber();
                const newFollowers = await newFollows(sevenDaysAgo, profiles[0]?.followNftAddress);
                const percentage = Math.round((newFollowers?.length * 100) / followers);
                setPercentageIncrease(percentage);
                const sponsoredPosts = (await getSponsoredPosts(profiles[0].ownedBy))?.result?.length;
                setSponsoredPosts(sponsoredPosts);
              
                let ready = false;
                newFollowers?.map(async (data) => {
                    let label = await getDateByBlockNum(data.blockNum);
                    if (!ready && followData[followData.length - 2].label === label) {
                        ready = true;
                    }
                    if (ready || followData[followData.length - 1]?.label !== label) {
                        let value = "1"
                        const index = followData.findIndex((follow) => follow.label === label)
                        if (index > -1) {
                            let newFollowData = followData;
                            let prevValue = parseInt(newFollowData[index].value)
                            value = (prevValue + 1).toString()
                            newFollowData[index].value = value;
                            setFollowData(newFollowData);
                        }
                        else {
                            setFollowData([...followData, { label, value }])
                        }
                    }
                })
            }
            setReady(true)   
        }
        airdrops();
    }, [profiles])
    return (
        <div> 
            <Header />
           {
                ready ?
                    <div className='flex max-h-screen'>
                        <div className='hidden lg:flex'>
                            <Menu />   
                            <Board 
                                airdrops={airdrops!}
                                totalMatic={totalMatic}
                                percentageIncrease={percentageIncrease}
                                sponsoredPosts={sponsoredPosts}
                                followData={followData}
                                totalRecipients={totalRecipients}
                            /> 
                            <Followers
                                airdrops={airdrops!}
                                sponsoredPosts={sponsoredPosts}
                            />
                        </div>
                        <div className="p-4 max-w-sm flex justify-center items-center h-screen lg:hidden"> 
                            <div>
                                <div className='text-center font-bold my-1 mx-auto p-2 w-3/4 text-lg'>
                                    Oops! Dashboard is not available on mobile yet.
                                </div>
                                <div className='text-center my-1 p-2'>
                                    Please view this page on a desktop device. <span className="text-blue-500 hover:text-blue-700 hover:underline hover:underline-offset-2"><Link href="/"
                                           >Go back</Link></span> to the Homepage.
                                </div>
                            </div>
                        </div>
                    </div> :
                    <div className="p-4 max-w-sm w-full mx-auto flex justify-center items-center h-screen">
                        <button disabled type="button" className="text-white bg-blue-500 hover:bg-blue-400 focus:ring-4 focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center">
                            <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                            </svg>
                            Processing...
                        </button>
                    </div>
           }
        </div>
    );
}

export default Dashboard;