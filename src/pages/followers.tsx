import dynamic from 'next/dynamic'

const Header = dynamic(
    () => import('@components/Home/Header'),
    { ssr: false }
)
import Hero from '@components/Home/Hero';
import Follower from '@components/Download/Followers';

const Followers = () => {

    return (
        <>
            <Header />
            <Hero />
            <Follower />
        </>
    )
}

export default Followers