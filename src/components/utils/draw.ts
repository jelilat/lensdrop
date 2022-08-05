import apolloClient from 'src/apollo'
import { Profile } from '@generated/types'
import { GET_DEFAULT_PROFILE } from 'src/graphql/Queries/Profile'

export const Draw = async (addresses: Array<string>): Promise<Profile | null> => {
    for (let i=0; i< addresses.length; i++) {
        const defaultProfile = await generateDraw(addresses)
        if (defaultProfile) {
            return defaultProfile
        }
    }
    
    return null
}

const getDefaultProfile = async(winnerAddress: string): Promise<Profile> => {
    const profile = await apolloClient.query({
        query: GET_DEFAULT_PROFILE,
        variables: {
            request: {
                ethereumAddress: winnerAddress
            }
        },
        fetchPolicy: 'no-cache',
    })

    return profile.data.defaultProfile
}

const generateDraw = (addresses: Array<string>): Promise<Profile> => {
    const number = addresses.length

    const winner = Math.random() * number

    const winnerAddress = addresses[Math.floor(winner)]
    
    const defaultProfile = getDefaultProfile(winnerAddress)
    return defaultProfile
}