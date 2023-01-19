import dynamic from 'next/dynamic'
import Hero from '@components/Home/Hero';
import Follower from '@components/Download/Followers';

const Followers = () => {

    return (
        <>
            <Hero />
            <Follower />
        </>
    )
}

export default Followers