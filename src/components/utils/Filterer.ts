import apolloClient from 'src/apollo'
import { WHO_COLLECTED } from 'src/graphql/Queries/Publications';
import { GET_PROFILES } from 'src/graphql/Queries/Profile';
import { Filter } from './AppContext'
import { DocumentNode } from 'graphql';

export const Filterer = async(filters: Filter[]): Promise<Array<string>> => {
    let addresses: Array<string> = [];

    const executeFilter = filters.map(async (filter) => {
        let query: DocumentNode
        let request: {
            [key: string]: string
        } = {}

        if (filter.reaction === 'Collect') {
            query = WHO_COLLECTED
            request = {
                publicationId: filter.publicationId
            }
        } else if (filter.reaction === 'Mirror') {
            query = GET_PROFILES
            request = {
                whoMirroredPublicationId: filter.publicationId
            }
        } else {
            query = GET_PROFILES
            request = {
                whoPublishedPublicationId: filter.publicationId
            }
        }

        if (filter.reaction !== "") {
            await apolloClient.query({
                query: query,
                variables: {
                    request: request
                },
                fetchPolicy: 'no-cache',
            })
            .then((result) => {
                let allAddresses: any
                
                if (filter.reaction === 'Collect') {
                    allAddresses = result?.data?.whoCollectedPublication?.items       
                } else if (filter.reaction === 'Mirror') {
                    allAddresses = result?.data?.profiles?.items
                }
                
                allAddresses?.map((item: any) => {
                    if (filter.reaction === 'Collect') {
                        const address = item?.address
                        addresses?.push(address)
                    } else if (filter.reaction === 'Mirror') {
                        const address: string = item?.ownedBy; 
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

