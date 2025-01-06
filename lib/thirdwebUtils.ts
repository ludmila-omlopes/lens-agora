import { getOwnedNFTs } from "thirdweb/extensions/erc721";
import { lensTestnetChain } from "./lensNetwork";

//Todos os métodos disponíveis na API do Insight: https://insight-api.thirdweb.com/reference#tag/events

const baseUrl = 'https://' + lensTestnetChain.id + '.insight.thirdweb.com/v1/';
const methods = ['events/', 'transactions/', 'tokens/erc20/', 'tokens/erc721/', 'tokens/erc1155/'];

async function callThirdwebInsight(url: string) {
    try {
        const response = await fetch(url, {
            headers: {
                'x-client-id': process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getERC1155OwnedByAddress(address: string) {
    const url = baseUrl + 'tokens/erc1155/' + address;
    return callThirdwebInsight(url);
}

export async function getERC721OwnedByAddress(address: string) {
    const url = baseUrl + 'tokens/erc721/' + address;
    return callThirdwebInsight(url);
}

export async function getERC20OwnedByAddress(address: string) {
    const url = baseUrl + 'tokens/erc20/' + address;
    return callThirdwebInsight(url);
}