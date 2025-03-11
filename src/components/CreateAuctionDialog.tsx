import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateAuctionButton } from "@/components/CreateAuctionButton";

type CreateAuctionDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  contractAddress: string;
  assetContract: string;
  tokenId: string;
};

export const CreateAuctionDialog: React.FC<CreateAuctionDialogProps> = ({
  isOpen,
  onClose,
  contractAddress,
  assetContract,
  tokenId,
}) => {
  const [auctionDetails, setAuctionDetails] = useState({
    startingBid: "",
    buyoutPrice: "",
    currency: "GHO",
    endTime: "",
  });

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Auction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <label className="block">Starting Bid</label>
          <input
            type="text"
            name="startingBid"
            placeholder="Enter starting bid"
            className="w-full p-2 border rounded"
            value={auctionDetails.startingBid}
            onChange={handleAuctionInputChange}
          />

          <label className="block">Buyout Price (Optional)</label>
          <input
            type="text"
            name="buyoutPrice"
            placeholder="Enter buyout price"
            className="w-full p-2 border rounded"
            value={auctionDetails.buyoutPrice}
            onChange={handleAuctionInputChange}
          />

          <label className="block">Currency</label>
          <select
            name="currency"
            className="w-full p-2 border rounded"
            value={auctionDetails.currency}
            onChange={handleAuctionInputChange}
          >
            <option value="ETH (soon)" disabled>ETH</option>
            <option value="GHO">GHO</option>
            <option value="BONSAI (soon)" disabled>BONSAI</option>
          </select>

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
          <Button variant="outline" onClick={onClose}>
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
  );
};
