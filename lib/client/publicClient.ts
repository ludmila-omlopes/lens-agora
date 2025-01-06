import { createPublicClient, http } from "viem";
import { chains } from "@lens-network/sdk/viem";

export const publicClient = createPublicClient({
  chain: chains.testnet,
  transport: http(),  //or http("https://custom-rpc-node.com")
});