'use client'

import { PublicClient, testnet, mainnet } from "@lens-protocol/client";
import { USE_TESTNET } from "../lensNetwork";

const storage = typeof window !== 'undefined' ? window.localStorage : undefined;

export const lensPublicClient = PublicClient.create({
  environment: USE_TESTNET ? testnet : mainnet,
  storage: storage,
  origin: "https://myappdomain.xyz", // Ignored if running in a browser
});

// Keep mainnet client for specific mainnet operations
export const lensPublicMainnetClient = PublicClient.create({
  environment: mainnet,
  storage: storage,
  origin: "https://myappdomain.xyz", // Ignored if running in a browser
});

