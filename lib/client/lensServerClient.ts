import { PublicClient, testnet, mainnet } from "@lens-protocol/client";
import { USE_TESTNET } from "../lensNetwork";

const storage = typeof window !== 'undefined' ? window.localStorage : undefined;

export const lensServerClient = PublicClient.create({
  environment: USE_TESTNET ? testnet : mainnet,
  storage: storage,
  origin: "https://myappdomain.xyz",
  apiKey: process.env.LENS_API_KEY || "",
});
