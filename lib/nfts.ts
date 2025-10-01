import { getAddress, getContract, Insight, NFT, readContract, sendTransaction } from "thirdweb";
import { thirdwebClient, thirdwebClientServer } from "./client/thirdwebClient";
import { getNFT as getNFT1155, getNFTs as getNFTs1155, mintTo as mintERC1155to, lazyMint as lazyMintERC1155, setApprovalForAll } from "thirdweb/extensions/erc1155";
import { getNFT as getNFT721, getNFTs as getNFTs721, mintTo as mintERC721to, lazyMint as lazyMintERC721, approve, getAllOwners, getOwnedNFTs } from "thirdweb/extensions/erc721";
import { lensTestnetBlockexplorerAPI, lensTestnetChain, activeChain } from "./lensNetwork";
import { deployERC1155Contract, deployERC721Contract } from "thirdweb/deploys";
import { verifyContract } from "thirdweb/contract";
import { isERC721 } from "thirdweb/extensions/erc721";
import { isERC1155 } from "thirdweb/extensions/erc1155";
import { setClaimConditions } from "thirdweb/extensions/erc721";
import { resolveScheme } from "thirdweb/storage";
import { Collection, CollectionMarketplaceInfo, erc1155NFT, NFTCollection } from "./types";
import { getCollectionMarketplaceInfo, marketplaceContractAddress } from "./marketplacev3";
import { getERC1155OwnedByAddress, getERC721OwnedByAddress, getNFTOwners } from "./thirdwebUtils";
import { addDeployedContract, listDeployedContractsByAddress } from "./db";
import { isNullish } from "@apollo/client/cache/inmemory/helpers";
import { immutable, StorageClient } from "@lens-chain/storage-client";
import { upload } from "thirdweb/storage";
import { list } from "postcss";
import { getLastLoggedAccountByWalletAddress } from "./lensProtocolUtils";
import { sepolia } from "thirdweb/chains";

export async function getCurrentNFT({ contractAdd, tokenId }: { contractAdd: string, tokenId: bigint }) {
   const contract = getContract({
     client: thirdwebClientServer,
     chain: activeChain,
     address: contractAdd,
   });
   
   const issingleNFT = await isERC721({ contract });
   const ismultiNFT = await isERC1155({ contract });

   if (issingleNFT) {
     const nft = await getNFT721({
       contract,
       tokenId,
       includeOwner: true
     });

     console.log("contract: ", contract);

    //fazendo isso aqui pq o owner não está sendo retornado pelo getNFT721
     const data = await readContract({
      contract,
      method: "function ownerOf(uint256 tokenId) view returns (address)",
      params: [tokenId],
    });

    nft.owner = data;

     return nft;
   }
   else if (ismultiNFT) {
     const nft = await getNFT1155({
       contract,
       tokenId
     });

     const data = await getNFTOwners(contractAdd, tokenId.toString());
     const owners = data.data.find((chain_id: { chain_id: string; }) => chain_id.chain_id === activeChain.id.toString()).owner_addresses;
     const finalNFT = {
      legacyNFT: nft,
      owners: owners
     } as erc1155NFT;

     return finalNFT;
   }



    return null;
}

/**
 * Retrieves the current collection metadata and details for a given contract address.
 * @param {Object} params - The parameters for the function.
 * @param {string} params.contractAdd - The contract address of the NFT collection.
 * @returns {Promise<Collection>} The collection metadata and details.
 */
