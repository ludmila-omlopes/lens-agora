import { immutable, StorageClient } from '@lens-chain/storage-client';
import { defineChain } from 'thirdweb';

export const lensTestnetChain = defineChain({
  id:37111,
  rpc: "https://rpc.testnet.lens.dev",});

  export const lensTestnetBlockexplorerAPI = "https://block-explorer-api.staging.lens.dev/api"; 

  export const lensMainnetChain = defineChain({
    id: 232,
    rpc: "https://rpc.lens.xyz",
  });

  export async function uploadMediaToGrove(file: File) {
    if (!file) {
      throw new Error("File is required");
    }
    const storageClient = StorageClient.create();

    const acl = immutable(  //todo: pensar se precisa sempre ser immutable
      lensTestnetChain.id
    );

    const response = await storageClient.uploadFile(file, { acl });
    return response;

  }

  export async function uploadMetadataToGrove(metadata: any) {
    if (!metadata) {
      throw new Error("Metadata is required");
    }
    const storageClient = StorageClient.create();

    const acl = immutable( //todo: pensar se precisa sempre ser immutable
      lensTestnetChain.id
    );

    const response = await storageClient.uploadAsJson(metadata, { acl });
    return response;
  }
    