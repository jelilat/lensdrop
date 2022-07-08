import { useState, useEffect } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { GET_PUBLICATION, GET_PUBLICATIONS } from '@graphql/Queries/Publications'
import { Post } from '@generated/types'
import { useAppContext } from '@components/utils/AppContext'
import { MinusIcon, PlusIcon } from '@heroicons/react/solid'

const Filter = () => {
    const { profiles, filters, setFilters } = useAppContext();
    const [publications, setPublications] = useState<Post[]>([])

    useQuery(GET_PUBLICATIONS, {
        variables: {
            request: {
                profileId: profiles[0]?.id,
                publicationTypes: ["POST"]
            }
        },
        fetchPolicy: 'no-cache',
        onCompleted(data) {console.log(data)
            setPublications(data?.publications?.items);
        }
    })
    
    useEffect(() => {
        setFilters([{
            reaction: "",
            publicationId: ""
        }])
    }, [])
    
    return (
        <>
        <div className="font-semibold my-1">
            Filter by those who
        </div>
        {
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
                            {/* <option value="Comment">Comment</option>
                            <option value="Like">Like</option>
                            <option value="Mirror">Mirror</option> */}
                        </select> 
                        <div className="m-1 p-2 px-2 rounded-lg">the post</div>
                        <select 
                            onChange={(e) => {
                                const newFilters = [...filters];
                                const tempFilter = {...newFilters[index]};
                                tempFilter.publicationId = e.target.value;
                                newFilters[index] = tempFilter;
                                setFilters(newFilters);
                            }}
                            value={filter.publicationId}
                            className="m-1 p-2 border-2 border-b-black-500 px-2 rounded-lg">
                                <option value=""></option>
                            {
                                publications?.map((publication, index) => {
                                    return (
                                        <option key={index} value={publication?.id}>
                                            {publication?.id}
                                        </option>
                                    )
                                })
                            }
                        </select>
                        {
                            index == filters.length - 1 ?
                            <button 
                                disabled={filter.reaction == "" || filter.publicationId == ""}
                                onClick={() => {
                                    setFilters([...filters, {
                                        reaction: "",
                                        publicationId: ""
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
        </>
    )
}

export default Filter