//todo: adicionar o tipo do contrato (drop, etc)	
export async function getCurrentCollection({ contractAdd }: { contractAdd: string }) {
  try {
    if (!contractAdd) {
      throw new Error("Contract address is required");
    }

    const contract = getContract({
      client: thirdwebClientServer,
      chain: activeChain,
      address: contractAdd,
    });

    if (!contract) {
      throw new Error("Failed to get contract");
    }

    let [contractOwner, contractMetadataURI, isMultiNFT, marketplaceInfo] = ["", "", false, null as CollectionMarketplaceInfo | null];
    let [contractName, contractSymbol, contractDescription, contractImageURI, contractImageURL, contractSocialLinks] = ["", "", "", "", "", []];
    try {
      [contractOwner, contractMetadataURI, isMultiNFT, marketplaceInfo] = await Promise.all([ //somente os contratos completos do thirdweb tem esses metodos
        readContract({ contract, method: "function owner() view returns (address)", params: [] }).catch(() => ""), // Return empty string if owner() fails
        readContract({ contract, method: "function contractURI() view returns (string)", params: [] }).catch(() => ""), // Return empty string if contractURI() fails
        isERC1155({ contract }),
        getCollectionMarketplaceInfo(contractAdd)
      ]);
    } catch (error) {
      console.error(`Failed to fetch contract data: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
    

    if (!contractMetadataURI) {
      [contractName, contractSymbol] = await Promise.all([
        readContract({ contract, method: "function name() view returns (string)", params: [] }).catch(() => ""), // Return empty string if name() fails
        readContract({ contract, method: "function symbol() view returns (string)", params: [] }).catch(() => ""), // Return empty string if symbol() fails
      ]);
    }
    else {
      const metadataUrl = resolveScheme({ uri: contractMetadataURI, client: thirdwebClientServer });
    
      let metadata;
      try {
        const response = await fetch(metadataUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        metadata = await response.json();
        console.log("metadata: ", metadata);
      } catch (error) {
        throw new Error(`Failed to fetch metadata: ${error instanceof Error ? error.message : String(error)}`);
      }
  
      contractDescription = metadata.description;
      contractImageURI = metadata.image;
      contractImageURL = metadata.image && resolveScheme({uri: metadata.image, client: thirdwebClientServer});
      contractSocialLinks = metadata.links || [];
  
      contractName = metadata.name;
      contractSymbol = metadata.symbol;
    }

    if (!contractName || !contractSymbol) {
      return null;
    }

   
    let items;
    try {
      // Fetch NFT list in parallel with metadata fetching
      items = await listNFTs({ contractAdd, start: 0, count: 12 }); //como assim 12???
    } catch (error) {
      console.warn(`Failed to fetch NFT items: ${error instanceof Error ? error.message : String(error)}`);
      items = [];
    }

    const collection = {
      name: contractName,
      owner: contractOwner,
      address: contractAdd,
      description: contractDescription,
      imageUrl: contractImageURL,
      type: isMultiNFT ? "ERC1155" : "ERC721",
      symbol: contractSymbol,
      is1155: isMultiNFT,
      items: items,
      totalItems: items ? items.length : 0,
      marketplaceInfo: marketplaceInfo || null,
      socialLinks: contractSocialLinks
    } as Collection;

    return collection;

  } catch (error) {
    console.error("Error in getCurrentCollection:", error);
    throw error;
  }
}

export async function listNFTs({ contractAdd, start, count }: { contractAdd: string, start: number, count: number }) {
  
  const contract = getContract({
    client: thirdwebClientServer,
    chain: activeChain,
    address: contractAdd,
  });

  if (!contract) {
    throw new Error("Failed to get contract");
  }

  try {
    const issingleNFT = await isERC721({ contract });
    const ismultiNFT = await isERC1155({ contract });

      if (issingleNFT) {
          const nft = await getNFTs721({
          contract,
          start,
          count,
          useIndexer: true
          });
      
          return nft;
      }
      else if (ismultiNFT) {
          const nft = await getNFTs1155({
          contract,
          start,
          count
          });
      
          return nft;
    }
  } catch (error) {
    console.error("Error in listNFTs:", error);
    throw error;
  }
    return null;
}

//todo: acrescentar drops
//todo: subir metadados pro Lens Storage
//todo: se executar o deploy mas não o db, tratar.
export async function createNFTContract(account: any, contractType: string, name: string, symbol: string, description: string, image?: File, supply?: bigint) { 
  
  var contractAddress = "";

  switch(contractType) {
    case "unique":
      console.log("NFTCollection");
      contractAddress = await createSingleEditionContract(account, name, description, symbol, image);
      break;
    case "multi-edition":
      console.log("Edition");
      contractAddress = await createMultieditionContract(account, name, description, symbol, image);
      break;
    default:
      throw new Error("Invalid contract type chosen. Please select a valid type.");
  }

  if(contractAddress.length > 0) {
      const result = await addDeployedContract(account.address, contractAddress, contractType);
      console.log( "contract deployed result:", result.message);
      if(!result.success) {
        console.error(result.message);
      }
  }
  return contractAddress;

    /*const contract = getContract({
      chain: lensTestnetChain,
      address: contractAddress,
      client: thirdwebClient,
    });
    
    console.log("contract: ", contract);

    const verificationResult = await verifyContract({
    contract,
    explorerApiUrl: lensTestnetBlockexplorerAPI,
    explorerApiKey: "",
    });
    console.log(verificationResult);*/
  
    }

export async function mintNewNFT({ contractAdd, name, quantity, description, mintToAdd, account, media }: { contractAdd: string, name: string, quantity: bigint, description: string, mintToAdd: string, account: any, media: File }) {
    
  const storageClient = StorageClient.create();

  const acl = immutable(
    activeChain.id
  );

  const contract = getContract({
        chain: activeChain,
        address: contractAdd,
        client: thirdwebClient,
      });      
      
    const issingleNFT = await isERC721({ contract });
    const ismultiNFT = await isERC1155({ contract });

    const mediaUri = await upload({
      client: thirdwebClient,
      files: [media],
      });

      console.log("mediaUri: ", mediaUri);

    const nftMetadata = {
        name: name,
        description,
        image: mediaUri,
        //image: media,
      };

    const response = await storageClient.uploadAsJson(nftMetadata, { acl });

    console.log("response metadata: ", response);

    if(issingleNFT) {
        const transaction = mintERC721to({
            contract,
            to: mintToAdd,
            nft: response.gatewayUrl,
        });

       return  await sendTransaction({ transaction, account });
    }
    else if(ismultiNFT) {                       
      const transaction = mintERC1155to({
      contract,
      to: mintToAdd,
      supply: quantity,
      nft: response.gatewayUrl,
      });

      return await sendTransaction({ transaction, account });
  }

  return null;
}

export async function lazyMintNewNFTs({ contractAdd, name, description, account }: { contractAdd: string, name: string, description: string, account: any }) {
    const contract = getContract({
        chain: activeChain,
        address: contractAdd,
        client: thirdwebClient,
      });

    const issingleNFT = await isERC721({ contract });
    const ismultiNFT = await isERC1155({ contract });

    if(issingleNFT) {
        const transaction = lazyMintERC721({
            contract,
            nfts: [{ //pode ser URI ou metadados. Tem mais parametros como animation, background color, etc (https://portal.thirdweb.com/references/typescript/v5/NFTInput)
                name: name,
                description,
                image: "https://example.com/image.png", //todo: fazer upload. FileOrBufferOrString
            }],
        });

        await sendTransaction({ transaction, account });
    }
    else if(ismultiNFT) {
      const transaction = lazyMintERC1155({
      contract,
      nfts: [{ //pode ser URI ou metadados. Tem mais parametros como animation, background color, etc (https://portal.thirdweb.com/references/typescript/v5/NFTInput)
          name: name,
          description,
          image: "https://example.com/image.png", //todo: fazer upload. FileOrBufferOrString
        }],
      });

    await sendTransaction({ transaction, account });
  }

  return null;
} 

//todo: configurar o placeholder image
export function getNFTMediaURL(nft: NFT) {
  try {
    if (!nft) {
      throw new Error("NFT object is required");
    }

    if (nft.metadata && nft.metadata.image) {
      try {
        return resolveScheme({ uri: nft.metadata.image, client: thirdwebClientServer });
      } catch (error) {
        console.error("Error resolving NFT image URI:", error);
        return "/logo1.png";
      }
    }
    return "/logo1.png";
  } catch (error) {
    console.error("Error getting NFT media URL:", error);
    return "/logo1.png";
  }
}

export async function approveNFT(nft: NFT, nftcontract: string, account: any) {
  const contract = getContract({
    chain: activeChain,
    address: nftcontract,
    client: thirdwebClientServer,
  });

  switch (nft.type) {
    case "ERC721":
      const approveTransaction721 = approve({
        contract: contract,
        to: marketplaceContractAddress,
        tokenId: nft.id,
      });
      await sendTransaction({ transaction: approveTransaction721, account });
      break;
    case "ERC1155":
      const approveTransaction1155 = setApprovalForAll({
        contract: contract,
        operator: marketplaceContractAddress,
        approved: true,
      });
      await sendTransaction({ transaction: approveTransaction1155, account });
      break;
    default:
      break;
  }
}

export async function listNFTsOwnedBy(address: string, fetchCreatorsSocialAccounts: boolean = false): Promise<NFTCollection[]> {
  try {
    if (!address) {
      throw new Error("Address is required");
    }

    const [erc1155, erc721] = await Promise.all([
      getERC1155OwnedByAddress(address),
      getERC721OwnedByAddress(address)
    ]).catch(error => {
      throw new Error(`Failed to fetch owned NFTs: ${error.message}`);
    });

    const ownedNFTs = [];
    if (erc1155?.data) {
      ownedNFTs.push(...erc1155.data);
    }
    if (erc721?.data) {
      ownedNFTs.push(...erc721.data);
    }

    console.log("ownedNFTs: ", ownedNFTs);

    const nftPromises = ownedNFTs.map(async nft => {
      try {
        const nftData = await getCurrentNFT({ 
          contractAdd: nft.token_address, 
          tokenId: BigInt(nft.token_id) 
        });
        console.log("nftData: ", nftData);

        if (!nftData) {
          throw new Error(`Failed to fetch NFT data for token ${nft.token_id}`);
        }

        const collectionData = await getCurrentCollection({ 
          contractAdd: nft.token_address 
        });
        console.log("collectionData: ", collectionData);

        if (!collectionData) {
          throw new Error(`Failed to fetch collection data for address ${nft.token_address}`);
        }

        let creator = null;
        if (collectionData.owner && fetchCreatorsSocialAccounts) {
          creator = await getLastLoggedAccountByWalletAddress(collectionData.owner)
            .catch(error => {
              console.warn(`Failed to fetch creator social account: ${error.message}`);
              return null;
            });
        }

        return { 
          nft: nftData, 
          collection: collectionData, 
          collectionAddress: collectionData.address, 
          creatorLensAccount: creator 
        } as NFTCollection;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`Error processing NFT ${nft.token_id}: ${error.message}`);
        } else {
          console.error(`Error processing NFT ${nft.token_id}: ${error}`);
        }
        return null;
      }
    });

    const nfts = (await Promise.all(nftPromises)).filter(nft => nft !== null);
    console.log("owned nfts: ", nfts);
    return nfts;

  } catch (error) {
    console.error("Error in listNFTsOwnedBy:", error);
    throw error;
  }
}

export async function isNFTOwnedByAddress(address: string, nft: NFT, collectionAddress: string) {
  if (!address) {
    return false;
  }
  if(nft && nft.type === "ERC721") {
    const ownedNFTs = await getERC721OwnedByAddress(address); //nao pega se tiver listado em auction
    return ownedNFTs?.data.some((ownedNFT: { token_id: string; token_address: string; }) => ownedNFT.token_id === Number(nft.id).toString() && getAddress(ownedNFT.token_address) === getAddress(collectionAddress));
  }
  else if(nft && nft.type === "ERC1155") { //como 1155 são multieditions, um único id tem vários owners
    const ownedNFTs = await getERC1155OwnedByAddress(address);
    return ownedNFTs?.data.some((ownedNFT: { tokenId: string; tokenAddress: string; }) => ownedNFT.tokenId === nft.id.toString() && getAddress(ownedNFT.tokenAddress) === getAddress(collectionAddress)); 
  }
  return false;
}

export async function get721NFTOwner(nft: NFT, collectionAddress: string)
{
  //incluir dados de redes sociais (imagem, username, etc)
  const contract = getContract({
    chain: activeChain,
    address: collectionAddress,
    client: thirdwebClient,
  }); 

  if(nft && nft.type === "ERC721") {
    const owners = await getAllOwners({
      contract,
      start: Number(nft.id),
      count: Number(nft.id),
    });

    return owners[0];
  }
  else if(nft && nft.type === "ERC1155") { //como 1155 são multieditions, um único id tem vários owners
    
    return null;
  }
}

async function createMultieditionContract(account: any, name: string, description: string, symbol: string, image?: File) {
  const contractAddress = await deployERC1155Contract({
    chain: activeChain,
    client: thirdwebClient,
    account: account!,
    type: "TokenERC1155",
    params: {
      name: name,
      description: description,
      symbol: symbol,
      image: image, //todo: testar se passar uma URI funciona
      external_link: undefined,
      social_urls: undefined,
      contractURI: undefined,
      defaultAdmin: undefined,
      saleRecipient: undefined,
      platformFeeBps: undefined,
      platformFeeRecipient: undefined,
      royaltyRecipient: undefined,
      royaltyBps: undefined,
      trustedForwarders: undefined,
    }});
    
    console.log("contractAddress: ", contractAddress);

    const contract = getContract({
      chain: activeChain,
      address: contractAddress,
      client: thirdwebClient,
    });
    
    console.log("contract: ", contract);
    
      /*  const verificationResult = await verifyContract({
        contract,
        explorerApiUrl: lensTestnetBlockexplorerAPI,
        explorerApiKey: "",
        });
        console.log(verificationResult);
    */
        return contractAddress;
        
}

async function createSingleEditionContract(account: any, name: string, description: string, symbol: string, image?: File) {
  //todo: passar as fees
  const contractAddress = await deployERC721Contract({
    chain: activeChain,
    client: thirdwebClient,
    account: account!,
    type: "TokenERC721",
    params: {
      name: name,
      description: description,
      symbol: symbol,
      image: image, //todo: testar se passar uma URI funciona
      external_link: undefined,
      social_urls: undefined,
      contractURI: undefined,
      defaultAdmin: undefined,
      saleRecipient: undefined,
      platformFeeBps: undefined,
      platformFeeRecipient: undefined,
      royaltyRecipient: undefined,
      royaltyBps: undefined,
      trustedForwarders: undefined,
    }});
    
    console.log("contractAddress: ", contractAddress);

    const contract = getContract({
      chain: activeChain,
      address: contractAddress,
      client: thirdwebClient,
    });
    
    console.log("contract: ", contract);
    
      /*  const verificationResult = await verifyContract({
        contract,
        explorerApiUrl: lensTestnetBlockexplorerAPI,
        explorerApiKey: "",
        });
        console.log(verificationResult);
    */
        return contractAddress;
        
}

export async function listCreatedContractsByAddress(address: string): Promise<Collection[]> {
  const contracts = await listDeployedContractsByAddress(address);

  const contractDetails = await Promise.all(
    contracts.map(async (contract: { contractAddress: string }) => {
      const contractInstance = await getCurrentCollection({ contractAdd: contract.contractAddress });
      if (!contractInstance) {
        return null;
      }
      return contractInstance; 
    })
  );

  return contractDetails.filter(contract => contract !== null);
}

