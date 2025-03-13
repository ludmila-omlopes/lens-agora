'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ContractSelection from './ContractSelection';
import NFTDetailsForm from './NFTDetailsForm';
import { useContractSelection } from '@/hooks/useContractSelection';
import { Button } from './ui/button';

export default function CreateNFTProcess() {
  const { contractChoice, selectedContract, contracts, isContractSubmitted, handleContractChoice, handleContractSubmit, handleSelectContract, loading } = useContractSelection();
  const [step, setStep] = useState(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{step === 1 ? 'Step 1: Choose Contract' : 'Step 2: NFT Details - ' + selectedContract?.name}</CardTitle>
      </CardHeader>
      <CardContent>
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
          <div>
          <Button variant="outline" onClick={() => {
              handleContractChoice("new"); 
              handleSelectContract("");
              setStep(1);
          }} className="mb-4">
            ← Back to Contract Selection
          </Button>

          {/* NFT Details Form */}
          <NFTDetailsForm selectedContract={selectedContract!} />
        </div>
        )}
      </CardContent>
    </Card>
  );
}
