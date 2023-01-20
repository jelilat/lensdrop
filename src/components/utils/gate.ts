import apolloClient from 'src/apollo'
import { WHO_COLLECTED } from 'src/graphql/Queries/Publications';
import { DocumentNode } from 'graphql';

type Variables = {
    [key: string]: {
        [key: string]: string | null,
    },
}

const queryFunction = async (query: DocumentNode, variables: Variables) => {
    return await apolloClient.query({
        query: query,
        variables: variables,
        fetchPolicy: 'no-cache',
    })
}

const whoCollected = async (publicationId: string, limit: string, cursor: string) => {
    const { data } = await queryFunction(WHO_COLLECTED, { request: { publicationId, limit, cursor } })
    return data.whoCollectedPublication
}

export const collectedPost = async (publicationId: string, address: string): Promise<boolean> => {
    let next = 0
    while (next) {
        let collects = await whoCollected(publicationId, "50", `{\"offset\":${next}}`)
        collects?.items?.forEach((item: any) => {
            if (item?.address === address) {
                return true
            }
        })
        next = collects?.pageInfo?.next
    }

    return false
}