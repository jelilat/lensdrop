import dynamic from 'next/dynamic'

const Header = dynamic(
    () => import('@components/Home/Header'),
    { ssr: false }
)
import Hero from '@components/Home/Hero';
import Users from '@components/Download/All';

const All = () => {

    return (
        <>
            <Header />
            <Hero />
            <Users />
        </>
    )
}

export default All