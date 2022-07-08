import apolloClient from 'src/apollo'
import { WHO_COLLECTED } from 'src/graphql/Queries/Publications';
import { Filter } from './AppContext'

export const Filterer = (filters: Filter[]): string[] => {
    let addresses: Set<string> = new Set()

    filters.map((filter) => {
        apolloClient.query({
            query: WHO_COLLECTED,
            variables: {
                request: {
                    publicationId: filter.publicationId
                }
            },
            fetchPolicy: 'no-cache',
        })
        .then((result) => {
            console.log(result?.data?.whoCollectedPublication?.items)
            const allAddresses = result?.data?.whoCollectedPublication?.items
            allAddresses.map((item: any) => {
                addresses.add(item?.address)
            })
        })
    })

    return addresses as unknown as string[]
}