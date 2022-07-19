import dynamic from 'next/dynamic'

const Homepage = dynamic(
    () => import('@components/Home'),
    { ssr: false }
)

export default Homepage