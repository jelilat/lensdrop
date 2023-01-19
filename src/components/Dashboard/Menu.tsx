
import { Ticket, BrandGoogleAnalytics, SmartHome, AirBalloon } from 'tabler-icons-react'
import { LogoutIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'

const Menu = () => {
    const router = useRouter();

    return (
        <>
            <div className="">
                <nav className="p-2 rounded-3xl m-10 mt-1 bg-gradient-to-r from-cyan-300 to-blue-400 shadow-xl h-screen">
                    <a className="flex font-bold items-center px-2 py-2 mt-5 mb-10 text-white group" href="/">
                        Lensdrop
                    </a>
                    <a className={`flex items-center justify-center p-2 text-white group ${router.pathname == '/dashboard' && "border-l-2 border-white"}`} href="/dashboard">
                        <SmartHome className="w-7 m-1" />
                        {/* <span className="text-sm font-medium text-white transition duration-150 ease-in-out group-hover:text-gray-300">Dashboard</span> */}
                    </a>
                    <a className={`flex items-center justify-center p-2 mt-4 text-white group ${router.pathname == '/dashboard/airdrops' && "border-l-2 border-white"}`} href="/dashboard/airdrops">
                        <AirBalloon className="w-7 m-1" />
                        {/* <span className="text-sm font-medium text-white transition duration-150 ease-in-out group-hover:text-gray-300">Airdrops</span> */}
                    </a>
                    <a className={`flex items-center justify-center p-2 mt-4 text-white group ${router.pathname == '/dashboard/sponsored-posts' && "border-l-2 border-white"}`} href="/dashboard/sponsored-posts">
                        <Ticket className="w-7 m-1" />
                        {/* <span className="text-sm font-medium text-white transition duration-150 ease-in-out group-hover:text-gray-300">Sponsored Posts</span> */}
                    </a>
                    <a className={`flex items-center justify-center p-2 mt-4 text-white group ${router.pathname == '/dashboard/analytics' && "border-l-2 border-white"}`} href="/dashboard/analytics">
                        <BrandGoogleAnalytics className="w-7 m-1 transition ease-in-out duration-300 group-hover:ease-in" />
                        {/* <span className="text-sm font-medium text-white transition duration-150 ease-in-out group-hover:text-gray-300">Analytics</span> */}
                    </a>
                </nav>
            </div>
        </>
    )
}

export default Menu