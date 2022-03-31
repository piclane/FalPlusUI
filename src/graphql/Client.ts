import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';

const httpLink = createHttpLink({
  uri: "/api/graphql",
  credentials: 'same-origin'
});

export const gqlClient = new ApolloClient({
  link: ApolloLink.from([httpLink]),
  cache: new InMemoryCache()
});
