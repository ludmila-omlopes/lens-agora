'use client'

import { useEffect, useState } from 'react'
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
import { createNFTContract, getCurrentCollection, mintNewNFT } from '../../lib/nfts'
import { useActiveAccount } from 'thirdweb/react'
import FileUpload from './FileUpload'

//todo: no step 2, mostrar o nome da collection. Já tem o objeto pronto.
//todo: depois de mintar o NFT, mostrar alguma mensagem de sucesso e redirecionar a pagina

export default function CreateNFTProcess() {

  const { theme } = useTheme()
  const [step, setStep] = useState(1)
  const [contractChoice, setContractChoice] = useState<'new' | 'existing'>('new')
  const [selectedContract, setSelectedContract] = useState('')
  const [isContractSubmitted, setIsContractSubmitted] = useState(false)
  const [newContractAddress, setNewContractAddress] = useState<string | null>(null);
  const account = useActiveAccount();
  const [loading, setLoading] = useState(false);
  const [contractType, setContractType] = useState<string | null>(null);
  const { toast } = useToast()
  const [nftDetails, setNftDetails] = useState({
    name: '',
    description: '',
    attributes: '',
    file: null as File | null,
    supply: 1,
  });

  const [contracts, setContracts] = useState<any[]>([]);

  const handleContractChoice = (value: 'new' | 'existing') => {
    setContractChoice(value)
    if (value === 'existing') {
      setSelectedContract('')
    } else {
      setSelectedContract('')
    }
    setIsContractSubmitted(false)
  }

  const handleContractSubmit = async (contractAddress: string) => {
    setNewContractAddress(contractAddress);
    setIsContractSubmitted(true);

  }

  const handleNextStep = async () => {
    if (contractChoice === 'new' && !isContractSubmitted) {
      toast({
        title: 'Contract Not Submitted',
        description: 'Please submit your contract before proceeding to mint NFTs.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      const contractAddress = contractChoice === 'new' ? newContractAddress : selectedContract;
      if (!contractAddress) {
        throw new Error('No contract address available.');
      }

      // Query the contract type
      const collection = await getCurrentCollection({contractAdd: contractAddress});
      if (collection) {
        setContractType("1155");
        console.log('Contract type:', collection.is1155);
        setStep(2); // Proceed to Step 2
      } else {
        throw new Error('Failed to determine contract type.');
      }
    } catch (error) {
      console.error('Error fetching contract type:', error);
      toast({
        title: 'Error',
        description: 'Unable to determine contract type. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
      const response = await mintNewNFT({
        contractAdd: contractAddress,
        name: nftDetails.name,
        quantity: BigInt(nftDetails.supply),
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
        supply: 1
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

  
useEffect(() => {
    if (!account) return;

    const fetchContracts = async () => {
            const response = await fetch(`/api/listContractsByAddress?address=${account.address}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
    
            if (!response.ok) {
                console.error("Failed to fetch contracts:", response.statusText);
                return [];
            }
            console.log("response", response)
            return response.json();
        };

    const fetchAndSetContracts = async () => {
            const fetchedContracts = await fetchContracts();
            if(fetchedContracts){
                    setContracts(fetchedContracts.contracts);
                    console.log("contracts", fetchedContracts.contracts)
            }
    };

    fetchAndSetContracts();
}, [account]);

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
                  {contracts.map((contract) => (
                    <SelectItem key={contract.contract_address} value={contract.contract_address}> 
                      {contract.contract_address } {/* todo: colocar o nome do contrato no bd */}
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
              {/*<div>
                <Label htmlFor="attributes">Attributes (optional)</Label>
                <Textarea
                  id="attributes"
                  name="attributes"
                  placeholder="Enter attributes as key-value pairs, one per line"
                  value={nftDetails.attributes}
                  onChange={handleInputChange}
                />
              </div>*/}
              {contractType === '1155' && ( // Conditional rendering for ERC1155
                <div>
                    <Label htmlFor="supply">Supply</Label>
                    <Input
                    id="supply"
                    name="supply"
                    type="number"
                    min="1"
                    placeholder="Enter supply quantity"
                    value={nftDetails.supply || 1}
                    onChange={handleInputChange}
                    required
                    />
                </div>
                )}
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

