import { FC, useState } from 'react'
import Filter from '@components/Filter'
import CsvDownloader from 'react-csv-downloader';
import { useAppContext } from '@components/utils/AppContext'
import { Filterer } from '@components/utils/Filterer'
import { Draw } from '@components/utils/draw'
import { Profile } from '@generated/types'

const All: FC = () => {
    const { filters } = useAppContext()
    const [showFollowers, setShowFollowers] = useState<boolean>(false)
    const [datas, setdatas] = useState<{address: string}[]>([])
    const [data, setData] = useState<string[]>([])
    const [winner, setWinner] = useState<Profile>()

    const addressFilterer = async () => {
        if (filters[0].reaction !== "") {
            const filteredAddresses = await Filterer(filters);
            if (filteredAddresses.length > 0) {
                setData(filteredAddresses)
                const data = filteredAddresses.map(addr => {
                    return {address: addr}
                })
                setdatas(datas => [...datas, ...data])
            }
        }
    }

    const createDraw = async () => {
        await addressFilterer()
        const winner = await Draw(data)
        console.log("winner", winner)

        setWinner(winner!)
    }

    return (
        <>
            <div className="flex text-sm">
                <div className="lg:w-1/4 sm:w-1/7 md:w-2/7"></div>
                <div className="lg:w-1/2 sm:w-full grow">
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
                                    value={data.length > 0? data : "No match found"} readOnly />
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
                    <div>
                        <button className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
                                onClick={async () => {
                                    await createDraw()
                                }}
                            >
                            Create Prize Draw
                        </button>
                        <div>
                            {
                                winner && <div>
                                    The Winner is <span className="font-bold">{winner?.handle}</span>, and is owned by <span className="font-bold">{winner?.ownedBy}</span>
                                </div>
                            }
                        </div>
                        {
                            !filters[0].publication && <div className="justify-center">
                                Add filter to publication to create prize draw
                            </div>
                        }
                    </div>
                </div>
                <div className="lg:w-1/4 sm:w-1/7 md:w-2/7"></div>
            </div>
        </>
    )
}

export default All