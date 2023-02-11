import { FC, useState } from 'react'
import Filter from '@components/Filter'
import CsvDownloader from 'react-csv-downloader';
import { useAppContext } from '@components/utils/AppContext'
import { Filterer } from '@components/utils/Filterer'
import PrizeDraw from './PrizeDraw';

const All: FC = () => {
    const { filters, minimumFollowers, setMinimumFollowers } = useAppContext()
    const [showFollowers, setShowFollowers] = useState<boolean>(false)
    const [datas, setdatas] = useState<{address: string}[]>([])
    const [data, setData] = useState<string[]>([])
    const [fetching, setFetching] = useState<boolean>()

    const addressFilterer = async () => {
        if (filters[0].reaction !== "") {
            setFetching(true)
            const filteredAddresses = await Filterer(filters, minimumFollowers);
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
                <div className="lg:w-1/4 sm:w-3 md:w-1/5"></div>
                <div className="lg:w-1/2 sm:w-full grow sm:mx-3 md:mx-">
                    <Filter />
                    <div className="font-semibold my-1">
                        Recipients should have atleast 
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
                    { !showFollowers ? 
                        <button className="w-full h-12 px-6 my-2 text-white transition-colors duration-150 rounded-lg focus:shadow-outline  bg-gradient-to-r from-cyan-400 to-blue-400"
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
                                <button className="w-full h-12 px-6 my-2 text-white transition-colors duration-150 rounded-lg focus:shadow-outline  bg-gradient-to-r from-cyan-400 to-blue-400"
                                    >
                                Download as CSV
                                </button>
                            </CsvDownloader>
                            
                        </div>
                       </div>
                    }
                    <PrizeDraw addresses={data} type='Offchain' sharePost={true} />
                </div>
                <div className="lg:w-1/4 sm:w-3 md:w-1/5"></div>
            </div>
        </>
    )
}

export default All