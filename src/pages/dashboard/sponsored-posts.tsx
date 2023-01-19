import { useState, useEffect } from 'react';
import { getSponsoredPosts, startMoralis } from '@components/utils/airdrops';
import { useAppContext } from '@components/utils/AppContext';
import Menu from '@components/Dashboard/Menu';
import Image from 'next/image';
import Link from 'next/link';

const SponsoredPosts = () => {
    const { profiles } = useAppContext();
    const [sponsoredPosts, setSponsoredPosts] = useState<any>();

    useEffect(() => {
        const sponsoredPosts = async () => {
            startMoralis();
            const sponsoredPosts = (await getSponsoredPosts(profiles[0]?.ownedBy!))?.result?.toString();
            setSponsoredPosts(sponsoredPosts!);
        }
        if (profiles[0]) {
            // sponsoredPosts();
        }
    }, [profiles]);

    return (
        <>
            <div className="flex justify-start h-screen">
                <div className="hidden lg:flex">
                    <Menu />
                </div>
                <div className='flex items-center justify-center w-full'>
                    <div className=''>
                        <div className='text-center'>
                            <Image src="/advert.png" alt="analytics" width={200} height={200} />
                        </div>
                        <div className='text-center font-bold text-lg my-1'>
                            Sponsored Posts Coming Soon!
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

export default SponsoredPosts;