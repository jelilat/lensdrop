import { FC, useState, useEffect } from 'react'
import Image from 'next/image'
import CsvDownloader from 'react-csv-downloader';
import { useAppContext } from '@components/utils/AppContext'
import Filter from '@components/Filter'
import { Filterer } from '@components/utils/Filterer'
import Script from 'next/script'

const Followers: FC = () => {
    const { address, followings, filters } = useAppContext()
    const [showFollowing, setShowFollowing] = useState<boolean>(false)
    const [datas, setdatas] = useState<{address: string}[]>([])
    const [data, setData] = useState<string[]>([])

    useEffect(() => {
        if (followings.length > 0) { 
            setdatas(followings.map(following => ({address: following})))
        }
    }, [followings])

    return (
        <>
            <div className="flex text-sm">
                <div className="lg:w-1/4 sm:w-1/7 md:w-2/7"></div>
                <div className="lg:w-1/2 sm:w-full grow">
                    <Filter />
                    { !showFollowing ? 
                        <button className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
                                onClick={async () => {
                                    if (filters[0].reaction !== "") {
                                        const filteredAddresses = await Filterer(filters);
                                        if (filteredAddresses.length > 0) {
                                            const addresses = filteredAddresses?.filter(address => {console.log(address)
                                                return followings.includes(address)
                                            }); 
                                            setData(addresses)
                                            const data = addresses.map(addr => {
                                                return {address: addr}
                                            })
                                            setdatas(datas => [...datas, ...data])
                                        }
                                    }
                                    setShowFollowing(true)
                                }}>
                            View Following
                        </button>
                       : address == undefined ? 
                       <div className="text-center">
                           Connect your wallet to view following
                       </div>
                       : <div>
                           <div className="my-5 font-semibold">
                           Following addresses
                            </div>
                           <div>
                               <textarea className="h-96 w-full p-3 rounded-lg border-2 border-b-black-500" 
                                    value={data.length > 0 ? data : "No match found"} readOnly />
                           </div>
                        <div>
                            <CsvDownloader 
                                datas={datas}
                                extension='.csv'
                                filename="Following addresses"
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
            {/* <span className="w-32"
            id="lens-embed" data-post-id="0xf5-0x17" /><Script src="https://embed.withlens.app/script.js" defer /> */}
        </>
    )
}

export default Followers