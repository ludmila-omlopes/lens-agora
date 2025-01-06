import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const ENDPOINT = "https://api.testnet.lens.dev/graphql";

const apolloClient = new ApolloClient({
  uri: ENDPOINT,
  cache: new InMemoryCache(),
});

export default apolloClient;