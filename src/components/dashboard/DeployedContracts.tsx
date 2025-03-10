import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link";
import { listCreatedContractsByAddress, mintNewNFT } from "../../../lib/nfts";
import { Collection } from "../../../lib/types";
import { useAccount } from "wagmi";

export default function DeployedContracts() {
  const [deployedContracts, setDeployedContracts] = useState<Collection[]>([]);
  const [activeContract, setActiveContract] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
    quantity: 1n,
  });
  const activeAccount = useAccount();

  useEffect(() => {
    const fetchContracts = async () => {
      if (activeAccount && activeAccount.address) {
        const contracts = await listCreatedContractsByAddress(activeAccount.address);
        setDeployedContracts(contracts);
      }
    };
    fetchContracts();
  }, [activeAccount]);

  const openDialog = (contractAddress: string) => {
    setActiveContract(contractAddress);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setActiveContract(null);
    setIsDialogOpen(false);
    setFormData({ name: "", description: "", image: null, quantity: 1n });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const mintNFT = async () => {
    if (!activeContract) return;

    const { name, description, image, quantity } = formData;

    if (!name || !description || !image || quantity <= 0) {
      console.error("All fields are required and quantity must be greater than 0.");
      return;
    }

    try {
      console.log("Minting NFT with details:", { name, description, image, quantity, contract: activeContract });

      await mintNewNFT({
        contractAdd: activeContract,
        name,
        quantity,
        description,
        mintToAdd: activeAccount?.address!,
        account: activeAccount,
        media: image
      });

      closeDialog();
    } catch (error) {
      console.error("Failed to mint NFT:", error);
    }
  };

  return (
    <div className="space-y-6">
      {deployedContracts.map((contract) => (
        <Card key={contract.address}>
          <CardHeader>
            <CardTitle>{contract.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">Contract Address: {contract.address}</p>
            <p className="text-sm mb-2">Type: {contract.type}</p>
            <p className="text-sm mb-2">NFTs: {contract.name}</p>
            <p className="text-sm mb-2">Symbol: {contract.symbol}</p>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={() => openDialog(contract.address)}>
              Mint NFT
            </Button>
            <Link href={`/contract/${contract.address}`} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
              View Details
            </Link>
          </CardFooter>
        </Card>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mint New NFT</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="NFT Name"
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={handleInputChange}
            />
            <textarea
              name="description"
              placeholder="NFT Description"
              className="w-full p-2 border rounded"
              value={formData.description}
              onChange={handleInputChange}
            />
            <input
              type="file"
              name="image"
              className="w-full p-2 border rounded"
              accept="image/*"
              onChange={handleFileChange}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              className="w-full p-2 border rounded"
              value={formData.quantity.toString()}
              onChange={handleInputChange}
              min="1"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button variant="default" onClick={mintNFT}>
              Mint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
