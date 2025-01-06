import { getDefaultProvider, Network } from "@lens-network/sdk/ethers";
import { ethers } from "ethers";

// Lens Network (L2)
export const lensProvider = getDefaultProvider(Network.Testnet);

// Ethereum L1
export const ethProvider = ethers.getDefaultProvider("sepolia");