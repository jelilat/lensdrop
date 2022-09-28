import { FC, useState } from 'react'
import Filter from '@components/Filter'
import CsvDownloader from 'react-csv-downloader';
import { useAppContext } from '@components/utils/AppContext'
import { Filterer } from '@components/utils/Filterer'
import PrizeDraw from './PrizeDraw';

const All: FC = () => {
    const { filters } = useAppContext()
    const [showFollowers, setShowFollowers] = useState<boolean>(false)
    const [datas, setdatas] = useState<{address: string}[]>([])
    const [data, setData] = useState<string[]>([])
    const [fetching, setFetching] = useState<boolean>()

    const addressFilterer = async () => {
        if (filters[0].reaction !== "") {
            setFetching(true)
            const filteredAddresses = await Filterer(filters);
            setFetching(false)
 
            if (filteredAddresses.length > 0) {
                setData(filteredAddresses)
                const data = filteredAddresses.map(addr => {
                    return {address: addr}
                })
                setdatas(datas => [...datas, ...data])
            }
        }
    }

    return (
        <>
            <div className="flex text-sm">
                <div className="lg:w-1/4 sm:w-1/7 md:w-2/7"></div>
                <div className="lg:w-1/2 sm:w-full grow sm:mx-3 md:mx-">
                    <Filter />
                    { !showFollowers ? 
                        <button className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
                                onClick={async () => {
                                    addressFilterer()
                                    setShowFollowers(true)
                                }}>
                            View Addresses
                        </button>
                       : <div>
                           <div className="my-5 font-semibold">
                               All addresses
                            </div>
                           <div>
                               <textarea className="h-96 w-full p-3 rounded-lg border-2 border-b-black-500" 
                                    value={fetching ? "Fetching addresses..." : (data.length > 0? data : "No match found")} readOnly />
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
                    <PrizeDraw addresses={data} type='Offchain' />
                </div>
                <div className="lg:w-1/4 sm:w-1/7 md:w-2/7"></div>
            </div>
        </>
    )
}

export default All