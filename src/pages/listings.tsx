import dynamic from 'next/dynamic'

const Header = dynamic(
    () => import('@components/Home/Header'),
    { ssr: false }
)

import Listings from '@components/Listings'

const ContestListings = () => {
    return (
        <>
            <Header />
            <Listings />
        </>
    )
}

export default ContestListings