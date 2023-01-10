import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from "next/router";
import { Modal } from '@components/UI/Modal';
import Connect from './Connect'
import { useAccount } from 'wagmi'
import SetContext from '@components/utils/SetContext'
import { XIcon } from '@heroicons/react/solid'
import { ArrowRight } from 'tabler-icons-react'

const Header = () => {
    const { address, isConnected } = useAccount()
    const [connectModal, setConnectModal] = useState<boolean>(false)
    const [navOpen, setNavOpen] = useState<boolean>(false)
    const [offchainOpen, setOffchainOpen] = useState<boolean>(false)

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
                                    <li className="my-2 border-b border-gray-50 cursor-pointer">
                                        <div className={`mx-1 p-2`}>
                                            <Link className=""
                                                href="/sponsor" >
                                                Sponsor
                                            </Link>
                                        </div>
                                    </li>
                                    <li className="group">
                                        <div className="mx-1 p-2 cursor-pointer">
                                            Offchain Airdrop
                                        </div>
                                        <ul className="absolute invisible group-hover:visible bg-white border-2 rounded-lg p-2 z-10">
                                            <li className="my-2 border-b border-gray-50">
                                                <div className={`mx-1 p-2`}>
                                                    <Link className=""
                                                        href="/app/followers" >
                                                        <div className="text-gray-900">
                                                            Followers
                                                            <ArrowRight className="w-5 mx-1 inline-block" />
                                                        </div>
                                                    </Link>
                                                </div>
                                            </li>
                                            <li className="my-2 border-b border-gray-50 cursor-pointer">
                                                <div className={`mx-1 p-2`}>
                                                    <Link className=""
                                                        href="/app/following" >
                                                        <div className="text-gray-900">
                                                            Following
                                                            <ArrowRight className="w-5 mx-1 inline-block" />
                                                        </div>
                                                    </Link>
                                                </div>
                                            </li>
                                            <li className="my-2 border-b border-gray-50">
                                                <div className={`mx-1 p-2`}>
                                                    <Link className=""
                                                        href="/any" >
                                                        <div className="text-gray-900">
                                                            Any
                                                            <ArrowRight className="w-5 mx-1 inline-block" />
                                                        </div>
                                                    </Link>
                                                </div>
                                            </li>
                                        </ul>
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
                    <div className={`mx-1 p-2 ${useRouter().pathname === "/sponsor" ?
                            "bg-gray-200 rounded-lg" : null}`}>
                        <Link className=""
                            href="/sponsor" >
                            Sponsored Posts
                        </Link>
                    </div>
                    <div className='group'>
                        <div className="mx-1 p-2 cursor-pointer">
                            Offchain Airdrop
                        </div>
                        <ul className="absolute invisible group-hover:visible bg-white border-2 rounded-lg p-2 z-10">
                            <li className="cursor-pointer">
                                <div className={`mx-1 p-2 ${useRouter().pathname === "/app/followers" ?
                                    "bg-gray-200 rounded-lg" : null}`}>
                                    <Link className=""
                                        href="/app/followers" >
                                        <div className="text-gray-900">
                                            Followers
                                            <ArrowRight className="w-5 mx-1 inline-block" />
                                        </div>
                                    </Link>
                                </div>
                            </li>
                            <li className="cursor-pointer">
                                <div className={`mx-1 p-2 ${useRouter().pathname === "/app/following" ?
                                    "bg-gray-200 rounded-lg" : null}`}>
                                    <Link className=""
                                        href="/app/following" >
                                        <div className="text-gray-900">
                                            Following
                                            <ArrowRight className="w-5 mx-1 inline-block" />
                                        </div>
                                    </Link>
                                </div>
                            </li>
                            <li className="cursor-pointer">
                                <div className={`mx-1 p-2 ${useRouter().pathname === "/any" ?
                                        "bg-gray-200 rounded-lg" : null}`}>
                                    <Link className=""
                                        href="/any" >
                                        <div className="text-gray-900">
                                            Any
                                            <ArrowRight className="w-5 mx-1 inline-block" />
                                        </div>
                                    </Link>
                                </div>
                            </li>
                        </ul>
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