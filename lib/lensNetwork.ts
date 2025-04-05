import { defineChain } from 'thirdweb';

export const lensTestnetChain = defineChain({
  id:37111,
  rpc: "https://rpc.testnet.lens.dev",});

  export const lensTestnetBlockexplorerAPI = "https://block-explorer-api.staging.lens.dev/api"; 

  export const lensMainnetChain = defineChain({
    id: 232,
    rpc: "https://rpc.lens.xyz",
  });
    