import apolloClient from 'src/apollo'
import { WHO_COLLECTED, GET_COMMENTS, GET_PUBLICATION, GET_LIKES } from 'src/graphql/Queries/Publications';
import { GET_PROFILES, GET_PROFILE } from 'src/graphql/Queries/Profile';
import { GET_FOLLOWERS } from '@graphql/Queries/Follow';
import { Filter } from './AppContext'
import { DocumentNode } from 'graphql';
import { Follower } from '@generated/types'

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

export const Filterer = async(filters: Filter[]): Promise<Array<string>> => {
    let addresses: Array<string> = [];

    const executeFilter = filters.map(async (filter) => {
        let query: DocumentNode
        let variables: Variables = {}

        let cursor = "{\"offset\":0}"

        if (filter.reaction === 'Collect') {
            query = WHO_COLLECTED
            variables = {
                request: {
                    publicationId: filter.publicationId!,
                    cursor: cursor,
                    limit: '50',
                }
            }
        } else if (filter.reaction === 'Mirror') {
            query = GET_PROFILES
            variables = {
                request: {
                    whoMirroredPublicationId: filter.publicationId!,
                    cursor: cursor,
                    limit: '50'
                }
            }
        } else if (filter.reaction === 'Comment') {
            query = GET_COMMENTS
            variables = {
                request: {
                    commentsOf: filter.publicationId!,
                    cursor: cursor,
                    limit: '50',
                },
                reactionRequest: null!
            }
        } else if (filter.reaction === 'Follow') {
            query = GET_PROFILE
            variables = {
                request: {
                    handle: filter.handle!
                }
            }
        } else if (filter.reaction === 'Like') {
            query = GET_LIKES
            variables = {
                request: {
                    publicationId: filter.publicationId!,
                    cursor: cursor,
                    limit: '50',
                }
            }
        } else {
            query = GET_PUBLICATION
            variables = {
                request: {
                    publicationId: filter.publicationId!,
                    cursor: cursor,
                    limit: '50',
                },
                reactionRequest: {
                    reaction: 'UPVOTE'
                }
            }
        }

        if (filter.reaction !== "") {
            let allAddresses: any
            
            if (filter.reaction === 'Collect') {
                const totalCount = (await queryFunction(query, variables))?.data?.whoCollectedPublication?.pageInfo?.totalCount
                let count: number

                if (filter.limit) {
                    count = filter.limit
                    cursor = "{\"offset\":" + (totalCount - count) + "}"
                    variables.request.cursor = cursor
                } else {
                    count = 0
                }

                let _addresses: Array<any> = []

                while (count < totalCount) {
                    const response = await queryFunction(query, variables)
                    _addresses = _addresses.concat(response?.data?.whoCollectedPublication?.items)
                    if ((totalCount - count) > 50) {
                        count += 50
                    } else {
                        count = totalCount
                    }
                    cursor = "{\"offset\":" + count + "}"
                    variables.request.cursor = cursor
                }  

                if (filter.limit && (_addresses.length > filter?.limit)) {
                    _addresses = _addresses.slice(-filter.limit)
                }

                allAddresses = _addresses
            } else if (filter.reaction === 'Mirror') {
                const totalCount = (await queryFunction(query, variables))?.data?.profiles?.pageInfo?.totalCount
                let count: number

                if (filter.limit) {
                    count = filter.limit
                    cursor = "{\"offset\":" + (totalCount - count) + "}"
                    variables.request.cursor = cursor
                } else {
                    count = 0
                }

                let _addresses: Array<any> = []

                while (count < totalCount) {
                    const response = await queryFunction(query, variables)
                    _addresses = _addresses.concat(response?.data?.profiles?.items)
                    if ((totalCount - count) > 50) {
                        count += 50
                    } else {
                        count = totalCount
                    }
                    cursor = "{\"offset\":" + count + "}"
                    variables.request.cursor = cursor
                }  
                
                if (filter.limit && (_addresses.length > filter?.limit)) {
                    _addresses = _addresses.slice(-filter.limit)
                }

                allAddresses = _addresses
            } else if (filter.reaction === 'Comment') {
                const totalCount = (await queryFunction(query, variables))?.data?.publications?.pageInfo?.totalCount
                let count: number

                if (filter.limit) {
                    count = filter.limit
                    cursor = "{\"offset\":" + (totalCount - count) + "}"
                    variables.request.cursor = cursor
                } else {
                    count = 0
                }

                let _addresses: Array<any> = []

                while (count < totalCount) {
                    const response = await queryFunction(query, variables)
                    _addresses = _addresses.concat(response?.data?.publications?.items)
                    if ((totalCount - count) > 50) {
                        count += 50
                    } else {
                        count = totalCount
                    }
                    cursor = "{\"offset\":" + count + "}"
                    variables.request.cursor = cursor
                }  
                
                if (filter.limit && (_addresses.length > filter?.limit)) {
                    _addresses = _addresses.slice(-filter.limit)
                }

                allAddresses = _addresses
            } else if (filter.reaction === 'Follow') {
                const response = await queryFunction(query, variables)
                const profileId = response?.data?.profile?.id
                const totalFollowers = response?.data?.profile?.stats?.totalFollowers
                let count = 0
                let _addresses: Array<any> = []

                query = GET_FOLLOWERS
                variables = {
                    request: {
                        profileId: profileId!,
                        cursor: cursor,
                    }
                }

                while (count < totalFollowers) {
                    const response = await queryFunction(query, variables)
                    const follow = response?.data?.followers?.items
                    _addresses = _addresses.concat(follow)
                    count += 25
                    cursor = "{\"offset\":" + count + "}"
                    variables.request.cursor = cursor
                }

                allAddresses = _addresses
            } else if (filter.reaction === 'Like') {
                const totalCount = (await queryFunction(query, variables))?.data?.whoReactedPublication?.pageInfo?.totalCount
                let count: number

                if (filter.limit) {
                    count = filter.limit
                    cursor = "{\"offset\":" + (totalCount - count) + "}"
                    variables.request.cursor = cursor
                } else {
                    count = 0
                }
                let _addresses: Array<any> = []

                while (count < totalCount) {
                    const response = await queryFunction(query, variables)
                    _addresses = _addresses.concat(response?.data?.whoReactedPublication?.items)
                    if ((totalCount - count) > 50) {
                        count += 50
                    } else {
                        count = totalCount
                    }
                    cursor = "{\"offset\":" + count + "}"
                    variables.request.cursor = cursor
                }

                if (filter.limit && (_addresses.length > filter?.limit)) {
                    _addresses = _addresses.slice(-filter.limit)
                }

                allAddresses = _addresses
            }

            let preliminaryAddresses: Array<string> = []

            allAddresses?.map((item: any) => {
                if (filter.reaction === 'Collect') {
                    const address = item?.address
                    preliminaryAddresses?.push(address)
                } else if (filter.reaction === 'Mirror') {
                    const address: string = item?.ownedBy; 
                    preliminaryAddresses?.push(address);
                } else if (filter.reaction === 'Comment') {
                    const address: string = item?.profile?.ownedBy; 
                    preliminaryAddresses?.push(address);
                } else if (filter.reaction === 'Follow') {
                    const address: string = item?.wallet?.address;
                    preliminaryAddresses?.push(address);
                    addresses?.push(address);
                } else if (filter.reaction === 'Like') {
                    const address: string = item?.profile?.ownedBy;
                    preliminaryAddresses?.push(address);
                    addresses?.push(address);
                }
            }); 
            addresses = preliminaryAddresses
        }

        return addresses
    })

    const arrays = await Promise.all(executeFilter);
    let qualifiedAddresses: Array<string> = []
    for (let i = 0; i < arrays.length; i++) {
        if (qualifiedAddresses.length === 0) {
            qualifiedAddresses = arrays[i]
        } else {
            if (filters[i-1].joinType === 'AND' || !filters[i-1].joinType) {
                qualifiedAddresses = qualifiedAddresses.filter((address) => arrays[i].includes(address))
            } else {
                qualifiedAddresses = qualifiedAddresses.concat(arrays[i])
            }
        }
    }

    // Convert array into set of addresses to remove duplicates
    const set = new Set(qualifiedAddresses);

    return Array.from(set)
}

