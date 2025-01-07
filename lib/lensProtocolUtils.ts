import { evmAddress } from "@lens-protocol/client";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { lensPublicClient } from "./client/lensProtocolClient";

export async function listAvailableLensAccounts(accountAddress: string)
{
  if(!accountAddress)
  {
    return null;
  }
  const result = await fetchAccountsAvailable(lensPublicClient, {
    managedBy: evmAddress(accountAddress),
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

export async function login(account: any) {
  const lensaccounts = await listAvailableLensAccounts(account);
  console.log("lensaccounts: ", lensaccounts);

  //const session = await loginAccountless(account);

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

export async function getCurrentSession() {
  const resumed = await lensPublicClient?.resumeSession();
  if (resumed && resumed.isErr()) {
    return console.error(resumed.error);
  }
  const sessionClient = resumed?.value;
  console.log("sessionClient: ", sessionClient);
  return sessionClient;
}