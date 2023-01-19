import dynamic from 'next/dynamic'
import Hero from '@components/Home/Hero';
import Follow from '@components/Download/Following';

const Following = () => {

    return (
        <>
            <Hero />
            <Follow />
        </>
    )
}

export default Following