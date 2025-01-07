'use client'

import { PublicClient, testnet } from "@lens-protocol/client";

const storage = typeof window !== 'undefined' ? window.localStorage : undefined;

export const lensPublicClient = PublicClient.create({
  environment: testnet,
  storage: storage,
  origin: "https://myappdomain.xyz", // Ignored if running in a browser
});