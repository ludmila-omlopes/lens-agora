import { evmAddress } from "@lens-protocol/client";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { lensPublicClient } from "./client/lensProtocolClient";

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

  if (result.isErr()) {
    return console.error(result.error);
  }
  
  const lensAccounts = result.value;
  
  return lensAccounts;
}

export async function loginAccountless(account: any) {

const authenticated = await lensPublicClient.login({
  onboardingUser: {
    app: "0xe5439696f4057aF073c0FB2dc6e5e755392922e1",
    wallet: account.address,
  },
  signMessage: (message) => account.signMessage({ message }),
});

if (authenticated.isErr()) {
  return console.error(authenticated.error);
}

// SessionClient: { ... }
const sessionClient = authenticated.value;
console.log("sessionClient: ", sessionClient);
return sessionClient;
}

export async function loginWithAccount(account: any, lensAccount: any) {
  const authenticated = await lensPublicClient?.login({
    accountOwner: {
      account: lensAccount.address,
      app: "0xe5439696f4057aF073c0FB2dc6e5e755392922e1",
      owner: account.address,
    },
    signMessage: (message) => account.signMessage({ message }),
  });
  
  if (authenticated.isErr()) {
    return console.error(authenticated.error);
  }
  
  const sessionClient = authenticated.value;
  console.log("sessionClient account: ", sessionClient);
  return sessionClient;
}