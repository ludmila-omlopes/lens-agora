'use client'

import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { lensMainnet, lensTesnet } from "../../lib/customChains";
import customtheme from "../../lib/agoratheme.json";
import CustomAvatar from "@/components/ConnectedCustomAvatar";
import { lensMainnetChain } from "../../lib/lensNetwork";

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [mainnet, lensTesnet, lensMainnet],
    transports: {
      [lensTesnet.id]: http(lensTesnet.rpcUrls.default.http[0]),
      [mainnet.id]: http(mainnet.rpcUrls.default.http[0]),
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

    // Required App Info
    appName: "Lens Agora",

    // Optional App Info
    appDescription: "Your Social Marketplace on Lens Chain",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider customTheme={customtheme} options={{
          embedGoogleFonts: true,
          customAvatar: CustomAvatar,
  }}>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};