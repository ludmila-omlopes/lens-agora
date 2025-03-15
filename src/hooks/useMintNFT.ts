import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { mintNewNFT } from "../../lib/nfts"; // Ensure this function exists in your project
import { useActiveAccount } from "thirdweb/react";
import { useThirdwebWallet } from "./useThirdwebWallet";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

export function useMintNFT(selectedContract: string) {
  const [nftDetails, setNftDetails] = useState({
    name: "",
    description: "",
    file: null as File | null,
    supply: 1,
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  useThirdwebWallet();
  const account = useActiveAccount();
  const router = useRouter(); // ✅ Initialize Next.js router
  const [isPending, startTransition] = useTransition()


  // Handles input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNftDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handles file selection
  const handleFileSelect = (file: File) => {
    setNftDetails((prev) => ({ ...prev, file }));
  };

  // Handles minting process
  const mintNFT = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Minting NFT. Contract: ", selectedContract);
    if (!account || !account.address) {
        console.error("Error minting NFT: No account found");
      toast({
        title: "Error",
        description: "You must be connected to your wallet to mint an NFT.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedContract) {
        console.error("Error minting NFT: No contract selected");
      toast({
        title: "Error",
        description: "No contract selected.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await mintNewNFT({
        contractAdd: selectedContract,
        name: nftDetails.name,
        quantity: BigInt(nftDetails.supply),
        description: nftDetails.description,
        mintToAdd: account.address,
        account: account,
        media: nftDetails.file!,
      });

      console.log("NFT mint response:", response);

      startTransition(() => {
        router.push(`/items/${selectedContract}`);
      }
      );

      setNftDetails({ name: "", description: "", file: null, supply: 1 });
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast({
        title: "Error",
        description: "Failed to mint NFT.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    nftDetails,
    handleInputChange,
    handleFileSelect,
    mintNFT,
    loading,
    isPending
  };
}
