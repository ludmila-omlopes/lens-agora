"use server"

import { listNFTsOwnedBy } from "../../../lib/nfts"
import { NFTCollection } from "../../../lib/types"

export async function getOwnedNFTsAction(
  address: string, 
  fetchCreatorsSocialAccounts: boolean = false
): Promise<NFTCollection[]> {
  try {
    if (!address) {
      throw new Error("Address is required");
    }

    const ownedNFTs = await listNFTsOwnedBy(address, fetchCreatorsSocialAccounts);
    return ownedNFTs;
  } catch (error) {
    console.error("Error in getOwnedNFTsAction:", error);
    throw error;
  }
}
