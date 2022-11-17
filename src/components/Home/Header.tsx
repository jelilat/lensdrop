import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from "next/router";
import { Modal } from '@components/UI/Modal';
import Connect from './Connect'
import { useAccount } from 'wagmi'
import SetContext from '@components/utils/SetContext'
import { XIcon } from '@heroicons/react/solid'

const Header = () => {
    const { address, isConnected } = useAccount()
    const [connectModal, setConnectModal] = useState<boolean>(false)
    const [navOpen, setNavOpen] = useState<boolean>(false)

    return (
        <>
            <SetContext />
            <div className="flex text-sm p-3 border-b-2 border-b-black-500 sticky top-0 bg-white w-full">
                <div className="lg:w-2/5 sm:w-1/2 float-right p-2 font-semibold">
                    <Link className=""
                            href="/" >
                        Lensdrop
                    </Link>
                </div>
                <div className="w-1/2 lg:hidden absolute right-3 flex">
                    {
                        navOpen ? 
                            <div>
                                <div onClick={() => {setNavOpen(false)}}
                                    className="absolute top-0 right-0 p-2 cursor-pointer"
                                >
                                    <XIcon className="w-5" />
                                </div>
                                <ul className="NAVIGATION-MOBILE-OPEN flex flex-col items-center justify-between min-h-[250px] p-3 text-gray-50 bg-gray-800">
                                    <li className="my-2 border-b border-gray-50">
                                        <div className={`mx-1 p-2`}>
                                            <Link className=""
                                                href="/" >
                                                Home
                                            </Link>
                                        </div>
                                    </li>
                                    <li className="my-2 border-b border-gray-50">
                                        <div className={`mx-1 p-2`}>
                                            <Link className=""
                                                href="/followers" >
                                                Followers
                                            </Link>
                                        </div>
                                    </li>
                                    <li className="my-2 border-b border-gray-50">
                                    <div className={`mx-1 p-2`}>
                                            <Link className=""
                                                href="/following" >
                                                Following
                                            </Link>
                                        </div>
                                    </li>
                                    <li className="my-2 border-b border-gray-50">
                                        <div className={`mx-1 p-2`}>
                                            <Link className=""
                                                href="/all" >
                                                All
                                            </Link>
                                        </div>
                                    </li><li className="my-2 border-b border-gray-50">
                                        <div className={`mx-1 p-2`}>
                                            <Link className=""
                                                href="/listings" >
                                                Listings
                                            </Link>
                                        </div>
                                    </li>
                                    <li className="my-2">
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
                                    </li>
                                </ul>
                            </div>
                    :   <div onClick={() => {setNavOpen(true)}}
                            className="absolute top-0 right-0 p-2 space-y-1 cursor-pointer"
                        >
                            <span className="block h-0.5 w-5 animate-pulse bg-black"></span>
                            <span className="block h-0.5 w-5 animate-pulse bg-black"></span>
                            <span className="block h-0.5 w-5 animate-pulse bg-black"></span>
                        </div>
                    }
                </div>
                <div className="lg:w-2/5 hidden lg:flex content-center">
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
                    <div className={`mx-1 p-2 ${useRouter().pathname === "/all" ?
                            "bg-gray-200 rounded-lg" : null}`}>
                        <Link className=""
                            href="/all" >
                            All
                        </Link>
                    </div>
                    <div className={`mx-1 p-2 ${useRouter().pathname === "/listings" ?
                            "bg-gray-200 rounded-lg" : null}`}>
                        <Link className=""
                            href="/listings" >
                            Listings
                        </Link>
                    </div>
                </div>
                <div className="w-1/5 hidden lg:flex">
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
        </>
    )
}

export default Header