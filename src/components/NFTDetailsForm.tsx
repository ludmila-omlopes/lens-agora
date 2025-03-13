import { useMintNFT } from "@/hooks/useMintNFT";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from './FileUpload';
import { Collection } from "../../lib/types";

interface NFTDetailsFormProps {
  selectedContract: Collection; 
}

export default function NFTDetailsForm({ selectedContract }: NFTDetailsFormProps) {
  const { nftDetails, handleInputChange, handleFileSelect, mintNFT, loading } = useMintNFT(selectedContract.address);

  return (
    <form onSubmit={mintNFT} className="space-y-6">
      <div>
        <Label htmlFor="name">NFT Name</Label>
        <Input id="name" name="name" value={nftDetails.name} onChange={handleInputChange} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={nftDetails.description} onChange={handleInputChange} required />
      </div>
      <div>
        <Label>Upload Image or Video</Label>
        <FileUpload onFileSelect={handleFileSelect} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Minting... Please Wait' : 'Mint NFT'}
      </Button>
    </form>
  );
}
