import { gql } from '@apollo/client';

export const GET_CHALLENGE = gql `
    query($request: ChallengeRequest!) {
     challenge(request: $request) { text }
    }
`