import { EnsProfile, getSocialProfiles } from "thirdweb/social";
import { thirdwebClient } from "./client/thirdwebClient";
import { resolveScheme } from "thirdweb/storage";
import { url } from "inspector";
import {  evmAddress } from "@lens-protocol/client";
import { fetchAccountsBulk } from "@lens-protocol/client/actions";
import { lensPublicClient } from "./client/lensProtocolClient";

//todo: pegar dados do Farcaster pra imagem de avatar e nome
export async function getProfileByAddress(addresses: string | string[]) {

    const addressArray = Array.isArray(addresses) ? addresses : [addresses];

    const lensAccounts = await fetchAccountsBulk(lensPublicClient, {
      ownedBy: addressArray.map(addr => evmAddress(addr))
  });

    const profiles = await Promise.all(addressArray.map(async (address) => {
        const profile = {
            image: "/avatar.png", 
            name: address.substring(0, 6) + "..." + address.substring(address.length - 4, address.length),
            bio: "",
            url: "",
        };

        if (lensAccounts.isOk()) {
            const account = lensAccounts.value.find(acc => 
                acc.owner.toLowerCase() === address.toLowerCase()
            );
            
            if (account) {
                profile.name = account.metadata?.name || account.username?.localName || formatAddress(address);
                profile.image = account.metadata?.picture || "/placeholder.png";
                profile.bio = account.metadata?.bio || "";
            }
        }

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
