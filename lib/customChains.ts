import { type Chain } from "viem";

export const lensTesnet: Chain = {
  id: 37111,
  name: "Lens Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Grass",
    symbol: "GRASS",
  },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.lens.dev"] },
  },
  blockExplorers: {
    default: { name: "Lens", url: "https://block-explorer.testnet.lens.dev/" }
  },
  testnet: true,
};

export const lensMainnet: Chain = {
  id: 232,
  name: "Lens Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "GHO",
    symbol: "GHO",
  },
  rpcUrls: {
    default: { http: ["https://rpc.lens.xyz"] },
  },
  blockExplorers: {
    default: { name: "Lens", url: "https://explorer.lens.xyz" }
  },
  testnet: false,
};
