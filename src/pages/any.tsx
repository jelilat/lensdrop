import dynamic from 'next/dynamic'
import Hero from '@components/Home/Hero';
import Users from '@components/Download/All';

const All = () => {

    return (
        <>
            <Hero />
            <Users />
        </>
    )
}

export default All