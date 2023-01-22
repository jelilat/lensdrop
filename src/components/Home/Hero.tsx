
import { APP_NAME } from 'src/constants'

const Hero = ()=> {

    return (
        <>
            <div className="flex w-full">
                <div className="lg:w-1/4 md:w-1/5 sm:w-3">
                
                </div>
                <div className="lg:w-1/2 md:w-3/5 sm:w-full rounded-lg border-0 my-5 content-center place-items-center">
                    <div className="py-6 mb-4 px-5 rounded-lg border-b bg-hero dark:border-b-gray-700/80 bg-gradient-to-r from-cyan-200 to-blue-300">
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
                <div className="llg:w-1/4 md:w-1/5 sm:w-3"></div>
            </div>
        </>
    )
}

export default Hero