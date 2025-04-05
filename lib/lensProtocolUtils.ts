import { Account, evmAddress } from "@lens-protocol/client";
import { currentSession, fetchAccounts, fetchAccountsAvailable, fetchAuthenticatedSessions } from "@lens-protocol/client/actions";
import { lensPublicClient, lensPublicMainnetClient } from "./client/lensProtocolClient";
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { signMessage } from '@wagmi/core'
import { config } from "@/app/Web3Provider";

const appAddress = "0xaC19aa2402b3AC3f9Fe471D4783EC68595432465";

export async function listAvailableLensAccounts(accountAddress: string)
{
  if(!accountAddress)
  {
    return null;
  }
  const result = await fetchAccountsAvailable(lensPublicClient, {
    managedBy: accountAddress,
    includeOwned: true,
  });

  console.log("accounts available: ", result);

  if (result.isErr()) {
    return console.error(result.error);
  }
  
  const lensAccounts = result.value;
  
  return lensAccounts;
}

export async function loginAccountless(account: any) {

const authenticated = await lensPublicClient.login({
  onboardingUser: {
    app: appAddress,
    wallet: account.address,
  },
  signMessage: (message) => account.signMessage({ message }),
});

if (authenticated.isErr()) {
  return console.error(authenticated.error);
}

// SessionClient: { ... }
const sessionClient = authenticated.value;
return sessionClient;
}

export async function loginWithAccount(accountAddress: string, lensAccount: any) {
  const authenticated = await lensPublicClient?.login({
    accountOwner: {
      account: lensAccount.address,
      app: appAddress,
      owner: accountAddress,
    },
    signMessage: (message) => signMessage(config, { message: message }),
  });
  
  if (authenticated.isErr()) {
    return console.error(authenticated.error);
  }
  
  const sessionClient = authenticated.value;
  return sessionClient;
}

export async function login(accountAddress: string) {
  const lensaccounts = await listAvailableLensAccounts(accountAddress);
  console.log("lensaccounts: ", lensaccounts);

  //const session = await loginAccountless(account);

  /*const authenticated = await lensClient.login({
    accountOwner: {
      account: null, //esse account na verdade é um app
      app: appAddress,
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
  if (!lensPublicClient) {
    return null;
  }
  const resumed = await lensPublicClient.resumeSession();

if (resumed.isErr()) {
  return null;
}
const sessionClient = resumed.value;
const result = await currentSession(sessionClient);

if (result.isErr()) {
  return console.error(result.error);
}

// AuthenticatedSession: { authenticationId: UUID, app: EvmAddress, ... }
const session = result.value;
return session;
}

const REVOKE_AUTHENTICATION = gql`
  mutation RevokeAuthentication($request: RevokeAuthenticationRequest!) {
    revokeAuthentication(request: $request)
  }
`;

export const useLogout = () => {
  const [revokeAuthentication, { loading, error, data }] = useMutation(REVOKE_AUTHENTICATION, { errorPolicy: 'all' });

  const logout = async (authenticationId: string) => {
    if (!authenticationId) {
      console.error('No authentication ID provided');
      return;
    }
    try {
      await revokeAuthentication({ variables: { request: { authenticationId } } });
      localStorage.removeItem('lens_auth_token');
      window.location.reload();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return { logout, loading, error, data };
};

export async function logout() {
  const resumed = await lensPublicClient.resumeSession();

if (resumed.isErr()) {
  return console.error(resumed.error);
}
const sessionClient = resumed.value;
console.log("sessionClient: ", sessionClient);
const result = await sessionClient.logout();
/*const userResult = await sessionClient.getAuthenticatedUser();
if (userResult.isErr()) {
  return console.error(userResult.error);
}

const authenticatedUser = userResult.value;
console.log("authenticatedUser: ", authenticatedUser);

const result = await sessionClient.mutation(REVOKE_AUTHENTICATION, {
  request: {
    authenticationId: authenticatedUser.authenticationId,
  },
});*/

console.log("logout result: ", result);
}

export async function searchLensAccounts(search: string) {
  const result = await fetchAccounts(lensPublicMainnetClient, {
    filter: {
      searchBy: {
        localNameQuery: search,
      },
    },
  });
  
  if (result.isErr()) {
    return console.error(result.error);
  }
  
  // items: Array<Account>
  const { items, pageInfo } = result.value;

  return items as Account[];
}