import { gql } from '@apollo/client'

export const AUTHENTICATION = gql`
 mutation($request: SignedAuthChallenge!) { 
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
 }
`