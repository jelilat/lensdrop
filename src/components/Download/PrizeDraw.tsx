import { useEffect, useState } from 'react'
import { Draw } from '@components/utils/draw'
import { Profile } from '@generated/types'
import { useAppContext } from '@components/utils/AppContext'
import { Filterer } from '@components/utils/Filterer'
import Link from 'next/link'
import Post from '@components/Post'

interface DrawProps {
    addresses: string[]
    type: 'Onchain' | 'Offchain'
    sharePost: Boolean
}

const PrizeDraw = ({...props}: DrawProps) => {
    const { filters, setRecipients } = useAppContext()
    const [winner, setWinner] = useState<Profile[]>()
    const [numberOfWinners, setNumberOfWinners] = useState<number>(0)
    const [showPrizeDraw, setShowPrizeDraw] = useState<boolean>(false)
    const [data, setData] = useState<string[]>([])
    const [error, setErrorMessage] = useState<string>("")
    const [disableButton, setDisableButton] = useState<boolean>(false)

    const addressFilterer = async () => {
        if (filters[0].reaction !== "") {
            const filteredAddresses = await Filterer(filters);
            if (filteredAddresses.length > 0) {
                const addresses = filteredAddresses?.filter(address => {
                    return props.addresses.includes(address)
                }); 
                setData(addresses)
            }
        } else {
            setData(props.addresses)
        }
    }

    const createDraw = async (type: string) => {
        await addressFilterer()
        const winner = await Draw(props.addresses, numberOfWinners)
        setWinner(winner!)

        if (type === "Onchain") {
            var winners: string[] = []
            winner!.map((win) => {
                winners.push(win?.ownedBy)
            })
            setRecipients(winners)
        }
        if (!winner) {
            setErrorMessage("No winner!")
        }
    }

    const getWinnersHandles = () => {
        const handles = winner?.map((win) => {
            return "@" + win?.handle
        })
        return handles!.join(", ")
    }

    useEffect(() => {
        if (winner) {
            setDisableButton(false)
        }
    }, [winner])

    return(
        <>
            <div>
                <button className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
                        onClick={async () => {
                            setShowPrizeDraw(true)
                            // if (winner) {
                            //     window.location.reload()
                            // }
                        }}
                        disabled={disableButton}
                    >
                    Create Prize Draw
                </button>
                    {showPrizeDraw && <div>
                        {!winner && <div>
                                <label>Number of winners</label><br />
                                <div className="flex">
                                    <input type="number" min="1" max={props.addresses.length} onChange={(e)=> {
                                        setNumberOfWinners(parseInt(e.target.value))
                                    }}
                                        className="w-1/2 my-2 p-2 border-2 border-b-black-500 px-2 rounded-lg" />
                                    <button onClick={async () => {
                                        setDisableButton(true)
                                                await createDraw(props.type)
                                            }}
                                            disabled={disableButton}
                                        className="w-1/2 h-12 px-6 my-2 ml-5 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800">
                                        Draw
                                    </button>
                                </div>
                            </div>}
                        <div>
                            {
                                (!winner && disableButton) && 
                                    <div className="my-3">
                                        Drawing winners. Please wait...
                                    </div>
                            }
                            {
                                winner && props?.type === "Offchain" ? <div className="my-3">
                                    The Winner(s) 
                                    {
                                        winner.map((w, i) => {
                                            return (
                                                <div key={i} className="my-3">
                                                    <span 
                                                        className="font-bold underline underline-offset-2">
                                                    <Link href={`https://lenster.xyz/u/${w?.handle}`}>{w?.handle}</Link></span> - owned by <span className="font-bold underline underline-offset-2">
                                                        <Link href={`https://polygonscan.com/address/${w?.ownedBy}`}>{w?.ownedBy}</Link></span>
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        props.sharePost && <div className="my-5">
                                            <Post
                                                variant="secondary"
                                                content={`I just created a prize draw with lensdrop.xyz. Here are the winners of the prize draw: ${getWinnersHandles()}`}
                                             />
                                        </div>
                                    }
                                </div>
                                : <div>{error}</div>
                            }
                        </div>
                    </div>
                    }
            </div>
            {
                !filters && <div className="justify-center">
                    Add filter to publication to create prize draw
                </div>
            }
        </>
    )
}

export default PrizeDraw;