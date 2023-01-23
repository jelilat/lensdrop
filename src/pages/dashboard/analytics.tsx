import Menu from '@components/Dashboard/Menu';
import Image from 'next/image';
import Link from 'next/link';

const Analytics = () => {
    return(
        <>
            <div className="lg:flex sm:block justify-start h-screen">
                <Menu />
                <div className='flex items-center justify-center w-full'>
                    <div className=''>
                        <div className='text-center'>
                            <Image src="/analytics.png" alt="analytics" width={200} height={200} />
                        </div>
                        <div className='text-center font-bold text-lg my-1'>
                            Analytics Feature Coming Soon!
                        </div>
                        <div className='text-center my-1 w-96'>
                            If you want to know when this feature becomes available, follow us on Lens <a href="https://lenster.xyz/u/lensdropxyz" target="_blank" rel="noreferrer"
                                    className="text-blue-500 hover:text-blue-700">@lensdropxyz</a>.
                        </div>
                        <div className='text-center my-1 p-2'>
                            <span className="text-blue-500 hover:text-blue-700 hover:underline hover:underline-offset-2"><Link href="/"
                                    >Go back</Link></span> to the Homepage.
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Analytics;