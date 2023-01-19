import { useLazyQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import { EXPLORE_PUBLICATIONS } from '@graphql/Queries/Publications'
import { Publication } from '@generated/types'
import Script from 'next/script'

const Listings = () => {
    const [publications, setPublications] = useState<Array<Publication>>([])
    const [pageInfo, setPageInfo] = useState({next: "{\"offset\":0}", prev: "{\"offset\":0}"})
    
    const [getPublications] = useLazyQuery(EXPLORE_PUBLICATIONS, {
        variables: {
            request: {
                sortCriteria: "LATEST",
                publicationTypes: ["POST"],
                sources: ["lensdrop"],
                cursor: pageInfo.next
            }
        },
        onCompleted(data) {
            var explorePublications = data?.explorePublications
            setPageInfo(explorePublications?.pageInfo)
            setPublications(publications => [...publications, ...explorePublications?.items])
        }
    })

    useEffect(() => {
        getPublications()
    }, [getPublications])

    return (
        <>
            <div className="text-center">No available listings at the moment</div>
            {/* <div>
                <textarea
                    className="w-full m-" />
            </div>
            {
                publications?.map((publication: Publication) => {
                    return (
                        <div key={publication?.id}>
                            <span id="lens-embed" data-post-id={publication?.id} /><Script src="https://embed.withlens.app/script.js" />
                        </div>
                    )
                })
            }
            <span id="lens-embed" data-post-id="0xf5-0x17" /><Script src="https://embed.withlens.app/script.js" /> */}
        </>
    )
}

export default Listings