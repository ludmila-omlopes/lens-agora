'use client'

import { PublicClient, testnet, mainnet } from "@lens-protocol/client";

const storage = typeof window !== 'undefined' ? window.localStorage : undefined;

export const lensPublicClient = PublicClient.create({
  environment: testnet,  //testnet or mainnet
  storage: storage,
  origin: "https://myappdomain.xyz", // Ignored if running in a browser
});

export const lensPublicMainnetClient = PublicClient.create({
  environment: mainnet,  //testnet or mainnet
  storage: storage,
  origin: "https://myappdomain.xyz", // Ignored if running in a browser
});