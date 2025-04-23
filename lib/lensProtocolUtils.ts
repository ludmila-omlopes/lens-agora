import { Account, AnyPost, evmAddress, MainContentFocus, PageSize, PaginatedResultInfo, Post, PostId, postId, PostReferenceType, PostVisibilityFilter, uri } from "@lens-protocol/client";
import { currentSession, fetchAccounts, fetchAccountsAvailable, fetchAuthenticatedSessions, fetchPost, fetchPostReferences, fetchPosts, post } from "@lens-protocol/client/actions";
import { lensPublicClient, lensPublicMainnetClient } from "./client/lensProtocolClient";
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { signMessage } from '@wagmi/core'
import { config } from "@/app/Web3Provider";
import { NFT } from "thirdweb";
import { textOnly } from "@lens-protocol/metadata";
import { uploadMetadataToGrove } from "./lensNetwork";

const appAddress = "0xC75A89145d765c396fd75CbD16380Eb184Bd2ca7";

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
  return console.error(resumed.error);
}
const sessionClient = resumed.value;
console.log("sessionClient: ", sessionClient);

const result = await currentSession(sessionClient);

if (result.isErr()) {
  return console.error(result.error);
}

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

export async function listPostsByNFT(nftId: string, collectionAddress: string ) {
  const tag = (collectionAddress + nftId).toLowerCase();
  const result = await fetchPosts(lensPublicClient, {
    filter: {
      metadata: {
        tags: { all: [tag] }
      },
    },
  });
  
  if (result.isErr()) {
    return console.error(result.error);
  }
  
  const { items, pageInfo } = result.value;
  if (items.length === 0) {
    return null;
  }
  return { items, pageInfo };
}

export async function listCommentsFromPost(id: string, cursor?: string) {
  const result = await fetchPostReferences(lensPublicClient, {
    referencedPost: postId(id),
    referenceTypes: [PostReferenceType.CommentOn],
    visibilityFilter: PostVisibilityFilter.Visible,
    pageSize: PageSize.Fifty,
    cursor: cursor,
  });

  if (result.isErr()) {
    return console.error(result.error);
  }

  const { items, pageInfo } = result.value;
  if (items.length === 0) {
    return null;
  }

  return { items, pageInfo };
}

export async function listCommentsFromPosts(ids: PostId[]) {
  //todo: não implementa paginação ainda
  const consolidatedResults: [AnyPost[], PaginatedResultInfo[]] = [[], []];

  for (const id of ids) {
    const result = await listCommentsFromPost(id);

    if (!result) {
      console.error("No comments found for post:", id);
      continue;
    }
    if (!result.items || !result.pageInfo) {
      console.error("Invalid result structure:", result);
      continue;
    }

    consolidatedResults[0].push(...result.items);
    consolidatedResults[1].push(result.pageInfo);
  }

  return consolidatedResults[0].length > 0 ? consolidatedResults : null;
} 

export async function getPostById(id: string) {
  const result = await fetchPost(lensPublicClient, {
    post: postId(id),
  });
  
  if (result.isErr()) {
    return console.error(result.error);
  }
  
  const post = result.value;
  return post;
}

export async function createCommentOnPost(currentPostId: string, comment: string) {
  const resumed = await lensPublicClient.resumeSession();

    if (resumed.isErr()) {
      return console.error(resumed.error);
    }
    const sessionClient = resumed.value; //todo: separa isso em outro método talvez?
  
  const currentPost = await getPostById(currentPostId);
  if (!currentPost) {
    return null;
  }

  if (currentPost.__typename !== "Post") {
    console.error("Post not found");
    return null;
  }

  var canComment = false;

  switch (currentPost.operations?.canComment.__typename) {
    case "PostOperationValidationPassed":
      // Commenting is allowed
      canComment = true;
      break;
  
    case "PostOperationValidationFailed":
      // Commenting is not allowed
      console.log(currentPost.operations.canComment.reason);
      break;
  
    case "PostOperationValidationUnknown":
      // Validation outcome is unknown
      break;
  }
  //todo: apoiar outros tipos de metadados depois
  const metadata = textOnly({
    content: comment,
  });

  const metadataURI = uploadMetadataToGrove(metadata);
  const result = await post(sessionClient, {
    contentUri: uri((await metadataURI).uri
    ),
    commentOn: {
      post: postId(currentPostId),
    },
  });

  
}

export async function createCommentonNFT(nftId: string, collectionAddress: string, comment: string) {
  const posts = await listPostsByNFT(nftId, collectionAddress);
  if (!posts) {
    return null;
  }
  const post = posts.items[0] as Post;
  createCommentOnPost(post.id, comment);
  return post;
}

export async function getCommentsForNFT(
  nftId: string,
  collectionAddress: string
): Promise<AnyPost[]> {
  try {
    const postResponse = await listPostsByNFT(nftId, collectionAddress);
    const postIds = postResponse?.items
      ?.filter((post): post is Post => post.__typename === "Post")
      .map((post) => post.id) || [];

    const commentsResponse = await listCommentsFromPosts(postIds);
    return commentsResponse ? commentsResponse[0] : [];
    
  } catch (error) {
    console.error("Failed to fetch comments for NFT:", error);
    return [];
  }
}