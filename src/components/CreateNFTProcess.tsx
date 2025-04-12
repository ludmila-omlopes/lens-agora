'use client'

import { useState } from 'react'
import ContractSelection from './ContractSelection'
import NFTDetailsForm from './NFTDetailsForm'
import { useContractSelection } from '@/hooks/useContractSelection'
import { Button } from './ui/button'

export default function CreateNFTProcess() {
  const {
    contractChoice,
    selectedContract,
    contracts,
    isContractSubmitted,
    handleContractChoice,
    handleContractSubmit,
    handleSelectContract,
    loading,
  } = useContractSelection()

  const [step, setStep] = useState(1)

  return (
    <div className="bg-gradient-to-br from-[#E0FAFA] to-white rounded-lg border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-black">
        {step === 1
          ? 'Step 1: Choose Contract'
          : `Step 2: NFT Details – ${selectedContract?.name || 'Selected Contract'}`}
      </h2>

      {step === 1 ? (
        <ContractSelection
          contractChoice={contractChoice}
          selectedContract={selectedContract?.address!}
          handleContractChoice={handleContractChoice}
          handleContractSubmit={handleContractSubmit}
          onNextStep={() => setStep(2)}
          contracts={contracts}
          handleSelectContract={handleSelectContract}
          loading={loading}
        />
      ) : (
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => {
              handleContractChoice('new')
              handleSelectContract('')
              setStep(1)
            }}
            className="border-2 border-black font-bold bg-white hover:bg-gray-100"
          >
            ← Back to Contract Selection
          </Button>

          <NFTDetailsForm selectedContract={selectedContract!} />
        </div>
      )}
    </div>
  )
}
