import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache
} from '@apollo/client'
import result from '@generated/types'
import Cookies, { CookieAttributes } from 'js-cookie'
import jwtDecode from 'jwt-decode'

const API_URL = 'https://api.lens.dev'

export const COOKIE_CONFIG: CookieAttributes = {
sameSite: 'None',
secure: true,
expires: 360
}

const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`

const httpLink = new HttpLink({
  uri: API_URL,
  fetchOptions: 'no-cors',
  fetch
})

const authLink = new ApolloLink((operation, forward) => {
const accessToken = Cookies.get('accessToken')

if (accessToken === 'undefined' || !accessToken) {
  Cookies.remove('accessToken')
  Cookies.remove('refreshToken')
  localStorage.removeItem('selectedProfile')

  return forward(operation)
} else {
  operation.setContext({
    headers: {
      'x-access-token': accessToken ? `Bearer ${accessToken}` : ''
    }
  })

  const { exp }: { exp: number } = jwtDecode(accessToken)

  if (Date.now() >= exp * 1000) {
    console.log('Auth', '#eab308', 'Generate new access token')
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operationName: 'Refresh',
        query: REFRESH_AUTHENTICATION_MUTATION,
        variables: {
          request: { refreshToken: Cookies.get('refreshToken') }
        }
      })
    })
      .then((res) => res.json())
      .then((res) => {
        operation.setContext({
          headers: {
            'x-access-token': accessToken
              ? `Bearer ${res?.data?.refresh?.accessToken}`
              : ''
          }
        })
        Cookies.set(
          'accessToken',
          res?.data?.refresh?.accessToken,
          COOKIE_CONFIG
        )
        Cookies.set(
          'refreshToken',
          res?.data?.refresh?.refreshToken,
          COOKIE_CONFIG
        )
        console.log('Auth', '#eab308', 'New access token generated')
      })
      .catch(() => console.log("ERROR_MESSAGE"))
  }

  return forward(operation)
}
})

const cache = new InMemoryCache({ possibleTypes: result.possibleTypes })

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache
})

export const nodeClient = new ApolloClient({
  link: httpLink,
  cache
})

export default client