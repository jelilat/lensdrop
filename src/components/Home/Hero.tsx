
import { APP_NAME } from 'src/constants'

const Hero = ()=> {

    return (
        <>
            <div className="flex w-full">
                <div className="lg:w-1/4 sm:w-1/5">

                </div>
                <div className="lg:w-1/2 sm:3/5 rounded-lg border-0 my-5 content-center place-items-center sm:mx-3 md:mx-">
                    <div className="py-6 mb-4 rounded-lg border-b bg-hero dark:border-b-gray-700/80 bg-gradient-to-r from-cyan-200 to-blue-300">
                        <div className="container px-5 mx-auto max-w-screen-xl">
                            <div className="flex items-stretch w-full text-center sm:text-left">
                                <div className="flex-1 flex-shrink-0 space-y-3">
                                    <div className="text-2xl font-extrabold text-black sm:text-4xl">
                                    {APP_NAME} 🪂
                                    </div>
                                    <div className="leading-7 text-gray-700">
                                        Reward your Lens Protocol 🌿 followers and fans with airdrops and special prizes.
                                    </div>
                                </div>
                                <div className="hidden flex-1 flex-shrink-0 w-full sm:block" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/4 sm:w-1/5"></div>
            </div>
        </>
    )
}

export default Hero