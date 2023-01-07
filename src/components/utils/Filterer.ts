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

export const Filterer = async(filters: Filter[], minimumFollowers: number): Promise<Array<string>> => {
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
                let totalCount = (await queryFunction(query, variables))?.data?.whoCollectedPublication?.pageInfo?.totalCount
                let count: number

                if (filter.limit) {
                    count = totalCount - filter.limit
                    cursor = "{\"offset\":" + count + "}"
                    variables.request.cursor = cursor
                } else {
                    count = 0
                }

                let limit = filter.limit ? filter.limit : totalCount

                let _addresses: Array<any> = []
                let balance = count

                while ((count < totalCount) && (_addresses.length < limit)) {
                    const response = await queryFunction(query, variables)
                    let items = response?.data?.whoCollectedPublication?.items
                    for (let i = 0; i < items.length; i++) {
                        let item = items[i]
                        if (item?.stats?.totalFollowers >= minimumFollowers) {
                            _addresses.push(item?.address)
                        }
                        if (_addresses.length >= limit) {
                            break
                        }
                    }
                    if ((totalCount - count) > 50) {
                        count += 50
                    } else {
                        count = totalCount
                    }
                    if ((filter.limit) && (count == totalCount) && (_addresses.length < filter.limit)) {
                        if (balance == 0) {
                            break
                        }
                        totalCount = totalCount - filter.limit
                        let remainder = limit - _addresses.length
                        count = totalCount - remainder
                        if (count < 0) {
                            count = 0
                        }
                        balance = count
                    }
                    cursor = "{\"offset\":" + count + "}"
                    variables.request.cursor = cursor
                }  

                if (filter.limit && (_addresses.length > filter?.limit)) {
                    _addresses = _addresses.slice(-filter.limit)
                }

                allAddresses = _addresses
            } else if (filter.reaction === 'Mirror') {
                let totalCount = (await queryFunction(query, variables))?.data?.profiles?.pageInfo?.totalCount
                let count: number

                if (filter.limit) {
                    count = totalCount - filter.limit
                    cursor = "{\"offset\":" + count + "}"
                    variables.request.cursor = cursor
                } else {
                    count = 0
                }

                let limit = filter.limit ? filter.limit : totalCount

                let _addresses: Array<any> = []
                let balance = count

                while ((count < totalCount) && (_addresses.length < limit)) {
                    const response = await queryFunction(query, variables)
                    let items = response?.data?.profiles?.items
                    for (let i = 0; i < items.length; i++) {
                        let item = items[i]
                        if (item?.stats?.totalFollowers >= minimumFollowers) {
                            _addresses.push(item?.ownedBy)
                        }
                        if (_addresses.length >= limit) {
                            break
                        }
                    }
                    if ((totalCount - count) > 50) {
                        count += 50
                    } else {
                        count = totalCount
                    }
                    if ((filter.limit) && (count == totalCount) && (_addresses.length < filter.limit)) {
                        if (balance == 0) {
                            break
                        }
                        totalCount = totalCount - filter.limit
                        let remainder = limit - _addresses.length
                        count = totalCount - remainder
                        if (count < 0) {
                            count = 0
                        }
                        balance = count
                    }
                    cursor = "{\"offset\":" + count + "}"
                    variables.request.cursor = cursor
                }  
                
                if (filter.limit && (_addresses.length > filter?.limit)) {
                    _addresses = _addresses.slice(-filter.limit)
                }

                allAddresses = _addresses
            } else if (filter.reaction === 'Comment') {
                let totalCount = (await queryFunction(query, variables))?.data?.publications?.pageInfo?.totalCount
                let count: number

                if (filter.limit) {
                    count = totalCount - filter.limit
                    cursor = "{\"offset\":" + count + "}"
                    variables.request.cursor = cursor
                } else {
                    count = 0
                }

                let limit = filter.limit ? filter.limit : totalCount

                let _addresses: Array<any> = []
                let balance = count

                while ((count < totalCount) && (_addresses.length < limit)) {
                    const response = await queryFunction(query, variables)
                    let items = response?.data?.publications?.items
                    for (let i = 0; i < items.length; i++) {
                        let item = items[i]
                        if (item?.stats?.totalFollowers >= minimumFollowers) {
                            _addresses.push(item?.profile?.ownedBy)
                        }
                        if (_addresses.length >= limit) {
                            break
                        }
                    }
                    if ((totalCount - count) > 50) {
                        count += 50
                    } else {
                        count = totalCount
                    }
                    if ((filter.limit) && (count == totalCount) && (_addresses.length < filter.limit)) {
                        if (balance == 0) {
                            break
                        }
                        totalCount = totalCount - filter.limit
                        let remainder = limit - _addresses.length
                        count = totalCount - remainder
                        if (count < 0) {
                            count = 0
                        }
                        balance = count
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
                    let items = response?.data?.followers?.items
                    for (let i = 0; i < items.length; i++) {
                        let item = items[i]
                        if (item?.stats?.totalFollowers >= minimumFollowers) {
                            _addresses.push(item?.wallet?.address)
                        }
                    }
                    count += 25
                    cursor = "{\"offset\":" + count + "}"
                    variables.request.cursor = cursor
                }

                allAddresses = _addresses
            } else if (filter.reaction === 'Like') {
                let totalCount = (await queryFunction(query, variables))?.data?.whoReactedPublication?.pageInfo?.totalCount
                let count: number

                if (filter.limit) {
                    count = totalCount - filter.limit
                    cursor = "{\"offset\":" + count + "}"
                    variables.request.cursor = cursor
                } else {
                    count = 0
                }

                let limit = filter.limit ? filter.limit : totalCount

                let _addresses: Array<any> = []
                let balance = count

                while ((count < totalCount) && (_addresses.length < limit)) {
                    const response = await queryFunction(query, variables)
                    let items = response?.data?.whoReactedPublication?.items
                    for (let i = 0; i < items.length; i++) {
                        let item = items[i]
                        if (item?.stats?.totalFollowers >= minimumFollowers) {
                            _addresses.push(item?.profile?.ownedBy)
                        }
                        if (_addresses.length >= limit) {
                            break
                        }
                    }
                    if ((totalCount - count) > 50) {
                        count += 50
                    } else {
                        count = totalCount
                    }
                    if ((filter.limit) && (count == totalCount) && (_addresses.length < filter.limit)) {
                        if (balance == 0) {
                            break
                        }
                        totalCount = totalCount - filter.limit
                        let remainder = limit - _addresses.length
                        count = totalCount - remainder
                        if (count < 0) {
                            count = 0
                        }
                        balance = count
                    }
                    cursor = "{\"offset\":" + count + "}"
                    variables.request.cursor = cursor
                }

                if (filter.limit && (_addresses.length > filter?.limit)) {
                    _addresses = _addresses.slice(-filter.limit)
                }

                allAddresses = _addresses
            }

            addresses = allAddresses
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
