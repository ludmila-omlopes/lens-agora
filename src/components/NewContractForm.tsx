'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from '@/app/contexts/ThemeContext'
import FileUpload from './FileUpload'
import { createNFTContract } from '../../lib/nfts'
import { useAccount } from 'wagmi'

export default function NewContractForm({
  onContractSubmit,
}: {
  onContractSubmit: (contractAddress: string) => void
}) {
  const { theme } = useTheme()
  const account = useAccount()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    contractName: '',
    symbol: '',
    description: '',
    royalties: '',
    contractType: 'NFTCollection',
    editions: '',
    file: null as File | null,
    filePreview: null as string | null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileSelect = (file: File) => {
    setFormData((prev) => ({ ...prev, file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const contractAddress = await createNFTContract(
        account,
        formData.contractType,
        formData.contractName,
        formData.symbol,
        formData.description,
        formData.file!
      )

      if (contractAddress) {
        alert('Contract deployed: ' + contractAddress)
        onContractSubmit(contractAddress)
        setFormData({
          contractName: '',
          symbol: '',
          description: '',
          royalties: '',
          contractType: 'NFTCollection',
          editions: '',
          file: null,
          filePreview: null,
        })
      } else {
        console.error('Contract deployment failed')
      }
    } catch (error) {
      console.error('Error deploying contract:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-4 border-black rounded-lg p-6 space-y-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      <h3 className="text-xl font-black mb-2">New Contract Details</h3>

      <div className="space-y-2">
        <Label htmlFor="contractName" className="font-bold">
          Contract Name
        </Label>
        <Input
          id="contractName"
          name="contractName"
          value={formData.contractName}
          onChange={handleChange}
          placeholder="My NFT Collection"
          className="border-2 border-black font-bold bg-white"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="symbol" className="font-bold">
          Symbol
        </Label>
        <Input
          id="symbol"
          name="symbol"
          value={formData.symbol}
          onChange={handleChange}
          placeholder="MNFT"
          className="border-2 border-black font-bold bg-white"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-bold">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your NFT collection..."
          className="min-h-[100px] border-2 border-black font-bold bg-white"
          required
        />
      </div>

      <div className="space-y-2">
        <Label className="font-bold">Contract Type</Label>
        <RadioGroup
          defaultValue="NFTCollection"
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, contractType: value }))
          }
          className="space-y-2"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem
              value="NFTCollection"
              id="1/1"
              className="border-2 border-black"
            />
            <Label htmlFor="1/1" className="font-bold">
              1/1 (Single Edition)
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem
              value="Edition"
              id="multi"
              className="border-2 border-black"
            />
            <Label htmlFor="multi" className="font-bold">
              Multi-Edition
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label className="font-bold">Upload Contract Image or Video</Label>
        <FileUpload onFileSelect={handleFileSelect} />
      </div>

      <Button
        type="submit"
        disabled={!account || loading}
        className="w-full bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-black py-3 px-4 border-2 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200"
      >
        {loading ? 'Deploying... Please Wait' : 'Deploy Contract'}
      </Button>
    </form>
  )
}
