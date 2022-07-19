import { ApolloClient, InMemoryCache } from '@apollo/client'
import { API_URL } from './constants'

export const apolloClient= new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
})

export default apolloClient
