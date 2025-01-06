import "viem/window";

import { Address, createWalletClient, custom } from "viem";
import { chains } from "@lens-network/sdk/viem";

// For more information on hoisting accounts,
// visit: https://viem.sh/docs/accounts/local.html#optional-hoist-the-account
const [account] = (await window.ethereum!.request({
  method: "eth_requestAccounts",
})) as [Address];

export const walletClient = createWalletClient({
  account,
  chain: chains.testnet,
  transport: custom(window.ethereum!), //or http("https://custom-rpc-node.com")
});