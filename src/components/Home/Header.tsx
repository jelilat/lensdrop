import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from "next/router";
import SetContext from '@components/utils/SetContext'
import { XIcon } from '@heroicons/react/solid'
import { ArrowRight } from 'tabler-icons-react'
import Profile from './Profile';

const Header = () => {
    const [navOpen, setNavOpen] = useState<boolean>(false)
    const [offchainOpen, setOffchainOpen] = useState<boolean>(false)

    return (
        <>
            <SetContext />
            <div className="flex text-sm p-3 border-b-2 border-b-black-500 sticky top-0 bg-white w-full z-10">
                <div className="lg:w-1/3 sm:w-1/2 float-right p-2 font-semibold">
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
                                <ul className="grid grid-cols-1 divide-y items-center justify-between min-h-[250px] bg-gray-50 border-2 rounded-xl">
                                    <li className="">
                                        <div className={`p-3 text-center`}>
                                            <Link className=""
                                                href="/" >
                                                Home
                                            </Link>
                                        </div>
                                    </li>
                                    <li className="">
                                        <div className={`p-3 text-center`}>
                                            <Link className=""
                                                href="/followers" >
                                                Followers
                                            </Link>
                                        </div>
                                    </li>
                                    <li className="">
                                    <div className={`p-3 text-center`}>
                                            <Link className=""
                                                href="/following" >
                                                Following
                                            </Link>
                                        </div>
                                    </li>
                                    <li className="">
                                        <div className={`p-3 text-center`}>
                                            <Link className=""
                                                href="/any" >
                                                Any
                                            </Link>
                                        </div>
                                    </li>
                                    <li className="">
                                        <div className={`p-3 text-center`}>
                                            <Link className=""
                                                href="/sponsor" >
                                                Sponsored Posts
                                            </Link>
                                        </div>
                                    </li>
                                    <li className="flex p-3 justify-center">
                                        <Profile />
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
                <div className="lg:w-1/3 hidden lg:flex justify-center">
                    <div className={`mx-1 p-2 justify-center text-center ${useRouter().pathname === "/" ?
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
                                <div className={`mx-1 p-2 ${useRouter().pathname === "/followers" ?
                                    "bg-gray-200 rounded-lg" : null}`}>
                                    <Link className=""
                                        href="/followers" >
                                        <div className="text-gray-900">
                                            Followers
                                            <ArrowRight className="w-5 mx-1 inline-block" />
                                        </div>
                                    </Link>
                                </div>
                            </li>
                            <li className="cursor-pointer">
                                <div className={`mx-1 p-2 ${useRouter().pathname === "/following" ?
                                    "bg-gray-200 rounded-lg" : null}`}>
                                    <Link className=""
                                        href="/following" >
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
            <div className="w-1/3 hidden lg:flex justify-center">
                <Profile />
            </div>
            </div>
        </>
    )
}

export default Header