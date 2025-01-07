'use client'

import { useState } from 'react'
import { useTheme } from '@/app/contexts/ThemeContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import NewContractForm from './NewContractForm'
import { createNFTContract, mintNewNFT } from '../../lib/nfts'
import { useActiveAccount } from 'thirdweb/react'
import FileUpload from './FileUpload'

// Mock data for existing contracts
const existingContracts = [
  { id: '1', name: 'My First Collection' },
  { id: '2', name: 'Exclusive Art Series' },
  { id: '3', name: 'Limited Edition Collectibles' },
]

export default function CreateNFTProcess() {
  const { theme } = useTheme()
  const [step, setStep] = useState(1)
  const [contractChoice, setContractChoice] = useState<'new' | 'existing'>('new')
  const [selectedContract, setSelectedContract] = useState('')
  const [isContractSubmitted, setIsContractSubmitted] = useState(false)
  const [newContractAddress, setNewContractAddress] = useState<string | null>(null);
  const account = useActiveAccount();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast()
  const [nftDetails, setNftDetails] = useState({
    name: '',
    description: '',
    attributes: '',
    file: null as File | null,
  });

  const handleContractChoice = (value: 'new' | 'existing') => {
    setContractChoice(value)
    if (value === 'existing') {
      setSelectedContract(existingContracts[0].id)
    } else {
      setSelectedContract('')
    }
    setIsContractSubmitted(false)
  }

  const handleContractSubmit = async (contractAddress: string) => {
    setNewContractAddress(contractAddress);
    setIsContractSubmitted(true);

  }

  const handleNextStep = () => {
    if (contractChoice === 'new' && !isContractSubmitted) {
      toast({
        title: "Contract Not Submitted",
        description: "Please submit your contract before proceeding to mint NFTs.",
        variant: "destructive",
      })
      return
    }
    setStep(2)
  }

  const handleMintNFT = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      toast({
        title: 'Error',
        description: 'You must be connected to your wallet to mint an NFT.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try { //todo: colocar atributos
        console.log("new nft:", nftDetails)
 
        const contractAddress = contractChoice === 'new' ? newContractAddress : selectedContract;
        if (!contractAddress) {
          throw new Error('No contract address available for minting.');
        }
        console.log("this contract: ", contractAddress)
      const response = await mintNewNFT({
        contractAdd: contractAddress,
        name: nftDetails.name,
        quantity: 1n,
        description: nftDetails.description,
        mintToAdd: account.address,
        account: account,
        media: nftDetails.file!
      });
      toast({
        title: 'Success',
        description: `NFT minted successfully: ${response}`,
        variant: 'default',
      });
      setNftDetails({
        name: '',
        description: '',
        attributes: '',
        file: null,
      });
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast({
        title: 'Error',
        description: 'Failed to mint NFT.',
        variant: 'destructive',
      });
    } finally {
        setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNftDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file: File) => {
    setNftDetails((prev) => ({ ...prev, file }));
  };

  return (
    <Card className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
      <CardHeader>
        <CardTitle>
          {step === 1 ? 'Step 1: Choose Contract' : 'Step 2: NFT Details'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <div className="space-y-6">
            <RadioGroup defaultValue="new" onValueChange={(value) => handleContractChoice(value as 'new' | 'existing')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new">Deploy a new contract</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="existing" id="existing" />
                <Label htmlFor="existing">Choose an existing contract</Label>
              </div>
            </RadioGroup>

            {contractChoice === 'existing' && (
              <Select value={selectedContract} onValueChange={setSelectedContract}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a contract" />
                </SelectTrigger>
                <SelectContent>
                  {existingContracts.map((contract) => (
                    <SelectItem key={contract.id} value={contract.id}>
                      {contract.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {contractChoice === 'new' && (
              <NewContractForm
              onContractSubmit={handleContractSubmit} // Signal success
            />
            )}

            <Button onClick={handleNextStep} disabled={contractChoice === 'new' && !isContractSubmitted}>Next</Button>
          </div>
        ) : (
            <form onSubmit={handleMintNFT} className="space-y-6">
              <div>
                <Label htmlFor="name">NFT Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter NFT name"
                  value={nftDetails.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter NFT description"
                  value={nftDetails.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="attributes">Attributes (optional)</Label>
                <Textarea
                  id="attributes"
                  name="attributes"
                  placeholder="Enter attributes as key-value pairs, one per line"
                  value={nftDetails.attributes}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>Upload Image or Video</Label>
                <FileUpload onFileSelect={handleFileSelect} />
              </div>
              <Button type="submit">{loading ? 'Minting...Please Wait' : 'Mint NFT'}</Button>
            </form>
          )}
      </CardContent>
    </Card>
  )
}

