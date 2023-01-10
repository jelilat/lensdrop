import { useState, useEffect } from 'react';
import { getAirdrops, totalMaticAirdrops, get7daysBlockNumber, newFollows, getSponsoredPosts } from '@components/utils/airdrops';
import { AssetTransfersResult } from 'alchemy-sdk';
import { useAccount } from 'wagmi';
import { AirBalloon, Cash, Ticket } from 'tabler-icons-react'
import { UserGroupIcon, UserIcon } from '@heroicons/react/outline'
import { useAppContext } from '@components/utils/AppContext';

const Board = () => {
    const { address } = useAccount();
    const { profiles } = useAppContext();
    const [airdrops, setAirdrops] = useState<AssetTransfersResult[]>();
    const [totalMatic, setTotalMatic] = useState<number>(0);
    const [percentageIncrease, setPercentageIncrease] = useState<number>(0);
    const [sponsoredPosts, setSponsoredPosts] = useState<number>(0);
    const [followData, setFollowData] = useState<{
        blockNumber: number,
        noOfFollowers: number
    }[]>([{blockNumber: 0, noOfFollowers: 0}]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const airdrops = async () => {
            const airdrops = await getAirdrops(address!);
            setAirdrops(airdrops?.transfers);
            let maticAirdrops = await totalMaticAirdrops(airdrops?.transfers)
            maticAirdrops = Math.round(maticAirdrops * 100) / 100;
            setTotalMatic(maticAirdrops);
            if (profiles[0]?.id) {
                const followers = profiles[0]?.stats?.totalFollowers;
                const sevenDaysAgo = await get7daysBlockNumber();
                const newFollowers = await newFollows(profiles[0].id, sevenDaysAgo);
                const percentage = Math.round((newFollowers?.length * 100) / followers);
                setPercentageIncrease(percentage);
                const sponsoredPosts = await getSponsoredPosts(profiles[0].ownedBy);
                setSponsoredPosts(sponsoredPosts);

                let followsData: Array<{
                    blockNumber: number,
                    noOfFollowers: number
                }> = []
                newFollowers?.map((followData) => {
                    let blockNumber = parseInt(followData.blockNum)
                    let noOfFollowers = 0
                    const index = followsData.findIndex((follow) => follow.blockNumber === blockNumber)
                    if (index > -1) {
                        // if it is, increment the noOfFollowers
                        followsData[index].noOfFollowers += 1
                    }
                    else {
                        // if it isn't, add it to the array
                        followsData.push({ blockNumber, noOfFollowers })
                    }
                })
                setFollowData(followsData);
            }
            // erc721Transactions(airdrops?.transfers);     
        }
        airdrops();
    }, [profiles])

    return(
        <>
        <div>
            <div className="lg:flex my-10 mx-3 sm:block">
                <div className="rounded-2xl shadow-xl border-gray-400 h-fit mx-2 p-10 mr-5 w-72">
                    <Cash className="w-10 h-10 my-1"
                        strokeWidth={2}
                        color="#61acf9"
                        />
                    <div className="font-bold text-3xl my-3">
                        {totalMatic} MATIC
                    </div>
                    <div className="font-medium text-xl">
                        Spent
                    </div>
                </div>
                <div className="rounded-2xl shadow-xl border-gray-400 h-fit mx-2 p-10 mr-5 w-72">
                    <AirBalloon className="w-10 h-10 my-1"
                        strokeWidth={2}
                        color="#61acf9"
                        />
                    <div className="font-bold text-3xl my-3">
                        {airdrops?.length} 
                    </div>
                    <div className="font-medium text-xl">
                        Airdrops 
                    </div>
                </div>
                <div className="rounded-2xl shadow-xl border-gray-400 h-fit mx-2 p-10 mr-5 w-72">
                    <UserGroupIcon className="w-10 h-10 my-1"
                        strokeWidth={2}
                        color="#61acf9"
                        />
                    <div className="font-bold text-3xl my-3">
                        1000
                    </div>
                    <div className="font-medium text-xl">
                        Recipients
                    </div>
                </div>
            </div>
            <div className="lg:flex my-10 mx-3 sm:block">
                <div className="block">
                    <div className="rounded-2xl shadow-xl border-gray-400 h-fit mx-2 p-10 mr-5 w-72">
                        <UserIcon className="w-10 h-10 my-1"
                            strokeWidth={2}
                            color="#61acf9"
                            />
                        <div className="font-bold text-3xl my-3">
                            {profiles[0]?.stats?.totalFollowers}
                        </div>
                        <div className="font-medium text-xl">
                            Followers 
                                <div className="text-sm">
                                    <button className='p-2 mr-1 mt-2 text-green-900 bg-green-200 rounded-xl'>
                                        {(percentageIncrease > 0) && (percentageIncrease != Infinity) ? `+${percentageIncrease}%` : `0%`}
                                    </button> since last week
                                </div>
                        </div>
                    </div>
                    <div className="rounded-2xl shadow-xl border-gray-400 h-fit mx-2 p-10 mr-5 w-72">
                        <Ticket className="w-10 h-10 my-1"
                            strokeWidth={2}
                            color="#61acf9"
                            />
                        <div className="font-bold text-3xl my-3">
                            {sponsoredPosts} 
                        </div>
                        <div className="font-medium text-xl">
                            Sponsored Posts 
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl shadow-xl border-gray-400 h-fit mx-2 p-10 mr-5 w-72">
                    <UserGroupIcon className="w-10 h-10 my-1"
                        strokeWidth={2}
                        color="#61acf9"
                        />
                    <div className="font-bold text-3xl my-3">
                        {totalMatic} MATIC
                    </div>
                    <div className="font-medium text-xl">
                        Recipients
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Board;