import { useAccount, useNetwork, useSignMessage } from 'wagmi'
import Image from 'next/image'
import Cookies, { CookieAttributes } from 'js-cookie';
import { GET_CHALLENGE } from '@graphql/Queries/Authenticate';
import { useLazyQuery, useMutation } from '@apollo/client';
import { AUTHENTICATION } from '@graphql/Mutations/Authenticate';
import Connect from './Connect'
import { useAppContext } from '@components/utils/AppContext';
import Link from 'next/link'
import { Dashboard, UserCircle } from 'tabler-icons-react';

const Profile = () => {
    const { address, isConnected } = useAccount()
    const { profiles } = useAppContext();
    const { chain } = useNetwork(); 

    const { signMessageAsync } = useSignMessage();
    const COOKIE_CONFIG: CookieAttributes = {
        sameSite: 'None',
        secure: true,
        expires: 60
      }
    const accessToken = Cookies.get(`accessToken-${address}`)

    const [getChallenge] = useLazyQuery(GET_CHALLENGE, {
       variables: { request: {
           address: address,
       }},
       fetchPolicy:'no-cache'
    })

    const [authenticate] = useMutation(AUTHENTICATION, {
        fetchPolicy:'no-cache'
   })

   return (
    <>
    {
        !accessToken || !isConnected ?
            <div>
                {!isConnected || address == undefined ? 
                    <Connect />
                    : <div>
                        {
                            profiles[0] == undefined ?
                                <Connect />
                                :<button className="flex rounded-lg bg-black text-white p-2"
                                onClick={()=>{
                                    getChallenge()
                                    .then(({data}) => {
                                        signMessageAsync({message: data?.challenge?.text})  
                                        .then(async (signature) => {
                                            await authenticate({
                                                variables: {
                                                    request: {
                                                        address: address, signature
                                                    }
                                                }
                                            })
                                            .then((res) => {
                                                Cookies.set(
                                                    `accessToken-${address}`,
                                                    res.data.authenticate.accessToken,
                                                    COOKIE_CONFIG
                                                )
                                                Cookies.set(
                                                    `refreshToken-${address}`,
                                                    res.data.authenticate.refreshToken,
                                                    COOKIE_CONFIG
                                                )
                                            })
                                        })
                                    })
                                }}>
                                <Image src="https://lenster.xyz/lens.png" 
                                    alt="lens"
                                    className='mr-3 w-4 h-4'
                                width={15} height={15} /> <div className="ml-1">Login</div>
                            </button>
                        }
                    </div>
                    }
            </div>
        : <div>
            {
                chain?.name !== "Polygon" ?
                    <Connect />
                    : <div className='flex group cursor-pointer'>
                        {
                            profiles[0]?.picture == undefined ?
                                <UserCircle size={35} className='ml-2' /> :
                                <Image src={
                                    profiles[0]?.picture?.__typename == "MediaSet" ? profiles[0]?.picture?.original?.url : "/lensdrop.png"
                                }
                                    alt="profile"
                                    width={30} height={30}
                                    className="rounded-full"
                                />
                        }
                        <ul className="invisible group-hover:visible absolute rounded-xl bg-gray-50 border-black mt-8 p-1 grid grid-cols-1 divide-y divide-white">
                            <li className='p-3'>
                                Connected as <p className="text-blue-400">@{profiles[0]?.handle}</p>
                            </li>
                            <li className='p-3 flex'>
                                <Dashboard size={20} className='mr-2' />
                                <Link href="/dashboard">
                                    Dashboard
                                </Link>
                            </li>
                            <li className='p-2'>
                                <Connect />
                            </li>
                        </ul>
                    </div>
            }
        </div>
        }
    </>
   )
}

export default Profile