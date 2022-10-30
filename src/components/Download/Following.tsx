import { FC, useState, useEffect } from 'react'
import Image from 'next/image'
import CsvDownloader from 'react-csv-downloader';
import { useAppContext } from '@components/utils/AppContext'
import Filter from '@components/Filter'
import { Filterer } from '@components/utils/Filterer'
import PrizeDraw from './PrizeDraw';
import Connect from '@components/Home/Connect'
import { Modal } from '@components/UI/Modal';

const Followers: FC = () => {
    const { address, followings, filters } = useAppContext()
    const [showFollowing, setShowFollowing] = useState<boolean>(false)
    const [datas, setdatas] = useState<{address: string}[]>([])
    const [data, setData] = useState<string[]>([])
    const [connectModal, setConnectModal] = useState<boolean>(false)

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
        }
    }

    useEffect(() => {
        if (followings.length > 0) { 
            setdatas(followings.map(following => ({address: following})))
        }
    }, [followings])

    return (
        <>
            <div className="flex text-sm">
                <div className="lg:w-1/4 sm:w-3 md:w-1/5"></div>
                <div className="lg:w-1/2 sm:w-full grow sm:mx-3 md:mx-">
                    <Filter />
                    { !showFollowing ? 
                        <button className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
                                onClick={async () => {
                                    addressFilterer()
                                    setShowFollowing(true)
                                }}>
                            View Following
                        </button>
                       : !address ? 
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
                    <PrizeDraw addresses={followings} type={'Offchain'} />
                </div>
                <div className="lg:w-1/4 sm:w-3 md:w-1/5"></div>
            </div>
        </>
    )
}

export default Followers