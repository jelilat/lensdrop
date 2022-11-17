import { GET_DEFAULT_PROFILE } from '@graphql/Queries/Profile'
import apolloClient from 'src/apollo'

export const getHandles = async (addresses: string[]): Promise<string> => {
    var checkHandles: string[] = []
    if (addresses.length > 10) {
        checkHandles = addresses.slice(0, 10)
    } else {
        checkHandles = addresses
    }
    const promises = checkHandles.map(async (address) => {
        const { data } = await apolloClient.query({
            query: GET_DEFAULT_PROFILE,
            variables: { request: { ethereumAddress: address } },
            fetchPolicy: 'no-cache',
        }); 
        return "@" + data?.defaultProfile?.handle
    })
    const handles = await Promise.all(promises)
    return handles.join(', ') + (addresses.length > 10 ? ' and ' + (addresses.length - 10) + ' others with @lensdropxyz.lens' : ' with @lensdropxyz.lens')
}