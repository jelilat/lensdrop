import { useState, useEffect } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { GET_PUBLICATION, GET_PUBLICATIONS } from '@graphql/Queries/Publications'
import { Publication } from '@generated/types'
import { useAppContext } from '@components/utils/AppContext'

const Filter = () => {
    const { profiles } = useAppContext();
    const [publications, setPublications] = useState<Publication[]>([])

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
    
    return (
        <>
        <div className="font-bold text-lg">
            Filter results by those who
        </div>
        <div className="flex my-2">
            <select className="my-1 p-2 border-2 border-b-black-500 px-2 rounded-lg">
                <option value="">Collect</option>
                <option value="">Comment</option>
                <option value="">Like</option>
                <option value="">Mirror</option>
            </select> 
            <div className="m-1 p-2 px-2 rounded-lg">the publication</div>
            <select className="my-1 p-2 border-2 border-b-black-500 px-2 rounded-lg">
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
        </div>
        <button className="mr-1 p-2 rounded-lg border-2 border-b-black-500">
            Add Filter
        </button>
        </>
    )
}

export default Filter