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
import { useActiveAccount } from 'thirdweb/react'

//verificar se account está conectada
//tratar erro de salvar no banco de dados

export default function NewContractForm({ onContractSubmit }: { onContractSubmit: (contractAddress: string) => void }) {
    const { theme } = useTheme()
    const account = useActiveAccount();
    const [loading, setLoading] = useState(false); 
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
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileSelect = (file: File) => {
        setFormData(prev => ({ ...prev, file }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true);
        console.log('Deploying new contract:', formData);
        try {
            const contractAddress = await createNFTContract(account, formData.contractType, formData.contractName,
                formData.symbol, formData.description, formData.file!)
            if (contractAddress) {
                console.log('Contract deployed successfully: ', contractAddress)
                alert('Contract deployed successfully: ' + contractAddress)
                onContractSubmit(contractAddress); // Signal success to parent
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
                console.error('Contract deployment failed:')
            }
        } catch (error) {
            console.error('Error deploying contract:', error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="contractName">Contract Name</Label>
                <Input
                    id="contractName"
                    name="contractName"
                    value={formData.contractName}
                    onChange={handleChange}
                    placeholder="My NFT Collection"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                    id="symbol"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleChange}
                    placeholder="MNFT"
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
                    placeholder="Describe your NFT collection..."
                    required
                    className="min-h-[100px]"
                />
            </div>
           {/*  <div className="space-y-2">
                <Label htmlFor="royalties">Royalties (%)</Label>
                <Input
                    id="royalties"
                    name="royalties"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.royalties}
                    onChange={handleChange}
                    placeholder="5"
                    required
                />
            </div>*/}
            <div className="space-y-2">
                <Label>Contract Type</Label>
                <RadioGroup 
                    defaultValue="NFTCollection" 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, contractType: value }))}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="NFTCollection" id="1/1" />
                        <Label htmlFor="1/1">1/1 (Single Edition)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Edition" id="multi" />
                        <Label htmlFor="multi">Multi-Edition</Label>
                    </div>
                </RadioGroup>
            </div>
            <div className="space-y-2">
                <Label>Upload Contract Image or Video</Label>
                <FileUpload onFileSelect={handleFileSelect} />
            </div>
            <Button type="submit" disabled={!account || loading} className="w-full text-lg py-6">{loading ? 'Deploying...Please Wait' : 'Deploy Contract'}</Button>
        </form>
    )
}
