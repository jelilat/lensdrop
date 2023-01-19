
import { Ticket, BrandGoogleAnalytics, SmartHome, AirBalloon } from 'tabler-icons-react'
import { LogoutIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Menu = () => {
    const router = useRouter();

    return (
        <>
            <div className="">
                <nav className="p-2 rounded-3xl m-10 mt-1 bg-gradient-to-r from-cyan-300 to-blue-400 shadow-xl h-screen">
                    <div className="cursor-pointer flex font-bold items-center px-2 py-2 mt-5 mb-10 text-white group" >
                        <Link href="/">
                            Lensdrop
                        </Link>
                    </div>
                    <div className={`cursor-pointer flex items-center justify-center p-2 text-white group ${router.pathname == '/dashboard' && "border-l-2 border-white"}`}>
                        <Link href="/dashboard">
                            <SmartHome className="w-7 m-1" />
                            {/* <span className="text-sm font-medium text-white transition duration-150 ease-in-out group-hover:text-gray-300">Dashboard</span> */}
                        </Link>
                    </div>
                    <div className={`cursor-pointer flex items-center justify-center p-2 mt-4 text-white group ${router.pathname == '/dashboard/airdrops' && "border-l-2 border-white"}`}>
                        <Link href="/dashboard/airdrops">
                            <AirBalloon className="w-7 m-1" />
                            {/* <span className="text-sm font-medium text-white transition duration-150 ease-in-out group-hover:text-gray-300">Airdrops</span> */}
                        </Link>
                    </div>
                    <div className={`cursor-pointer flex items-center justify-center p-2 mt-4 text-white group ${router.pathname == '/dashboard/sponsored-posts' && "border-l-2 border-white"}`}>
                        <Link href="/dashboard/sponsored-posts">
                            <Ticket className="w-7 m-1" />
                            {/* <span className="text-sm font-medium text-white transition duration-150 ease-in-out group-hover:text-gray-300">Sponsored Posts</span> */}
                        </Link>
                    </div>
                    <div className={`cursor-pointer flex items-center justify-center p-2 mt-4 text-white group ${router.pathname == '/dashboard/analytics' && "border-l-2 border-white"}`}>
                        <Link href="/dashboard/analytics">
                            <BrandGoogleAnalytics className="w-7 m-1 transition ease-in-out duration-300 group-hover:ease-in" />
                            {/* <span className="text-sm font-medium text-white transition duration-150 ease-in-out group-hover:text-gray-300">Analytics</span> */}
                        </Link>
                    </div>
                </nav>
            </div>
        </>
    )
}

export default Menu