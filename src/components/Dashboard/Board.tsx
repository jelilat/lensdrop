import { AssetTransfersResult } from 'alchemy-sdk';
import { AirBalloon, Cash, Ticket } from 'tabler-icons-react'
import { UserGroupIcon, UserIcon } from '@heroicons/react/outline'
import { useAppContext } from '@components/utils/AppContext';
import dynamic from 'next/dynamic';
const ReactFC = dynamic(() => import("./FusionChart"), { ssr: false });

interface props {
    airdrops: AssetTransfersResult[],
    totalMatic: number,
    percentageIncrease: number,
    sponsoredPosts: number,
    followData: {
        label: string,
        value: string
    }[]
    totalRecipients: number
}

const Board = ({ airdrops, totalMatic, percentageIncrease, sponsoredPosts, followData, totalRecipients }: props) => {
    const { profiles } = useAppContext();

    const lineChartConfigs = {
        type: "spline", 
        width: "100%", 
        height: "400", 
        dataFormat: "json", 
        dataSource: {
          chart: {
            "caption": "New Lens Protocol Followers",
            "subCaption": "(Last 7 days)",
            "xAxisName": "Day",
            "yAxisName": "Followers",
            "numberPrefix": "",
            "theme": "fusion",
            "lineThickness": "2",
            "divlineAlpha": "100",
            "divlineColor": "#999999",
            "divlineThickness": "1",
            "divLineIsDashed": "1",
            "divLineDashLen": "1",
            "divLineGapLen": "1",
            "showXAxisLine": "1",
            "xAxisLineThickness": "1"
          },
          data: followData,
        }
      };

    const copyToClipboard = (text: string | number) => {
        navigator.clipboard.writeText(text.toString());
    }

    return(
        <>
        <div className="max-h-screen">
            <div className="flex my-10 sm:my-3 mx-3">
                <div className="rounded-2xl shadow-xl border-gray-400 h-fit mx-2 p-10 lg:mr-5 lg:w-72 w-1/3 sm:p-2">
                    <Cash className="w-10 h-10 lg:my-1 sm:w-5"
                        strokeWidth={2}
                        color="#61acf9"
                        />
                    <div className="font-bold text-3xl my-3 sm:my-1 sm:text-sm">
                        {totalMatic} MATIC
                    </div>
                    <div className="font-medium text-xl sm:text-xs">
                        Spent
                    </div>
                </div>
                <div className="rounded-2xl shadow-xl border-gray-400 h-fit mx-2 p-10 lg:mr-5 lg:w-72 w-1/3 sm:p-2">
                    <AirBalloon className="w-10 h-10 lg:my-1 sm:w-5"
                        strokeWidth={2}
                        color="#61acf9"
                        />
                    <div className="font-bold text-3xl my-3 sm:my-1 sm:text-sm">
                        {airdrops?.length} 
                    </div>
                    <div className="font-medium text-xl sm:text-xs">
                        Airdrops 
                    </div>
                </div>
                <div className="rounded-2xl shadow-xl border-gray-400 h-fit mx-2 p-10 sm:p-2 lg:mr-5 w-1/3 lg:w-72">
                    <UserGroupIcon className="w-10 h-10 lg:my-1 sm:w-5"
                        strokeWidth={2}
                        color="#61acf9"
                        />
                    <div className="font-bold text-3xl my-3 sm:my-1 sm:text-sm">
                        {totalRecipients || 0}
                    </div>
                    <div className="font-medium text-xl sm:text-xs">
                        Recipients
                    </div>
                </div>
            </div>
            <div className="lg:flex my-10 sm:my-5 mx-3 sm:block">
                <div className="block sm:flex sm:my-5">
                    <div className="rounded-2xl shadow-xl border-gray-400 h-fit mx-2 p-10 sm:p-2 sm:w-1/2 lg:w-72">
                        <UserIcon className="w-10 h-10 lg:my-1 sm:w-5"
                            strokeWidth={2}
                            color="#61acf9"
                            />
                        <div className="font-bold text-3xl my-3 sm:my-1 sm:text-sm">
                            {profiles[0]?.stats?.totalFollowers}
                        </div>
                        <div className="font-medium text-xl sm:text-xs">
                            Followers 
                                <div className="text-sm sm:text-xs">
                                    <button className='p-2 lg:mr-1 mt-2 text-green-900 bg-green-200 rounded-xl'>
                                        {(percentageIncrease > 0) && (percentageIncrease != Infinity) ? `+${percentageIncrease}%` : `0%`}
                                    </button> since last week
                                </div>
                        </div>
                    </div>
                    <div className="rounded-2xl shadow-xl border-gray-400 h-fit mx-2 p-10 sm:p-2 lg:mr-5 w-full sm:w-1/2 lg:w-72">
                        <Ticket className="w-10 h-10 lg:my-1 sm:w-5"
                            strokeWidth={2}
                            color="#61acf9"
                            />
                        <div className="font-bold text-3xl my-3 sm:my-1 sm:text-sm">
                            {sponsoredPosts || 0} 
                        </div>
                        <div className="font-medium text-xl sm:text-xs">
                            Sponsored Posts 
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl shadow-xl border-gray-400 h-full mx-2 sm:my-5 p-10 sm:p-1 lg:mr-5 sm:w-full w-2/3">
                    <ReactFC chartConfigs={lineChartConfigs} />
                </div>
            </div>
            {/* <div className="font-bold text-2xl m-3">
                Past Campaigns
            </div>
            <div className='my-5 mb-10 mx-3 rounded-2xl shadow-xl border-gray-400 w-fit'>
                <div className="flex justify-between">
                </div>
                <table>
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-500 uppercase tracking-wider">
                               
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Transaction Hash
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Token Name
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                No of Recipients
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {airdrops?.slice(0,5)?.map((airdrop, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                                    {index+1}
                                </td>
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                                    <div className="flex items-center">
                                        <div className="flex text-sm leading-5 font-medium text-gray-900">
                                            <a href={`https://polygonscan.com/tx/${airdrop?.hash!} hover:underline hover:underline-offset-2`} target="_blank" rel="noreferrer">
                                                {airdrop?.hash?.slice(0, 10)}...{airdrop?.hash?.slice(airdrop?.hash?.length - 10, airdrop?.hash?.length)}
                                            </a>
                                            <Copy className="w-5 h-5 ml-2 cursor-pointer" onClick={() => copyToClipboard(airdrop?.hash!)} />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                                    <div className="text-sm leading-5 text-gray-900"></div>
                                </td>
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                                    <div className="text-sm leading-5 text-gray-900">{Math.round(airdrop?.value! * 100) / 100}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                                    <div className="text-sm leading-5 text-gray-900">{}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                                    <div className="text-sm leading-5 text-gray-900">Airdrop</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}
        </div>
        </>
    )
}

export default Board;