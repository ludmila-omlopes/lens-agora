"use client";

import { createAuction } from "thirdweb/extensions/marketplace";
import { sendTransaction } from "thirdweb";
import { TransactionButton, useActiveWallet } from "thirdweb/react";
import { useAccount } from "wagmi";
import { useState } from "react";
import { useThirdwebWallet } from "@/hooks/useThirdwebWallet";
import { contract as marketplaceContract } from "../../lib/marketplacev3";

type CreateAuctionProps = {
  contractAddress: string; // Marketplace contract address
  assetContract: string; // NFT contract address
  tokenId: string; // NFT Token ID
  startingBid: string; // Minimum bid amount
  buyoutPrice?: string; // Optional buyout price
  currency?: string; // Currency (e.g., ETH or ERC20 address)
  duration: number; // Duration in seconds
  className?: string; // For custom styling
  startTimestamp?: Date; // Optional start time
  endTimestamp?: Date; // Optional end time
};

export const CreateAuctionButton: React.FC<CreateAuctionProps> = ({
  contractAddress,
  assetContract,
  tokenId,
  startingBid,
  buyoutPrice,
  currency,
  startTimestamp,
  endTimestamp,
  className = "",
}) => {
  useThirdwebWallet(); // Converts Wagmi wallet for Thirdweb use
  const wallet = useActiveWallet();
  const account = wallet?.getAccount();
  const [isLoading, setIsLoading] = useState(false);

  if (!account) {
    return <p className="text-red-500">Connect your wallet first.</p>;
  }

  // Create the auction transaction
  const transaction = createAuction({
    contract: marketplaceContract,
    //currencyContractAddress: currency, //token usado na negociação
    assetContractAddress: assetContract, //endreço do contrato do NFT
    tokenId: BigInt(tokenId),
    minimumBidAmount: startingBid,
    timeBufferInSeconds: 60, // extendendo o tempo de leilão
    startTimestamp,
    endTimestamp,
    buyoutBidAmount: buyoutPrice ? buyoutPrice : "0", // Optional buyout price, that immediately ends the auction
  });
  //console.log("currencyContractAddress:", currency);
  console.log("assetContractAddress:", assetContract);
  console.log("tokenId:", tokenId);
  console.log("minimumBidAmount:", startingBid);
  console.log("account:", account); 
  

  return (
    <TransactionButton
      transaction={() => sendTransaction({ transaction, account })}
      onTransactionSent={() => setIsLoading(true)}
      onTransactionConfirmed={(tx) => {
        setIsLoading(false);
        alert("Auction created successfully!");
        console.log("Transaction details:", tx);
      }}
      onError={(err) => {
        setIsLoading(false);
        alert(`Error: ${err.message}`);
      }}
      className={`bg-retroPrimary text-retroText shadow-retro border-2 border-retroBorder px-4 py-2 rounded-retro hover:bg-retroHover transition-all ${className}`}
    >
      {isLoading ? "Creating Auction..." : "Confirm"}
    </TransactionButton>
  );
};
