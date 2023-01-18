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

const Dashboard = () => {
    const { profiles } = useAppContext();
    const { address } = useAccount();
    const [airdrops, setAirdrops] = useState<AssetTransfersResult[]>();
    const [totalMatic, setTotalMatic] = useState<number>(0);
    const [percentageIncrease, setPercentageIncrease] = useState<number>(0);
    const [sponsoredPosts, setSponsoredPosts] = useState<number>(0);
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
            getRecipients(airdrops?.transfers[0]?.hash)
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
                
                newFollowers?.map(async (data) => {
                    let label = await getDateByBlockNum(data.blockNum);
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
                })
            }   
        }
        airdrops();
    }, [profiles])
    return (
        <div> 
            <Header />
           <div className='flex max-h-96'>
                <Menu />   
                <Board 
                    airdrops={airdrops!}
                    totalMatic={totalMatic}
                    percentageIncrease={percentageIncrease}
                    sponsoredPosts={sponsoredPosts}
                    followData={followData}
                 /> 
                <Followers
                    airdrops={airdrops!}
                    sponsoredPosts={sponsoredPosts}
                 />
           </div>
        </div>
    );
}

export default Dashboard;