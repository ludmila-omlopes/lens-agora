import { StorageClient } from "@lens-chain/storage-client";

const apiKey = process.env.ALCHEMY_API_KEY;

export async function fetchAlchemyAPI(url: string) {
    try {
        const response = await fetch(url,);
    
        if (!response.ok) {
          throw new Error(`Alchemy API error: ${response.status} ${response.statusText}`);
        }
    
        return await response.json();

      } catch (error) {
        console.error('Error fetching data from Alchemy:', error);
        throw error;
      }
    
    }

    export function mapAlchemyNFT(nft: any) {
        
        return {
            id: nft.tokenId,
          contractAddress: nft.contract.address,
          name: nft.name || `#${nft.tokenId}`,
          description: nft.description || '',
          image: nft.image?.originalUrl || nft.image?.pngUrl || nft.image?.url || '/placeholder.png',
          metadata: {
            name: nft.name || `#${nft.tokenId}`,
            description: nft.description || '',
            image: nft.image?.originalUrl || nft.image?.pngUrl || nft.image?.url || '/placeholder.png',
            attributes: nft.raw?.metadata?.attributes || []
          },
          owner: nft.owner,
          type: nft.contract.tokenType || 'ERC721',
          supply: nft.balance || '1',
        }
    }