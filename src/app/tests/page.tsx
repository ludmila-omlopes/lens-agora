import { getL1ChainId } from "viem/zksync";
import { publicClient } from "../../../lib/client/publicClient";
import ClientTest from "./clienttest";
import apolloClient from "../../../lib/client/apolloClient";
import TestQuery from "../../lib/gql/test.graphql";
import { gql } from "@apollo/client";
import { lensPublicClient } from "../../../lib/client/lensProtocolClient";

const chainId = await getL1ChainId(publicClient);
console.log("teste:  ", chainId);

const variables = {
  request: {
    pageSize: "FIFTY",
    //cursor
  }
};


async function testGQL() {
    const { data } = await apolloClient.query({
      variables: variables,
      query: gql`
    query TEST($request: AccountsRequest!) {
      health
            accounts(request: $request) {
              items {
                address
                createdAt
                score
                username {
                  localName
                }
                owner
              }
            }
    }
  `,
    });
    console.log("testGQL: ", data);
    return data;
}

const test = await testGQL();

console.log("test: ", test);

export default function Page() {
    return <ClientTest chainid={chainId} health={test.health} />;
}