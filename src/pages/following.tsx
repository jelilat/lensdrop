import dynamic from 'next/dynamic'

const Header = dynamic(
    () => import('@components/Home/Header'),
    { ssr: false }
)

import Hero from '@components/Home/Hero';
import Follow from '@components/Download/Following';

const Following = () => {

    return (
        <>
            <Header />
            <Hero />
            <Follow />
        </>
    )
}

export default Following