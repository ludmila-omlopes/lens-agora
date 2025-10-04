import { EnsProfile, getSocialProfiles } from "thirdweb/social";
import { thirdwebClient } from "./client/thirdwebClient";
import { resolveScheme } from "thirdweb/storage";
import { url } from "inspector";
import {  evmAddress, Account, AccountGraphsFollowStats } from "@lens-protocol/client";
import { fetchAccountsBulk, lastLoggedInAccount } from "@lens-protocol/client/actions";
import { lensPublicClient } from "./client/lensProtocolClient";
import { lensServerClient } from "./client/lensServerClient";
import { getAccountStats, getLensAccount, getIsFollowingStatus, getLensAccountByAddress } from "./lensProtocolUtils";
import { NFTCollection } from "./types";
import { listNFTsOwnedBy } from "./nfts";

export async function getProfileByAddress(addresses: string | string[]) {
    //todo: revisar se precisa transformar em Profile ou se pode retornar a account.

    const addressArray = Array.isArray(addresses) ? addresses : [addresses];

    const lensAccountsOwnedBy = await fetchAccountsBulk(lensServerClient, {
      ownedBy: addressArray.map(addr => evmAddress(addr))
  });

  const lensAccounts = await fetchAccountsBulk(lensServerClient, {
    addresses: addressArray.map(addr => evmAddress(addr))
  });

    const profiles = await Promise.all(addressArray.map(async (address) => {
        const profile = {
            image: "/avatar.png", 
            name: formatAddress(address), // Use formatAddress helper
            bio: "",
            url: "/profile/" + address,
        };

        // Case 1: Address IS an account (check if address matches account.address)
        if (lensAccounts.isOk()) {
            const account = lensAccounts.value.find(acc => 
                acc.address.toLowerCase() === address.toLowerCase()
            );
            
            if (account) {
                profile.name = account.metadata?.name || account.username?.localName || formatAddress(address);
                profile.image = account.metadata?.picture || "/placeholder.png";
                profile.bio = account.metadata?.bio || "";
                return profile; // Found account directly, return early
            }
        }

        // Case 2: Address OWNS an account (check if address matches account.owner)
        if (lensAccountsOwnedBy.isOk()) {
            const account = lensAccountsOwnedBy.value.find(acc => 
                acc.owner.toLowerCase() === address.toLowerCase()
            );
            
            if (account) {
                profile.name = account.metadata?.name || account.username?.localName || formatAddress(address);
                profile.image = account.metadata?.picture || "/placeholder.png";
                profile.bio = account.metadata?.bio || "";
                return profile; // Found owned account, return early
            }
        }

        // Case 3: Address has no associated account - return basic profile with formatted address
        return profile;
    }));

    // Return single profile if input was single address, otherwise return array
    return Array.isArray(addresses) ? profiles : profiles[0];
}

export function formatAddress(address: string) {
    const formatedAddress = address.substring(0, 6) + "..." + address.substring(address.length - 4, address.length);
    return formatedAddress;
}

export function isWalletAddress(address: string) {
    const isValid = address.length === 42 && address.startsWith("0x");
    return isValid;
}

export interface ProfileData {
  accountStats: AccountGraphsFollowStats[] | null
  isFollowing: boolean[]
  isWallet: boolean
  walletAddress: string | null
  lensAccounts: Account[] | null
  ownedNFTs?: NFTCollection[]
}

export async function fetchProfileData(username: string, loggedAccountAddress?: string): Promise<ProfileData> {
  const identifier = username
  const isWalletAddressCheck = isWalletAddress(identifier)
  
  let accountStats: AccountGraphsFollowStats[] = []
  let isFollowing: boolean[] = []
  let walletAddress: string | null = null
  let lensAccounts: Account[] | null = null
  let isWallet = true

  if (!isWalletAddressCheck) {
    // Handle Lens username
    const lensAccount = await getLensAccount(username)
    if (lensAccount) {
      walletAddress = lensAccount.owner 
      isWallet = false
      
      if (loggedAccountAddress) {
        const isFollowingStatus = await getIsFollowingStatus(username, lensAccount.address)
        isFollowing.push(isFollowingStatus || false)
      }
      
      const accStats = await getAccountStats(username)
      if (accStats) {
        accountStats.push(accStats)
      }
    }
  } else {
    const lensAccount = await getLensAccountByAddress(identifier);

    if (lensAccount && lensAccount.username) {
        isWallet = false    
        lensAccounts = [lensAccount]
        walletAddress = lensAccount.owner

        if (loggedAccountAddress) {
          const isFollowingStatus = await getIsFollowingStatus(lensAccount.username?.localName || "", loggedAccountAddress)
          isFollowing.push(isFollowingStatus || false)
        }
        const accStats = await getAccountStats(lensAccount.username?.localName || "")
        if (accStats) {
          accountStats.push(accStats)
        }
    }
    else {
        isWallet = true
        const result = await fetchAccountsBulk(lensServerClient, {
        ownedBy: [evmAddress(identifier)],
        });
    
        if (!result || result.isErr() || result.value.length === 0) {
        walletAddress = identifier

        } else {
            lensAccounts = result.value
            walletAddress = identifier
            for (const account of lensAccounts) {
                if (account.username?.localName && loggedAccountAddress) {
                const isFollowingStatus = await getIsFollowingStatus(
                    account.username.localName, 
                    account.address
                )
                isFollowing.push(isFollowingStatus || false)
                }

                const accStats = await getAccountStats(account.username?.localName || "")
                if (accStats) {
                accountStats.push(accStats)
                }
            }

            
            if (lensAccounts[0].username?.localName) {
                const accStats = await getAccountStats(lensAccounts[0].username.localName)
                if (accStats) {
                accountStats.push(accStats)
                }
        }
        }
    }
  }

  // Fetch owned NFTs for wallet addresses
  let ownedNFTs: NFTCollection[] | undefined = undefined;
  if (isWalletAddressCheck && walletAddress) {
    try {
      const nfts = await listNFTsOwnedBy(walletAddress, true);
      console.log("owned nfts: ", nfts);
      ownedNFTs = nfts || [];
    } catch (error) {
      console.error('Error fetching owned NFTs:', error);
      ownedNFTs = [];
    }
  }

  return {
    accountStats,
    isFollowing,
    isWallet,
    walletAddress,
    lensAccounts,
    ownedNFTs
  }
}

export async function getLastLoggedAccountByWalletAddress(walletAddress: string) { //todo: mudar o nome?
  
    //por algum motivo, esse não funciona server-side
    //const result = await lastLoggedInAccount(lensServerClient, {
    //  address: evmAddress(walletAddress),
    //});

    const result = await fetchAccountsBulk(lensServerClient, {
      ownedBy: [evmAddress(walletAddress)],
    });
  
    if (result.isErr()) {
      console.error(result.error);
      return null;
    }

    const higherRankAccount = result.value  && result.value.length > 0 ? result.value.reduce((prev, curr) => prev.score > curr.score ? prev : curr) : null;
  
    return higherRankAccount;
  }
