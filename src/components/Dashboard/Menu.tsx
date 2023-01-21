
import { Ticket, BrandGoogleAnalytics, SmartHome, AirBalloon } from 'tabler-icons-react'
import { LogoutIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Menu = () => {
    const router = useRouter();

    return (
        <>
            <div className="">
                <nav className="sm:flex md:flex lg:block p-2 rounded-3xl lg:m-10 mt-1 lg:bg-gradient-to-r from-cyan-300 to-blue-400 lg:shadow-xl lg:h-screen">
                    <div className="hidden lg:flex cursor-pointer font-bold items-center px-2 py-2 mt-5 mb-10 text-white group" >
                        <Link href="/">
                            Lensdrop
                        </Link>
                    </div>
                    <div className={`cursor-pointer flex items-center justify-center p-2 sm:w-1/4 text-white group ${router.pathname == '/dashboard' && "lg:border-l-2 border-white"}`}>
                        <Link href="/dashboard">
                            <div>
                                <button className={`hidden sm:flex p-2 rounded-2xl text-sm border-2 border-blue-500 text-blue-500 ${router.pathname == '/dashboard' && "bg-blue-500 text-white"}`}>
                                    Dashboard
                                </button>
                                <SmartHome className="w-7 m-1 hidden lg:flex transition ease-in-out duration-300 group-hover:ease-in" />
                            </div>
                        </Link>
                    </div>
                    <div className={`cursor-pointer flex items-center justify-center p-2 sm:w-1/4 lg:mt-4 text-white group ${router.pathname == '/dashboard/airdrops' && "lg:border-l-2 border-white"}`}>
                        <Link href="/dashboard/airdrops">
                            <div>
                                <button className={`hidden sm:flex p-2 rounded-2xl text-sm border-2 border-blue-500 text-blue-500 ${router.pathname == '/dashboard/airdrops' && "bg-blue-500 text-white"}`}>
                                    Airdrops
                                </button>
                                <AirBalloon className="w-7 m-1 hidden lg:flex transition ease-in-out duration-300 group-hover:ease-in" />
                            </div>
                        </Link>
                    </div>
                    <div className={`cursor-pointer flex items-center justify-center p-2 sm:w-1/4 lg:mt-4 text-white group ${router.pathname == '/dashboard/sponsored-posts' && "lg:border-l-2 border-white"}`}>
                        <Link href="/dashboard/sponsored-posts">
                            <div>
                                <button className={`hidden sm:flex p-2 rounded-2xl text-sm border-2 border-blue-500 text-blue-500 ${router.pathname == '/dashboard/sponsored-posts' && "bg-blue-500 text-white"}`}>
                                    Sponsored
                                </button>
                                <Ticket className="w-7 m-1 hidden lg:flex transition ease-in-out duration-300 group-hover:ease-in" />
                            </div>
                        </Link>
                    </div>
                    <div className={`cursor-pointer flex items-center justify-center p-2 sm:w-1/4 lg:mt-4 text-white group ${router.pathname == '/dashboard/analytics' && "lg:border-l-2 border-white"}`}>
                        <Link href="/dashboard/analytics">
                            <div>
                                <button className={`hidden sm:flex p-2 rounded-2xl text-sm border-2 border-blue-500 text-blue-500 ${router.pathname == '/dashboard/analytics' && "bg-blue-500 text-white"}`}>
                                    Analytics
                                </button>
                                <BrandGoogleAnalytics className="w-7 m-1 hidden lg:flex transition ease-in-out duration-300 group-hover:ease-in" />
                            </div>
                        </Link>
                    </div>
                </nav>
            </div>
        </>
    )
}

export default Menu