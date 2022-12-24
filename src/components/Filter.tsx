import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_PUBLICATION, GET_PUBLICATIONS } from '@graphql/Queries/Publications'
import { GET_PROFILE } from '@graphql/Queries/Profile'
import { Post, Profile, PublicationStats } from '@generated/types'
import { useAppContext, Reaction, JoinType } from '@components/utils/AppContext'
import { MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { EyeIcon } from '@heroicons/react/outline'
import Image from 'next/image'
import apolloClient from 'src/apollo'


const Filter = () => {
    const { profiles, filters, address, setFilters } = useAppContext();
    const [publications, setPublications] = useState<Post[]>([])
    const [error, isError] = useState<Array<boolean>>([])
    const [showModal, setShowModal] = useState<Array<boolean>>([])
    const [maxRecipients, setMaxRecipients] = useState<Array<number>>([0])
    const [eligible, setEligible] = useState<Array<string>>(['All'])

    useQuery(GET_PUBLICATIONS, {
        variables: {
            request: {
                profileId: profiles[0]?.id,
                publicationTypes: ["POST"]
            }
        },
        onCompleted(data) {
            setPublications(data?.publications?.items);
        }
    })
    
    useEffect(() => {
        setFilters([{
            reaction: "",
            publicationId: "",
            publication: undefined
        }])
    }, [])

    const getPublication = async (publicationId: string, index: number): Promise<Post> => {
        let publication: Post
         await apolloClient.query({
            query: GET_PUBLICATION,
            variables: {
                request: {
                    publicationId: publicationId
                }
            },
        })
        .then(response => {
            publication = response?.data?.publication
            let newError = error
            newError[index] = false
            isError(newError)
        })
        .catch(err => {
            let newError = error
            newError[index] = true
            isError(newError)
        })

        return publication!;
    }

    const getProfile = async (handle: string, index: number): Promise<Profile> => {
        let profile: Profile
        await apolloClient.query({
            query: GET_PROFILE,
            variables: {
                request: {
                    handle: handle
                }
            },
        })
        .then(response => {
            profile = response?.data?.profile
            let newError = error
            newError[index] = false
            isError(newError)
        })
        .catch(err => {
            let newError = error
            newError[index] = true
            isError(newError)
        })

        return profile!;
    }

    const getMaxRecipients = (stats: PublicationStats, reaction: Reaction): number => {
        switch(reaction) {
            case "Comment":
                return stats?.totalAmountOfComments
            case "Mirror":
                return stats?.totalAmountOfMirrors
            case "Collect":
                return stats?.totalAmountOfCollects
            default:
                return 0
        }
    }

    return (
        <>
            <div className="">
                <div className="font-semibold my-1">
                    Filter by those who
                </div>
                {publications &&
                    filters.map((filter, index) => {
                        return(
                            <div key={index}>
                                <div
                                    className="flex my-2">
                                    <select 
                                        onChange={(e) => {
                                            const newFilters = [...filters];
                                            const tempFilter = {...newFilters[index]};
                                            let v = e.target.value as unknown as Reaction;
                                            tempFilter.reaction = v;
                                            newFilters[index] = tempFilter;
                                            setFilters(newFilters);

                                            if (filter.publication) {
                                                let newMaxRecipients = maxRecipients
                                                newMaxRecipients[index] = getMaxRecipients(filter.publication?.stats!, v)
                                                setMaxRecipients(newMaxRecipients)
                                            }
                                        }}
                                        value={filter.reaction}
                                        className="my-1 p-2 border-2 border-b-black-500 rounded-lg sm:p-1 sm:w-14">
                                        <option value=""></option>
                                        <option value="Collect">Collected</option>
                                        <option value="Comment">Commented</option>
                                        <option value="Like">Like</option>
                                        <option value="Mirror">Mirrored</option>
                                        <option value="Follow">Follow</option>
                                    </select> 
                                    <div className="m-1 p-2 sm:px-1 rounded-lg">{
                                        filter.reaction === "Follow" ? "the handle" : "the post"
                                    }</div>
                                    {filter.reaction === "Follow" ?
                                        <div>
                                            <input onChange={async(e) => {
                                                await getProfile(e.target.value, index)
                                                let newFilters = [...filters];
                                                let tempFilter = {...newFilters[index]};
                                                tempFilter.handle = e.target.value;
                                                newFilters[index] = tempFilter;
                                                setFilters(newFilters);

                                                let newMaxRecipients = maxRecipients
                                                newMaxRecipients[index] = 0
                                                setMaxRecipients(newMaxRecipients)
                                            }}
                                                type="text"
                                                placeholder="lensdropxyz.lens"
                                                className={`m-1 p-2 border-2 border-b-black-500 sm:px-1 sm:w-20 rounded-lg ${error[index] && "border-red-500"}`} />
                                        </div> :
                                        <div>
                                            <input onChange={async (e) => {
                                                let newFilters = [...filters];
                                                let tempFilter = {...newFilters[index]};
                                                tempFilter.publicationId = e.target.value;
                                                const pub = await getPublication(e.target.value as string, index)
                                                tempFilter.publication = pub; 
                                                tempFilter.stats = pub?.stats;
                                                newFilters[index] = tempFilter;
                                                setFilters(newFilters);

                                                let newMaxRecipients = maxRecipients
                                                newMaxRecipients[index] = getMaxRecipients(pub?.stats!, filter.reaction!)
                                                setMaxRecipients(newMaxRecipients)
                                            }}
                                                type="text" 
                                                list="publications"
                                                placeholder="0x2cb8-0x0d"
                                                className={`m-1 p-2 border-2 border-b-black-500 sm:px-1 sm:w-20 rounded-lg ${error[index] && "border-red-500"}`} />
                                            <datalist id="publications">
                                                <select  onChange={async (e) => {
                                                    let newFilters = [...filters];
                                                    let tempFilter = {...newFilters[index]};
                                                    tempFilter.publicationId = e.target.value;
                                                    const pub = await getPublication(e.target.value as string, index)
                                                    tempFilter.publication = pub;
                                                    newFilters[index] = tempFilter;
                                                    setFilters(newFilters);
                                                }}
                                                    value={filter.publicationId}
                                                    className={`m-1 p-2 border-2 border-b-black-500 sm:px-1 sm:w-20 rounded-lg`}>
                                                        <option value=""></option>
                                                        {address &&
                                                            publications?.map((publication, index) => {
                                                                return (
                                                                    <option key={index} value={publication?.id}
                                                                        className="group flex">
                                                                        {publication?.id}
                                                                    </option>
                                                                )
                                                            })
                                                        }
                                                </select>
                                            </datalist>
                                        </div>
                                    }
                                    <select onChange={(e) => {
                                        const newFilters = [...filters];
                                        const tempFilter = {...newFilters[index]};
                                        tempFilter.joinType = e.target.value as unknown as JoinType;
                                        newFilters[index] = tempFilter;
                                        setFilters(newFilters);
                                    }}
                                        className="m-1 p-2 border-2 border-b-black-500 sm:px-1 sm:w-10 rounded-lg">
                                        <option value="AND">AND</option>
                                        <option value="OR">OR</option>
                                    </select>
                                    <button className="group flex sm:hidden">
                                        <div 
                                            className="flex my-1 p-2">
                                            <EyeIcon className="w-5 sm:hidden" />
                                        </div>
                                        <div className="invisible group-hover:visible inline-block absolute z-10 py-2 px-3 rounded-lg shadow-sm transition-opacity duration-300 max-w-lg text-white bg-black">  
                                            {filter?.publicationId !== "" ?
                                                <div>
                                                    <p className="py-1 my-1">{filter?.publication?.metadata?.content}</p>
                                                    {filter?.publication?.metadata?.media[0]?.original?.url && 
                                                        <Image src={
                                                            filter?.publication?.metadata?.media[0]?.original?.url
                                                        } alt="image" width={300} height={200} />
                                                    }
                                                    {/* <span 
                                                        id="lens-embed" data-post-id={filter?.publicationId} /><script src="https://embed.withlens.app/script.js" async />  */}
                                                </div>
                                            : <div className="rounded-lg">
                                                <span>Select a post to preview</span>
                                            </div>}
                                        </div>
                                    </button>
                                    {
                                        index == filters.length - 1 ?
                                        <button 
                                            disabled={filter.reaction == "" || (filter.reaction !== "Follow" && filter.publicationId == "") || (filter.reaction == "Follow" && filter.handle == "") || error[index]}
                                            onClick={() => {
                                                setFilters([...filters, {
                                                    reaction: "",
                                                    publicationId: "",
                                                    publication: undefined
                                                }])
                                            }}
                                            className="flex m-1 p-2 sm:px-1 rounded-lg border-2 border-b-black-500">
                                            <div className="sm:hidden">Add</div>
                                            <div>
                                                <PlusIcon className="w-6 h-5" />
                                            </div>
                                        </button>
                                        :         
                                        <button 
                                            onClick={() => {
                                                setFilters(current => 
                                                    current.filter((obj, ind) => {
                                                        return ind != index
                                                    }))
                                            }}
                                            className="flex m-1 sm:px-1 p-2 rounded-lg border-2 border-b-black-500">
                                            <div className="sm:hidden">Remove</div> 
                                            <div>
                                                <MinusIcon className="w-6 h-5" />
                                            </div>
                                        </button>
                                    } 
                                    {
                                        error[index] &&
                                        <div className="text-red-500 text-xs justift-self-center p-1">invalid input</div>
                                    }
                                </div>
                                <div>
                                    {
                                        ((filter.reaction !== "Follow" && filter.reaction !== "" && filter.publicationId !== "") && !error[index]) &&
                                        <div>
                                            <button onClick={() => {
                                                setShowModal(modal => {
                                                    const tempModal = {...modal}
                                                    tempModal[index] = true;
                                                    return tempModal;
                                                })
                                            }}
                                                className="text-xs text-blue-500">
                                               <div className="flex">
                                               Advanced Options <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mx-1">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                               </div>

                                                {
                                                    showModal[index] &&
                                                        <div className="my-3 block">
                                                            <div className="my-3 float-left">Select eligible recipients</div><br />
                                                            <div className="flex float-left">
                                                                <select onChange={(e) => {
                                                                    const totalPossible = getMaxRecipients(filter.publication?.stats!, filter.reaction)
                                                                    setFilters(current => {
                                                                        const newFilters = [...current]
                                                                        newFilters[index].limit = totalPossible
                                                                        return newFilters
                                                                    })
                                                                    setEligible(eligible => {
                                                                        const newEligible = [...eligible]
                                                                        newEligible[index] = e.target.value
                                                                        return newEligible
                                                                    })
                                                                }}
                                                                    defaultValue="All"
                                                                    className="my-1 p-2 border-2 border-b-black-500 rounded-lg sm:p-1 sm:w-14 mr-1"
                                                                >
                                                                    <option value="All">All</option>
                                                                    <option value="First">First</option>
                                                                </select>
                                                                {
                                                                    eligible[index] == "First" &&
                                                                    <input onChange={(e) => {
                                                                        const value = e.target.value
                                                                        setFilters(current => {
                                                                            const temp = [...current];
                                                                            const tempFilter = {...temp[index]};
                                                                            tempFilter.limit = parseInt(value);
                                                                            temp[index] = tempFilter;
                                                                            return temp;
                                                                        })
                                                                    }}
                                                                        defaultValue={maxRecipients[index]}
                                                                        placeholder={maxRecipients[index] ? maxRecipients[index].toString() : "0"}
                                                                        className="m-1 p-2 border-2 border-b-black-500 sm:px-1 sm:w-20 rounded-lg"
                                                                    />
                                                                }
                                                                <div className='px-1 my-3'>{filter.reaction}s</div>
                                                            </div>
                                                        </div>
                                                }
                                            </button>
                                            {
                                                showModal[index] &&
                                                    <div><button className="my-1 p-2 rounded-lg bg-blue-500 text-white w-12"
                                                    onClick={() => {
                                                        setShowModal(modal => {
                                                            const tempModal = {...modal}
                                                            tempModal[index] = false;
                                                            return tempModal;
                                                        })
                                                    }}
                                                >Done</button></div>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Filter