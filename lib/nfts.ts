import { getAddress, getContract, NFT, readContract, sendTransaction } from "thirdweb";
import { thirdwebClient, thirdwebClientServer } from "./client/thirdwebClient";
import { getNFT as getNFT1155, getNFTs as getNFTs1155, mintTo as mintERC1155to, lazyMint as lazyMintERC1155, setApprovalForAll } from "thirdweb/extensions/erc1155";
import { getNFT as getNFT721, getNFTs as getNFTs721, mintTo as mintERC721to, lazyMint as lazyMintERC721, approve, getAllOwners } from "thirdweb/extensions/erc721";
import { lensTestnetBlockexplorerAPI, lensTestnetChain } from "./lensNetwork";
import { deployERC1155Contract, deployERC721Contract } from "thirdweb/deploys";
import { verifyContract } from "thirdweb/contract";
import { isERC721 } from "thirdweb/extensions/erc721";
import { isERC1155 } from "thirdweb/extensions/erc1155";
import { setClaimConditions } from "thirdweb/extensions/erc721";
import { resolveScheme } from "thirdweb/storage";
import { Collection, NFTCollection } from "./types";
import { getCollectionMarketplaceInfo, marketplaceContractAddress } from "./marketplacev3";
import { getERC1155OwnedByAddress, getERC721OwnedByAddress } from "./thirdwebUtils";
import { addDeployedContract, listDeployedContractsByAddress } from "./db";
import { isNullish } from "@apollo/client/cache/inmemory/helpers";
import { immutable, StorageClient } from "@lens-chain/storage-client";
import { upload } from "thirdweb/storage";
import { list } from "postcss";
import { getLastLoggedAccountByWalletAddress } from "./lensProtocolUtils";

export async function getCurrentNFT({ contractAdd, tokenId }: { contractAdd: string, tokenId: bigint }) {
   const contract = getContract({
     client: thirdwebClientServer,
     chain: lensTestnetChain,
     address: contractAdd,
   });
   
   const issingleNFT = await isERC721({ contract });
   const ismultiNFT = await isERC1155({ contract });

   if (issingleNFT) {
     const nft = await getNFT721({
       contract,
       tokenId
     });

     return nft;
   }
   else if (ismultiNFT) {
     const nft = await getNFT1155({
       contract,
       tokenId
     });

     return nft;
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
  const contract = getContract({
    client: thirdwebClientServer,
    chain: lensTestnetChain,
    address: contractAdd,
  });

const [contractOwner, contractMetadataURI, isMultiNFT, marketplaceInfo] = await Promise.all([
  readContract({ contract, method: "function owner() view returns (address)", params: [] }),
  readContract({ contract, method: "function contractURI() view returns (string)", params: [] }),
  isERC1155({ contract }),
  getCollectionMarketplaceInfo(contractAdd)
]);

const metadataUrl = resolveScheme({ uri: contractMetadataURI!, client: thirdwebClientServer });
const metadata = await fetch(metadataUrl).then(res => res.json());

//getDefaultRoyaltyInfo
//getPlatformFeeInfo
//getRoyaltyInfoForToken

const contractName = metadata.name;
const contractSymbol = metadata.symbol;
const description = metadata.description;
const imageURI = metadata.image;
const imageURL = metadata.image && resolveScheme({uri: imageURI, client: thirdwebClientServer});
const socialLinks = metadata.links;  //todo: colocar isso na tela

// ✅ Fetch NFT list in parallel with metadata fetching
const itemsPromise = listNFTs({ contractAdd, start: 0, count: 10 }); //todo: pegar todos ou não?

// ✅ Await NFTs (previously executed in parallel)
const items = await itemsPromise;

//stats: { owners: 750, floorPrice: '0.5 ETH', volumeTraded: '1250 ETH' }

  const collection = {
    name: contractName,
    owner: contractOwner,
    address: contractAdd,
    description: description,
    imageUrl: imageURL,
    symbol: contractSymbol,
    is1155: isMultiNFT,
    items: items,
    totalItems: items ? items.length : 0,
    marketplaceInfo: marketplaceInfo
  } as Collection;

  return collection;
}

export async function listNFTs({ contractAdd, start, count }: { contractAdd: string, start: number, count: number }) {
  
  const contract = getContract({
    client: thirdwebClientServer,
    chain: lensTestnetChain,
    address: contractAdd,
  });

  const issingleNFT = await isERC721({ contract });
  const ismultiNFT = await isERC1155({ contract });

    if (issingleNFT) {
        const nft = await getNFTs721({
        contract,
        start,
        count
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
    lensTestnetChain.id
  );

  const contract = getContract({
        chain: lensTestnetChain,
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
        chain: lensTestnetChain,
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
  if (nft.metadata && nft.metadata.image) {
    return resolveScheme({ uri: nft.metadata.image, client: thirdwebClientServer });
  }
  return "/logo1.png";
}

export async function approveNFT(nft: NFT, nftcontract: string, account: any) {
  const contract = getContract({
    chain: lensTestnetChain,
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
  const erc1155 = await getERC1155OwnedByAddress(address);
  const erc721 = await getERC721OwnedByAddress(address);

  const ownedNFTs = [];
  if (erc1155 && erc1155.data) {
    ownedNFTs.push(...erc1155.data);
  }
  if (erc721 && erc721.data) {
    ownedNFTs.push(...erc721.data);
  }

  console.log("ownedNFTs: ", ownedNFTs);

  const nftPromises = ownedNFTs.map(async nft => { //vira  mexe muda os nomes desses parametros.
    const nftData = await getCurrentNFT({ contractAdd: nft.token_address, tokenId: BigInt(nft.token_id) });
    //ntData.owner tá vindo nulo
    const collectionData = await getCurrentCollection({ contractAdd: nft.token_address });
    let creator = null;
    if(collectionData && collectionData.owner && fetchCreatorsSocialAccounts) {
      creator = await getLastLoggedAccountByWalletAddress(collectionData.owner);
    }
    return { nft: nftData, collection: collectionData, collectionAddress: collectionData.address, creatorLensAccount: creator } as NFTCollection;
  });
  const nfts = await Promise.all(nftPromises);
  console.log("nfts: ", nfts);
  return nfts;
}

export async function isNFTOwnedByAddress(address: string, nft: NFT, collectionAddress: string) {
  if (!address) {
    return false;
  }
  if(nft && nft.type === "ERC721") {
    const ownedNFTs = await getERC721OwnedByAddress(address); //nao pega se tiver listado em auction
    return ownedNFTs.data.some((ownedNFT: { token_id: string; token_address: string; }) => ownedNFT.token_id === Number(nft.id).toString() && getAddress(ownedNFT.token_address) === getAddress(collectionAddress));
  }
  else if(nft && nft.type === "ERC1155") { //como 1155 são multieditions, um único id tem vários owners
    const ownedNFTs = await getERC1155OwnedByAddress(address);
    return ownedNFTs.data.some((ownedNFT: { tokenId: string; tokenAddress: string; }) => ownedNFT.tokenId === nft.id.toString() && getAddress(ownedNFT.tokenAddress) === getAddress(collectionAddress)); 
  }
  return false;
}

export async function get721NFTOwner(nft: NFT, collectionAddress: string)
{
  //incluir dados de redes sociais (imagem, username, etc)
  const contract = getContract({
    chain: lensTestnetChain,
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
    chain: lensTestnetChain,
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
      chain: lensTestnetChain,
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
    chain: lensTestnetChain,
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
      chain: lensTestnetChain,
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
      return contractInstance; 
    })
  );

  return contractDetails;
}

