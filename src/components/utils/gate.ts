import apolloClient from 'src/apollo'
import { WHO_COLLECTED } from 'src/graphql/Queries/Publications';
import { DocumentNode } from 'graphql';
import { IS_FOLLOWING } from '@graphql/Queries/Follow'
import { GET_DEFAULT_PROFILE } from '@graphql/Queries/Profile'

type Variables = {
    [key: string]: string | {
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
    let offset = `{\"offset\":0}`
    let collected = false
    while (offset != null) {
        let collects = await whoCollected(publicationId, "50", offset)
        console.log(collects)
        collects?.items?.forEach((item: any) => {
            if (item?.address === address) {
                collected = true
                return
            }
        })
        if (collected) {
            break
        }
        offset = collects?.pageInfo?.next
    }

    return collected
}

export const isFollowing = async (address: string, who: string) => {
    const profile = await queryFunction(GET_DEFAULT_PROFILE, { request: { ethereumAddress: address} })
    const profileId = profile?.data?.defaultProfile?.id
    const { data } = await queryFunction(IS_FOLLOWING, {
        profileId: profileId,
        who: who,
    })
    return data.profile.isFollowing
}

export const isFollowedByMe = async (userAddress: string, me: string) => {
    const user = await queryFunction(GET_DEFAULT_PROFILE, { request: { ethereumAddress: userAddress} })
    const { data } = await queryFunction(IS_FOLLOWING, {
        profileId: me,
        who: user?.data?.defaultProfile?.id,
    })
    return data.profile.isFollowing
}