import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from "next/router";
import { Modal } from '@components/UI/Modal';
import Connect from './Connect'
import { useAccount, useDisconnect } from 'wagmi'

const Header = () => {
    const { data: account } = useAccount()
    const [connected, setConnected] = useState<boolean>()
    const [connectModal, setConnectModal] = useState<boolean>(false)

    useEffect(() => {
        if (window.localStorage.getItem('wagmi.connected') === 'true') {
            setConnected(true);
        }
    }, [])

    return (
        <>
            <div className="flex text-sm p-3 border-b-2 border-b-black-500 sticky top-0">
                <div className="w-2/5 float-right p-2 font-semibold">
                    Lensdrop
                </div>
                <div className="w-2/5 flex content-center">
                    <div className={`mx-1 p-2 ${useRouter().pathname === "/" ?
                            "bg-gray-200 rounded-lg" : null}`}>
                        <Link className=""
                            href="/" >
                            Home
                        </Link>
                    </div>
                    <div className={`mx-1 p-2 ${useRouter().pathname === "/followers" ?
                            "bg-gray-200 rounded-lg" : null}`}>
                        <Link className=""
                            href="/followers" >
                            Followers
                        </Link>
                    </div>
                    <div className={`mx-1 p-2 ${useRouter().pathname === "/following" ?
                            "bg-gray-200 rounded-lg" : null}`}>
                        <Link className=""
                            href="/following" >
                            Following
                        </Link>
                    </div>
                </div>
                <div className="w-1/5">
                    <button className="rounded-lg bg-black text-white p-2"
                        onClick={() => {
                            setConnectModal(true)
                        }}
                        data-bs-toggle="modal">
                        {!connected ? 
                            "Connect wallet"
                            : (account?.address)?.slice(0, 6) + "..." + (account?.address)?.slice(-4)
                            }
                        <Modal
                            title="Connect Wallet"
                            show={connectModal}
                            onClose={()=>{
                                setConnectModal(false)
                            }}>
                                <Connect />
                            </Modal>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Header