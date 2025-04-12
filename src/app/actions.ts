import { deployERC1155Contract } from "thirdweb/deploys";
import { lensPublicClient } from "../../lib/client/lensProtocolClient";
import { defineChain } from "thirdweb/chains";
import { thirdwebClient } from "../../lib/client/thirdwebClient";
import { getContract } from "thirdweb/contract";
import { verifyContract } from "thirdweb/contract";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { evmAddress } from "@lens-protocol/client";
import { loginAccountless } from "../../lib/lensProtocolUtils";
import { createNFTContract } from "../../lib/nfts";
import { revalidatePath } from "next/cache";
import { Account } from "thirdweb/wallets";

export async function login(account: any) {
  const lensaccounts = await listAvailableLensAccounts(account);
  console.log("lensaccounts: ", lensaccounts);

  const session = await loginAccountless(account);

  /*const authenticated = await lensClient.login({
    accountOwner: {
      account: null, //esse account na verdade é um app
      app: "0xe5439696f4057aF073c0FB2dc6e5e755392922e1",
      owner: account?.address,
    },
    signMessage: (message) => account?.signMessage({ message })!,
  });

  if (authenticated.isErr()) {
    return console.error(authenticated.error);
  }

  // SessionClient: { ... }
  const sessionClient = authenticated.value;
  return sessionClient;*/
}

const lensChain = defineChain({
  id:37111,
  rpc: "https://rpc.testnet.lens.dev",});


 
export async function listAvailableLensAccounts(account: any)
{
  if(!account)
  {
    return null;
  }
  const result = await fetchAccountsAvailable(lensPublicClient, {
    managedBy: evmAddress(account.address),
    includeOwned: true,
  });
  return result;
}

//todo: revisar essa página. São server actions mesmo?