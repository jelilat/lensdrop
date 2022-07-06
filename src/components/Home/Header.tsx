import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from "next/router";
import { Modal } from '@components/UI/Modal';
import Connect from './Connect'
import { useAccount } from 'wagmi'
import SetContext from '@components/utils/SetContext'

const Header = () => {
    const { address, isConnected } = useAccount()
    const [connectModal, setConnectModal] = useState<boolean>(false)

    return (
        <>
            <SetContext />
            <div className="flex text-sm p-3 border-b-2 border-b-black-500 sticky top-0 bg-white">
                <div className="lg:w-2/5 sm:w-1/5 float-right p-2 font-semibold">
                    Lensdrop
                </div>
                <div className="lg:w-2/5 sm:w-3/5 flex content-center">
                    <div className={`mx-1 p-2 ${useRouter().pathname === "/" ?
                            "bg-gray-200 rounded-lg" : null}`}>
                        <Link className=""
                            href="/" >
                            Home
                        </Link>
                    </div>
                    <div className={`mx-1 p-2 ${useRouter().pathname === "/followers" ?
                            "bg-gray-200 rounded-lg" : null}`}>
                        <Link className=""
                            href="/followers" >
                            Followers
                        </Link>
                    </div>
                    <div className={`mx-1 p-2 ${useRouter().pathname === "/following" ?
                            "bg-gray-200 rounded-lg" : null}`}>
                        <Link className=""
                            href="/following" >
                            Following
                        </Link>
                    </div>
                </div>
                <div className="w-1/5">
                    <button className="rounded-lg bg-black text-white p-2"
                        onClick={() => {
                            setConnectModal(true)
                        }}
                        data-bs-toggle="modal">
                        {!isConnected || address == undefined ? 
                            "Connect wallet"
                            : (address)?.slice(0, 6) + "..." + (address)?.slice(-4)
                            }
                        <Modal
                            title="Connect Wallet"
                            show={connectModal}
                            onClose={()=>{
                                setConnectModal(false)
                            }}>
                                <Connect />
                            </Modal>
                    </button>
                </div>
            </div>
            <div className="hidden mobile-menu">

            </div>
        </>
    )
}

export default Header