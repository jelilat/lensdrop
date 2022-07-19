import apolloClient from 'src/apollo'
import { WHO_COLLECTED, GET_COMMENTS } from 'src/graphql/Queries/Publications';
import { GET_PROFILES } from 'src/graphql/Queries/Profile';
import { Filter } from './AppContext'
import { DocumentNode } from 'graphql';

export const Filterer = async(filters: Filter[]): Promise<Array<string>> => {
    let addresses: Array<string> = [];

    const executeFilter = filters.map(async (filter) => {
        let query: DocumentNode
        let variables: {
            [key: string]: {
                [key: string]: string | null,
            },
        } = {}

        if (filter.reaction === 'Collect') {
            query = WHO_COLLECTED
            variables = {
                request: {
                    publicationId: filter.publicationId
                }
            }
        } else if (filter.reaction === 'Mirror') {
            query = GET_PROFILES
            variables = {
                request: {
                    whoMirroredPublicationId: filter.publicationId
                }
            }
        } else if (filter.reaction === 'Comment') {
            query = GET_COMMENTS
            variables = {
                request: {
                    commentsOf: filter.publicationId
                },
                reactionRequest: null!
            }
        } else {
            query = GET_PROFILES
            variables = {
                request: {
                    whoPublishedPublicationId: filter.publicationId
                }
            }
        }

        if (filter.reaction !== "") {
            await apolloClient.query({
                query: query,
                variables: variables,
                fetchPolicy: 'no-cache',
            })
            .then((result) => {console.log(result)
                let allAddresses: any
                
                if (filter.reaction === 'Collect') {
                    allAddresses = result?.data?.whoCollectedPublication?.items       
                } else if (filter.reaction === 'Mirror') {
                    allAddresses = result?.data?.profiles?.items
                } else if (filter.reaction === 'Comment') {
                    allAddresses = result?.data?.publications?.items
                }
                
                allAddresses?.map((item: any) => {
                    if (filter.reaction === 'Collect') {
                        const address = item?.address
                        addresses?.push(address)
                    } else if (filter.reaction === 'Mirror') {
                        const address: string = item?.ownedBy; 
                        addresses?.push(address); 
                    } else if (filter.reaction === 'Comment') {
                        const address: string = item?.profile?.ownedBy; 
                        addresses?.push(address); 
                    }
                }); 
            })
        }
        return addresses
    })

    const arrays = await Promise.all(executeFilter)
    const sets = new Set(arrays.flat())
        
    return Array.from(sets)   
}

