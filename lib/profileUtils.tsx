import { EnsProfile, getSocialProfiles } from "thirdweb/social";
import { thirdwebClient } from "./client/thirdwebClient";
import { resolveScheme } from "thirdweb/storage";
import { url } from "inspector";

//todo: pegar acount do Lens
//todo: pegar dados do Farcaster pra imagem de avatar e nome
export async function getProfileByAddress(address: string) {
    const finalProfile = {
        image: "/avatar.png",
        name: address.substring(0, 6) + "..." + address.substring(address.length - 4, address.length),
        bio: "",
        url: "", }

    const profiles = await getSocialProfiles({
        address: address,
        client: thirdwebClient,
      });

      const ensProfile = profiles && profiles.find(profile => profile.type === 'ens');
      if (ensProfile && ensProfile.type === 'ens') {
        finalProfile.name = ensProfile.name!;
        const metadata = ensProfile.metadata as EnsProfile;
        finalProfile.image = metadata.avatar!;
        finalProfile.bio = ensProfile.bio!;
      }

      return finalProfile;

      //const imageurl = resolveScheme({ uri: nft.metadata.image!, client: thirdwebClient });
}

export function formatAddress(address: string) {
    const formatedAddress = address.substring(0, 6) + "..." + address.substring(address.length - 4, address.length);
    return formatedAddress;
}

export function isWalletAddress(address: string) {
    const isValid = address.length === 42 && address.startsWith("0x");
    return isValid;
}