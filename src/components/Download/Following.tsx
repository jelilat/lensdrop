import { FC, useState, useEffect } from 'react'
import Image from 'next/image'
import CsvDownloader from 'react-csv-downloader';
import { useAppContext } from '@components/utils/AppContext'
import Filter from '@components/Filter'
import { Filterer } from '@components/utils/Filterer'
import PrizeDraw from './PrizeDraw';
import Connect from '@components/Home/Connect'
import { Modal } from '@components/UI/Modal';
import { useAccount } from 'wagmi'

const Followers: FC = () => {
    const { profiles, followings, filters } = useAppContext()
    const { isConnected } = useAccount()
    const [showFollowing, setShowFollowing] = useState<boolean>(false)
    const [datas, setdatas] = useState<{address: string}[]>([])
    const [data, setData] = useState<string[]>([])
    const [connectModal, setConnectModal] = useState<boolean>(false)
    const [loading, isLoading] = useState<boolean>(false)

    const addressFilterer = async () => {
        if (filters[0].reaction !== "") {
            const filteredAddresses = await Filterer(filters);
            if (filteredAddresses.length > 0) {
                const addresses = filteredAddresses?.filter(address => {
                    return followings.includes(address)
                }); 
                setData(addresses)
                const data = addresses.map(addr => {
                    return {address: addr}
                })
                setdatas(datas => [...datas, ...data])
            }
        } else {
            setData(followings)
            setdatas(followings.map(following => ({address: following})))
        }
    }

    return (
        <>
            <div className="flex text-sm">
                <div className="lg:w-1/4 sm:w-3 md:w-1/5"></div>
                <div className="lg:w-1/2 sm:w-full grow sm:mx-3 md:mx-">
                    <Filter />
                    { !showFollowing ? 
                        <button className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
                        disabled={!((profiles[0]?.stats?.totalFollowing <= followings.length) && isConnected) || loading}
                                onClick={async () => {
                                    isLoading(true)
                                    await addressFilterer()
                                    setShowFollowing(true)
                                    isLoading(false)
                                }}>
                            {
                                loading || ((profiles[0]?.stats?.totalFollowing > followings.length) && isConnected) ? 
                                <div className="flex justify-center items-center">
                                    <span>Fetching data. This may take a while...</span>
                                    <svg className="animate-spin -mr-1 ml-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                </div>
                                : "View Following" 
                            }
                        </button>
                       : !isConnected ? 
                       <div className="text-center">
                           <button className="rounded-lg bg-black text-white p-2"
                                onClick={() => {
                                    setConnectModal(true)
                                }}
                                data-bs-toggle="modal">
                                Connect wallet
                                <Modal
                                    title="Connect Wallet"
                                    show={connectModal}
                                    onClose={()=>{
                                        setConnectModal(false)
                                    }}>
                                        <Connect />
                                </Modal>
                            </button> to view following
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
                    {
                        (showFollowing && data.length > 0) &&
                            <PrizeDraw addresses={data} type={'Offchain'} sharePost={true} />
                    }
                </div>
                <div className="lg:w-1/4 sm:w-3 md:w-1/5"></div>
            </div>
        </>
    )
}

export default Followers