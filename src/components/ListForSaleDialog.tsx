import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateDirectListingButton } from "thirdweb/react";
import { marketplaceContractAddress } from "../../lib/marketplacev3";
import { lensTestnetChain } from "../../lib/lensNetwork";
import { thirdwebClient } from "../../lib/client/thirdwebClient";
import { useRouter } from 'next/navigation';

type ListForSaleDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  assetContract: string;
  tokenId: string;
};

export const ListForSaleDialog: React.FC<ListForSaleDialogProps> = ({
  isOpen,
  onClose,
  assetContract,
  tokenId,
}) => {
  const [price, setPrice] = useState("");
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>List NFT for Sale</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <label className="block">Price</label>
          <input
            type="text"
            name="price"
            placeholder="Enter price"
            className="w-full p-2 border rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <CreateDirectListingButton
            contractAddress={marketplaceContractAddress}
            chain={lensTestnetChain}
            client={thirdwebClient}
            tokenId={BigInt(tokenId)}
            assetContractAddress={assetContract}
            pricePerToken={price}
            currencyContractAddress={undefined} // Set correct currency if needed
            quantity={1n}
            onError={(err) => alert(err.message)}
            onTransactionConfirmed={() => {
              alert('NFT Listed for Sale!');
              onClose();
              router.refresh();
            }}
          >
            Confirm Listing
          </CreateDirectListingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
