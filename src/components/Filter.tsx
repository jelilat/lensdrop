import { useState, useEffect } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { GET_PUBLICATION, GET_PUBLICATIONS } from '@graphql/Queries/Publications'
import { Post } from '@generated/types'
import { useAppContext } from '@components/utils/AppContext'
import { MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { EyeIcon } from '@heroicons/react/outline'
import Image from 'next/image'
import apolloClient from 'src/apollo'

const Filter = () => {
    const { profiles, filters, address, setFilters } = useAppContext();
    const [publications, setPublications] = useState<Post[]>([])

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

    const getPublication =  async (publicationId: string) => {
        let publication
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
        })

        return publication;
    }
    
    return (
        <>
            <div className="sm:hidden">
                <div className="font-semibold my-1">
                    Filter by those who
                </div>
                {publications &&
                    filters.map((filter, index) => {
                        return(
                            <div key={index}
                                className="flex my-2">
                                <select 
                                    onChange={(e) => {
                                        const newFilters = [...filters];
                                        const tempFilter = {...newFilters[index]};
                                        let v = e.target.value as unknown as "Comment" | "Mirror" | "Collect" | "Like" | "";
                                        tempFilter.reaction = v;
                                        newFilters[index] = tempFilter;
                                        setFilters(newFilters);
                                    }}
                                    value={filter.reaction}
                                    className="my-1 p-2 border-2 border-b-black-500 px-2 rounded-lg">
                                    <option value=""></option>
                                    <option value="Collect">Collected</option>
                                    <option value="Comment">Commented</option>
                                    {/* <option value="Like">Like</option> */}
                                    <option value="Mirror">Mirrored</option>
                                </select> 
                                <div className="m-1 p-2 px-2 rounded-lg">the post</div>
                                <div>
                                    <input onChange={async (e) => {
                                        let newFilters = [...filters];
                                        let tempFilter = {...newFilters[index]};
                                        tempFilter.publicationId = e.target.value;
                                        const pub = await getPublication(e.target.value as string)
                                        tempFilter.publication = pub; 
                                        newFilters[index] = tempFilter;
                                        setFilters(newFilters);
                                    }}
                                        type="text" 
                                        list="publications"
                                        placeholder="0x2cb8-0x0d"
                                        className="m-1 p-2 border-2 border-b-black-500 px-2 rounded-lg" />
                                    <datalist id="publications">
                                        <select  onChange={async  (e) => {
                                            let newFilters = [...filters];
                                            let tempFilter = {...newFilters[index]};
                                            tempFilter.publicationId = e.target.value;
                                            const pub = await getPublication(e.target.value as string)
                                            tempFilter.publication = pub;
                                            newFilters[index] = tempFilter;
                                            setFilters(newFilters);
                                        }}
                                            value={filter.publicationId}
                                            className="m-1 p-2 border-2 border-b-black-500 px-2 rounded-lg">
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
                                <button className="group flex">
                                    <div 
                                        className="flex my-1 p-2">
                                        <EyeIcon className="w-5" />
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
                                        {/* <div className="flex">
                                            <div className="px-1">
                                            {
                                                filter?.publication?.profile?.picture?.original?.url ? <Image src={filter?.publication?.profile?.picture?.original?.url} alt="profile-picture" width={35} height={35}
                                                    className="rounded-full" />
                                                    : <div className="rounded-full bg-gray-200 h-6 w-6"></div>
                                                    }
                                            </div>  
                                            <div>
                                                <p className="top-0">{filter?.publication?.profile?.name}</p>
                                                <p className="text-xs">@{filter?.publication?.profile?.handle}</p>
                                            </div>
                                        </div> */}
                                        
                                    </div>
                                </button>
                                {
                                    index == filters.length - 1 ?
                                    <button 
                                        disabled={filter.reaction == "" || filter.publicationId == ""}
                                        onClick={() => {
                                            setFilters([...filters, {
                                                reaction: "",
                                                publicationId: "",
                                                publication: undefined
                                            }])
                                        }}
                                        className="flex m-1 p-2 rounded-lg border-2 border-b-black-500">
                                        Add
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
                                        className="flex m-1 p-2 rounded-lg border-2 border-b-black-500">
                                        Remove 
                                        <div>
                                            <MinusIcon className="w-6 h-5" />
                                        </div>
                                    </button>
                                } 
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Filter