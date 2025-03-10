import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BuyDirectListingButton, useActiveAccount } from "thirdweb/react";
import { CreateAuctionButton } from "@/components/CreateAuctionButton";
import { cancelAuction, marketplaceContractAddress } from "../../../lib/marketplacev3";
import { lensTestnetChain } from "../../../lib/lensNetwork";
import { thirdwebClient } from "../../../lib/client/thirdwebClient";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MarketplaceInfo } from "../../../lib/types";
import { useAccount } from "wagmi";
import { useThirdwebWallet } from "@/hooks/useThirdwebWallet";

type NFTBuyActionsProps = {
  isOwner: boolean;
  marketplaceInfo: MarketplaceInfo;
  contractAddress: string;
  assetContract: string;
  tokenId: string;
};

export const NFTBuyActions: React.FC<NFTBuyActionsProps> = ({
  isOwner,
  marketplaceInfo,
  contractAddress,
  assetContract,
  tokenId,
}) => {
  useThirdwebWallet();
  const thirdwebAccount = useActiveAccount();
  
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [isAuctionDialogOpen, setIsAuctionDialogOpen] = useState(false);
  const { address: userAddress, isConnecting, isDisconnected, isConnected } = useAccount();

  const [auctionDetails, setAuctionDetails] = useState({
    startingBid: "",
    buyoutPrice: "",
    currency: undefined,
    endTime: "",
  });
  console.log("marketplaceInfo.listing: ", marketplaceInfo.listing)

  // Convert selected endTime to duration in seconds
  const calculateDuration = () => {
    if (!auctionDetails.endTime) return 0;
    const selectedDate = new Date(auctionDetails.endTime);
    const now = new Date();
    return Math.floor((selectedDate.getTime() - now.getTime()) / 1000);
  };

  const handleAuctionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAuctionDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelAuction = async () => {
    try {
      await cancelAuction(thirdwebAccount, marketplaceInfo.auction.id);
      alert("Auction cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling auction:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-4 mt-4">
      {/* List for Sale Button (Only for NFT Owners) */}
      {isOwner && (!marketplaceInfo || !marketplaceInfo.listing || (marketplaceInfo.listing && marketplaceInfo.listing.status === "CANCELLED")) && (
        <Button onClick={() => setIsSaleDialogOpen(true)} className="flex-1 bg-pink-500 hover:bg-pink-600">
          List for Sale
        </Button>
      )}

      {/* Cancel Listing Button (Only for NFT Owners) */}
      {marketplaceInfo && marketplaceInfo.listing && marketplaceInfo.listing.status !== "CANCELLED" && marketplaceInfo.listing.creatorAddress === userAddress && isConnected && (
        <Button onClick={() => console.log('Cancel listing logic')} className="flex-1 bg-pink-500 hover:bg-pink-600">
          Cancel Listing
        </Button>
      )}

      {/* Cancel Auction) */}
      {marketplaceInfo && marketplaceInfo.auction && marketplaceInfo.auction.status !== "CANCELLED" && marketplaceInfo.auction.creatorAddress === userAddress && isConnected && (
        <Button onClick={ handleCancelAuction } className="flex-1 bg-pink-500 hover:bg-pink-600">
          Cancel Auction
        </Button>
      )}

      {/* Buy NFT Button (Only for non-owners if listed) */}
      {marketplaceInfo && marketplaceInfo.listing?.status === 'ACTIVE' && marketplaceInfo.listing.creatorAddress != userAddress && (
        <BuyDirectListingButton
          contractAddress={marketplaceContractAddress}
          chain={lensTestnetChain}
          client={thirdwebClient}
          listingId={marketplaceInfo.listing.id}
          quantity={1n}
        >
          Buy NFT
        </BuyDirectListingButton>
      )}

      {/* ✅ Create Auction Button (Opens Dialog) */}
      {isOwner && (
        <Button onClick={() => setIsAuctionDialogOpen(true)} className="flex-1 bg-purple-500 hover:bg-purple-600">
          Create Auction
        </Button>
      )}

      {/* ✅ Auction Dialog */}
      <Dialog open={isAuctionDialogOpen} onOpenChange={setIsAuctionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Auction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Starting Bid Input */}
            <label className="block">Starting Bid</label>
            <input
              type="text"
              name="startingBid"
              placeholder="Enter starting bid"
              className="w-full p-2 border rounded"
              value={auctionDetails.startingBid}
              onChange={handleAuctionInputChange}
            />

            {/* Buyout Price Input */}
            <label className="block">Buyout Price (Optional)</label>
            <input
              type="text"
              name="buyoutPrice"
              placeholder="Enter buyout price"
              className="w-full p-2 border rounded"
              value={auctionDetails.buyoutPrice}
              onChange={handleAuctionInputChange}
            />

            {/* Currency Selector */}
            <label className="block">Currency</label>
            <select
              name="currency"
              className="w-full p-2 border rounded"
              value={auctionDetails.currency}
              onChange={handleAuctionInputChange}
            >
                <option value="ETH (soon)" disabled>ETH</option>
              <option value={undefined}>GHO</option>
              <option value="BONSAI (soon)" disabled>BONSAI</option>
            </select>

            {/* End Date (Final Date) */}
            <label className="block">Auction End Date</label>
            <input
              type="datetime-local"
              name="endTime"
              className="w-full p-2 border rounded"
              value={auctionDetails.endTime}
              onChange={handleAuctionInputChange}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAuctionDialogOpen(false)}>
              Cancel
            </Button>
            <CreateAuctionButton
              contractAddress={contractAddress}
              assetContract={assetContract}
              tokenId={tokenId}
              startingBid={auctionDetails.startingBid}
              buyoutPrice={auctionDetails.buyoutPrice || undefined}
              currency={auctionDetails.currency}
              duration={calculateDuration()} // Convert date to duration in seconds
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
