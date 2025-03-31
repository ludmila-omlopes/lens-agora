import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BuyDirectListingButton, TransactionButton, useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { bidInAuction, cancelAuction, cancelListing, makeOffer, marketplaceContractAddress } from "../../../lib/marketplacev3";
import { lensTestnetChain } from "../../../lib/lensNetwork";
import { thirdwebClient } from "../../../lib/client/thirdwebClient";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MarketplaceInfo } from "../../../lib/types";
import { useAccount } from "wagmi";
import { useThirdwebWallet } from "@/hooks/useThirdwebWallet";
import { ListForSaleDialog } from "../ListForSaleDialog";
import { CreateAuctionDialog } from "../CreateAuctionDialog";
import { useRouter } from "next/navigation";
import { allowance, approve, getApprovalForTransaction } from "thirdweb/extensions/erc20";
import { MakeOfferButton } from "./NFTMakeOfferButton";
import { getContract, PreparedTransaction } from "thirdweb";

export const NFTBuyActions: React.FC<{
  isOwner: boolean;
  marketplaceInfo: MarketplaceInfo;
  contractAddress: string;
  assetContract: string;
  tokenId: string;
}> = ({ isOwner, marketplaceInfo, contractAddress, assetContract, tokenId }) => {
  useThirdwebWallet();
  const thirdwebAccount = useActiveAccount();
  const router = useRouter();
  const { address: userAddress, isConnected } = useAccount();

  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [isAuctionDialogOpen, setIsAuctionDialogOpen] = useState(false);
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [offerDetails, setOfferDetails] = useState({
    amount: "",
    expiration: "",
  });

  const { mutateAsync } = useSendAndConfirmTransaction();

  const handleCancelAuction = async () => {
    try {
      await cancelAuction(thirdwebAccount, marketplaceInfo.auction.id);
      alert("Auction cancelled successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error cancelling auction:", error);
    }
  };

  const handleCancelListing = async () => {
    try {
      await cancelListing(thirdwebAccount, marketplaceInfo.listing.id);
      alert("Listing cancelled successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error cancelling listing:", error);
    }
  };

  const handleBidSubmit = async () => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    try {
      await bidInAuction(thirdwebAccount, marketplaceInfo.auction.id, bidAmount);
      alert("Bid placed successfully!");
    } catch (error) {
      console.error("Error placing bid:", error);
    }
    setIsBidDialogOpen(false);
  };

  const handleMakeOffer = async () => {
      const tx = await makeOffer(thirdwebAccount, marketplaceInfo.collection.address, marketplaceInfo.nft.id, offerDetails.amount, new Date(offerDetails.expiration));
      
     //const approveTx = await getApprovalForTransaction({ transaction: tx, account: thirdwebAccount! });
      //console.log("approveTx: ", approveTx);
      return tx;
  };

  return (
    <div>
      {isOwner && (!marketplaceInfo || !marketplaceInfo.listing || marketplaceInfo.listing?.status === "CANCELLED") && (!marketplaceInfo.auction || marketplaceInfo.auction.status === "CANCELLED") && (
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setIsSaleDialogOpen(true)} className="bg-gradient-to-r from-[#8EF5F5] to-[#7EF2F2] text-black font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none">
            LIST FOR SALE
          </button>
          <button onClick={() => setIsAuctionDialogOpen(true)} className="bg-gradient-to-r from-[#8EF5F5] to-[#7EF2F2] text-black font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none">
            CREATE AUCTION
        </button>
        </div>
      )}

      {marketplaceInfo?.listing?.status !== "CANCELLED" && marketplaceInfo.listing?.creatorAddress === userAddress && isConnected && (
        <button onClick={handleCancelListing} className="flex-1 bg-pink-500 hover:bg-pink-600">
          CANCEL LISTING
        </button>
      )}

      {marketplaceInfo?.auction?.status !== "CANCELLED" && marketplaceInfo.auction?.creatorAddress === userAddress && isConnected && (
        <button onClick={handleCancelAuction} className="w-full bg-gradient-to-r from-[#8EF5F5] to-[#7EF2F2] text-black font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none">
          CANCEL AUCTION
        </button>
      )}

      {marketplaceInfo?.listing?.status === "ACTIVE" && marketplaceInfo.listing?.creatorAddress !== userAddress && (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setIsOfferDialogOpen(true)}
            className="bg-white text-black font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
          >
            MAKE OFFER
          </button>
          <BuyDirectListingButton
            contractAddress={marketplaceContractAddress}
            chain={lensTestnetChain}
            client={thirdwebClient}
            listingId={marketplaceInfo.listing.id}
            quantity={1n}
            unstyled
            className="bg-gradient-to-r from-[#8EF5F5] to-[#7EF2F2] text-black font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
          >
            BUY NOW
          </BuyDirectListingButton>
        </div>
      )}



      {!isOwner && marketplaceInfo?.auction?.status === "ACTIVE" && (
        <div className="grid grid-cols-1 gap-4">
          <button onClick={() => setIsBidDialogOpen(true)} className="bg-gradient-to-r from-[#8EF5F5] to-[#7EF2F2] text-black font-black py-3 px-4 rounded-md border-2 border-black">
            BID IN AUCTION
          </button>
        </div>
      )}

      <ListForSaleDialog isOpen={isSaleDialogOpen} onClose={() => setIsSaleDialogOpen(false)} assetContract={assetContract} tokenId={tokenId} />
      <CreateAuctionDialog isOpen={isAuctionDialogOpen} onClose={() => setIsAuctionDialogOpen(false)} contractAddress={contractAddress} assetContract={assetContract} tokenId={tokenId} />

      {/* Bid Dialog */}
      <Dialog open={isBidDialogOpen} onOpenChange={setIsBidDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place Your Bid</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block">Bid Amount</label>
            <input
              type="number"
              name="bidAmount"
              placeholder="Enter your bid"
              className="w-full p-2 border rounded"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              min="0.01"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBidDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBidSubmit} className="bg-purple-500 hover:bg-purple-600 text-white">
              Place Bid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Offer Dialog */}
      <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make an Offer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block">Offer Amount (in GHO)</label>
            <input
              type="number"
              name="amount"
              placeholder="Enter your offer"
              className="w-full p-2 border rounded"
              value={offerDetails.amount}
              onChange={(e) => setOfferDetails({ ...offerDetails, amount: e.target.value })}
              min="0.01"
            />
            <label className="block">Expiration Date</label>
            <input
              type="datetime-local"
              name="expiration"
              className="w-full p-2 border rounded"
              value={offerDetails.expiration}
              onChange={(e) => setOfferDetails({ ...offerDetails, expiration: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOfferDialogOpen(false)}>
              Cancel
            </Button>
            <TransactionButton
            className="bg-purple-500 hover:bg-purple-600 text-white"
            payModal={false}
            transaction={() => makeOffer(thirdwebAccount, marketplaceInfo.collection.address, marketplaceInfo.nft.id, offerDetails.amount, new Date(offerDetails.expiration))}
            onTransactionSent={() => {
              alert("Offer made successfully!");
              setIsOfferDialogOpen(false);
            }}
            onTransactionConfirmed={() => {
              alert("Offer confirmed successfully!");
              setIsOfferDialogOpen(false);
            }}
            onError={(error) => {
              console.error("Error making offer:", error);
              alert("Error making offer. Please try again.");
            }}
            >
              MAKE OFFER
            </TransactionButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
