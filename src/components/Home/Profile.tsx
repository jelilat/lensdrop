import { useAccount, useSignTypedData, useSignMessage } from 'wagmi'
import Image from 'next/image'
import Cookies, { CookieAttributes } from 'js-cookie';
import { GET_CHALLENGE } from '@graphql/Queries/Authenticate';
import { useLazyQuery, useMutation } from '@apollo/client';
import { AUTHENTICATION } from '@graphql/Mutations/Authenticate';
import { Modal } from '@components/UI/Modal';
import { useState } from 'react';
import Connect from './Connect'
import { useAppContext } from '@components/utils/AppContext';

const Profile = () => {
    const { address, isConnected } = useAccount()
    const { profiles } = useAppContext();

    const { signMessageAsync } = useSignMessage();
    const COOKIE_CONFIG: CookieAttributes = {
        sameSite: 'None',
        secure: true,
        expires: 60
      }
    const accessToken = Cookies.get('accessToken')

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
                                                    'accessToken',
                                                    res.data.authenticate.accessToken,
                                                    COOKIE_CONFIG
                                                )
                                                Cookies.set(
                                                    'refreshToken',
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
        : <div className='flex group cursor-pointer'>
            <Image src={profiles[0]?.picture?.original?.url}
                alt="profile"
                width={35} height={30}
                className="rounded-full"
            />
            <ul className="invisible group-hover:visible absolute rounded-xl boreder-2 bg-gray-50 border-black mt-8 p-1">
                <li className='p-2'>
                    Connected as <span className="text-blue-400">@{profiles[0]?.handle}</span>
                </li>
                <li className='m-2'>
                    <Connect />
                </li>
            </ul>
        </div>
        }
    </>
   )
}

export default Profile