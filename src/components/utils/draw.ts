import apolloClient from 'src/apollo'
import { Profile } from '@generated/types'
import { GET_DEFAULT_PROFILE } from 'src/graphql/Queries/Profile'

export const Draw = async (addresses: Array<string>, numberOfWinners: number): Promise<Profile[] | null> => {
    const addressLength = addresses.length
    const actualAddresses = addresses
    var winners = []
    let updatedAddresses = actualAddresses
   
    for (let i=0; i<addressLength; i++) {
        if (updatedAddresses.length === 0) {
            return winners
        }

        const defaultProfile = generateDraw(updatedAddresses)
        if (await defaultProfile.profile) {
            winners.push(await defaultProfile.profile)
            updatedAddresses = updatedAddresses.filter((address, index) => index !== defaultProfile.index)
            if (winners.length === numberOfWinners) {
                return winners
            }
        } else {
            updatedAddresses = updatedAddresses.filter((address, index) => index !== defaultProfile.index)
        }

    }
    
    return winners
}

const getDefaultProfile = async(winnerAddress: string): Promise<Profile> => {
    const profile = await apolloClient.query({
        query: GET_DEFAULT_PROFILE,
        variables: {
            request: {
                ethereumAddress: winnerAddress
            }
        },
    })

    return profile.data.defaultProfile
}

interface ProfileIndex {
    profile: Promise<Profile>
    index: number
}
const generateDraw = (addresses: Array<string>): ProfileIndex => {
    const number = addresses.length

    const winner = Math.random() * number

    const winnerAddress = addresses[Math.floor(winner)]
    
    const defaultProfile = getDefaultProfile(winnerAddress)
    return {
        profile: defaultProfile,
        index: Math.floor(winner)
    }
}