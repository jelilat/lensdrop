import Menu from '@components/Dashboard/Menu';
import Header from '@components/Home/Header';
import Image from 'next/image';

const Analytics = () => {
    return(
        <>
            <Header />
            <div className="flex justify-start h-screen">
                <Menu />
                <div className='flex items-center justify-center w-full'>
                    <div className=''>
                        <div className='text-center'>
                            <Image src="/analytics.jpg" alt="analytics" width={200} height={200} />
                        </div>
                        <div className='text-center font-bold text-lg my-1'>
                            Analytics Feature Coming Soon!
                        </div>
                        <div className='text-center my-1 w-96'>
                            If you want to know when this feature becomes available, follow us on Lens <a href="https://lenster.xyz/u/lensdropxyz" target="_blank" rel="noopener"
                                    className="text-blue-500 hover:text-blue-700">@lensdropxyz</a>.
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Analytics;