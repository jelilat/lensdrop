
import { Ticket, BrandGoogleAnalytics, SmartHome, Settings } from 'tabler-icons-react'
import { ReceiptTaxIcon, LogoutIcon } from '@heroicons/react/outline'

const Menu = () => {
    return (
        <>
            <div className="">
                <nav className="p-2 rounded-3xl m-10 bg-gradient-to-r from-cyan-300 to-blue-400 shadow-xl max-h-screen">
                    <a className="flex font-bold items-center px-2 py-2 mt-5 mb-10 text-white group" href="/">
                        Lensdrop
                    </a>
                    <a className="flex items-center justify-center px-2 py-2 text-white group" href="/dashboard">
                        <SmartHome className="w-7 m-1" />
                        {/* <span className="text-sm font-medium text-white transition duration-150 ease-in-out group-hover:text-gray-300">Dashboard</span> */}
                    </a>
                    <a className="flex items-center justify-center px-2 py-2 mt-4 text-white group" href="/dashboard/sponsored-posts">
                        <Ticket className="w-7 m-1" />
                        {/* <span className="text-sm font-medium text-white transition duration-150 ease-in-out group-hover:text-gray-300">Airdrops</span> */}
                    </a>
                    <a className="flex items-center justify-center px-2 py-2 mt-4 text-white group" href="/dashboard/analytics">
                        <BrandGoogleAnalytics className="w-7 m-1 transition ease-in-out duration-300 group-hover:ease-in" />
                        {/* <span className="text-sm font-medium text-white transition duration-150 ease-in-out group-hover:text-gray-300">Analytics</span> */}
                    </a>
                    <div className="flex items-center justify-center px-2 py-2 mt-96 text-white group">
                        <LogoutIcon className="w-7 m-1" />
                        {/* <span className="text-sm font-medium text-white transition duration-150 ease-in-out group-hover:text-gray-300">Settings</span> */}
                    </div>
                </nav>
            </div>
        </>
    )
}

export default Menu