import { FC, useState, useEffect } from 'react'
import Filter from '@components/Filter'
import Image from 'next/image'
import CsvDownloader from 'react-csv-downloader';
import { useAppContext } from '@components/utils/AppContext'

const Followers: FC = () => {
    const { address, followers } = useAppContext()
    const [showFollowers, setShowFollowers] = useState<boolean>(false)
    const [datas, setdatas] = useState<{address: string}[]>([])

    useEffect(() => {
        if (followers.length > 0) { 
            setdatas(followers.map(follower => ({address: follower})))
        }
    }, [followers])

    return (
        <>
            <div className="flex text-sm">
                <div className="lg:w-1/4 sm:w-1/7 md:w-2/7"></div>
                <div className="lg:w-1/2 sm:w-full grow">
                    <Filter />
                    { !showFollowers ? 
                        <button className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
                                onClick={() => {
                                    setShowFollowers(true)
                                }}>
                            View Followers
                        </button>
                       : address == undefined ? 
                       <div className="text-center">
                           Connect your wallet to view followers
                       </div>
                       : <div>
                           <div className="my-5 font-semibold">
                               Followers addresses
                            </div>
                           <div>
                               <textarea className="h-96 w-full p-3 rounded-lg border-2 border-b-black-500" 
                                    value={followers} readOnly />
                           </div>
                        <div>
                            <CsvDownloader 
                                datas={datas}
                                extension='.csv'
                                filename="Followers addresses"
                            >
                                <button className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
                                    >
                                Download as CSV
                                </button>
                            </CsvDownloader>
                            
                        </div>
                       </div>
                    }
                </div>
                <div className="lg:w-1/4 sm:w-1/7 md:w-2/7"></div>
            </div>
        </>
    )
}

export default Followers