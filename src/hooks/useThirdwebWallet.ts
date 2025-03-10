import { useEffect } from "react";
import { useSetActiveWallet } from "thirdweb/react";
import { createWalletAdapter } from "thirdweb/wallets";
import { createThirdwebClient, defineChain } from "thirdweb";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useWalletClient,
} from "wagmi";
import { viemAdapter } from "thirdweb/adapters/viem";
import { thirdwebClient } from "../../lib/client/thirdwebClient"; // Import Thirdweb client

export const useThirdwebWallet = () => {
  const { address, connector } = useAccount(); // Get Wagmi wallet info
  const setActiveWallet = useSetActiveWallet(); // Thirdweb function
  const { data: walletClient } = useWalletClient(); // Wagmi wallet client

  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();

  useEffect(() => {
    const setActive = async () => {
      if (!walletClient || !connector) return;

      // Adapt Wagmi wallet to Thirdweb format
      const adaptedAccount = viemAdapter.walletClient.fromViem({
        walletClient: walletClient as any, // Accounts for wagmi/viem version mismatches
      });

      const thirdwebWallet = createWalletAdapter({
        adaptedAccount,
        chain: defineChain(await walletClient.getChainId()), // Define correct chain
        client: thirdwebClient,
        onDisconnect: async () => {
          await disconnectAsync();
        },
        switchChain: async (chain) => {
          await switchChainAsync({ chainId: chain.id });
        },
      });

      setActiveWallet(thirdwebWallet);
    };

    setActive();
  }, [walletClient, connector, setActiveWallet, disconnectAsync, switchChainAsync]);
};
