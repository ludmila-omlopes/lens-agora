'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from '@/app/contexts/ThemeContext'
import FileUpload from './FileUpload'

//todo: colocar loading depois de submit
//colocar um feedback se deu certo ou erro
//verificar se account está conectada
//carregar os contratos

// Mock data for existing contracts
const existingContracts = [
  { id: '1', name: 'Cool Cats Collection', address: '0x1234...5678' },
  { id: '2', name: 'Bored Ape Yacht Club', address: '0x5678...9012' },
  { id: '3', name: 'Doodles', address: '0x9012...3456' },
]

export default function ExistingContractForm() {
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    contractAddress: '',
    tokenName: '',
    description: '',
    file: null as File | null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleContractSelect = (value: string) => {
    const selectedContract = existingContracts.find(contract => contract.id === value)
    if (selectedContract) {
      setFormData(prev => ({ ...prev, contractAddress: selectedContract.address }))
    }
  }

  const handleFileSelect = (file: File) => {
    console.log('Selected file:', file)
    setFormData(prev => ({ ...prev, file }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Minting NFT with existing contract:', formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="contractSelect">Select Existing Contract</Label>
        <Select onValueChange={handleContractSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select a contract" />
          </SelectTrigger>
          <SelectContent>
            {existingContracts.map(contract => (
              <SelectItem key={contract.id} value={contract.id}>
                {contract.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contractAddress">Contract Address</Label>
        <Input
          id="contractAddress"
          name="contractAddress"
          value={formData.contractAddress}
          onChange={handleChange}
          placeholder="0x..."
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tokenName">Token Name</Label>
        <Input
          id="tokenName"
          name="tokenName"
          value={formData.tokenName}
          onChange={handleChange}
          placeholder="My Awesome NFT"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your NFT..."
          required
          className="min-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <Label>Upload Image or Video</Label>
        <FileUpload onFileSelect={handleFileSelect} />
      </div>
      <Button type="submit" className="w-full text-lg py-6">Mint NFT</Button>
    </form>
  )
}

