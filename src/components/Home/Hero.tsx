
import { APP_NAME } from 'src/constants'
import Link from 'next/link'

const Hero = ()=> {

    return (
        <>
            <div className="flex w-full">
                <div className="lg:w-1/4 md:w-1/5 sm:w-3">
                
                </div>
                <div className='lg:w-1/2 md:w-3/5 sm:w-full'>
                    <div className="text-center py-4 lg:px-4 cursor-pointer">
                        <div 
                            className="p-2 bg-gradient-to-r from-cyan-400 to-blue-400 items-center text-white leading-none lg:rounded-full flex lg:inline-flex" role="alert">
                            <div className="flex rounded-full bg-cyan-600 uppercase px-2 py-1 text-xs font-bold mr-3">New ✨</div> 
                            <div className="font-semibold mr-2 text-left flex-auto">View real-time analytics on the Lensdrop Dashboard!</div>
                            <Link href="/dashboard">
                                <svg className="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"/></svg>
                            </Link>
                        </div>
                    </div>
                    <div className="rounded-lg border-0 my-5 content-center place-items-center">
                        <div className="py-6 mb-4 px-5 rounded-lg border-b bg-hero bg-gradient-to-r from-cyan-400 to-blue-400">
                            <div className="container lg:px-5 sm:px-1 mx-auto max-w-screen-xl">
                                <div className="flex items-stretch w-full text-left sm:text-center">
                                    <div className="flex-1 flex-shrink-0 space-y-3 sm:text-center">
                                        <div className="text-xl font-extrabold text-black sm:text-2xl">
                                        {APP_NAME} 🪂
                                        </div>
                                        <div className="leading-7 text-gray-700 sm:text-sm">
                                            Gain more followers and boost engagements on Lens Protocol 🌿
                                        </div>
                                    </div>
                                    <div className="sm:hidden flex-1 flex-shrink-0 w-full block" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="llg:w-1/4 md:w-1/5 sm:w-3"></div>
            </div>
        </>
    )
}

export default Hero