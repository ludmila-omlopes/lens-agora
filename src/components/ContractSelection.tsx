import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContractSelection } from "@/hooks/useContractSelection";
import NewContractForm from "./NewContractForm";
import { Dispatch, SetStateAction } from "react";

interface ContractSelectionProps {
    contractChoice: 'new' | 'existing';
    selectedContract: string;
    contracts: { name: string; address: string }[];
    handleContractChoice: Dispatch<SetStateAction<'new' | 'existing'>>;
    handleContractSubmit: (contractAddress: string) => void;
    handleSelectContract: (contractAddress: string) => void; 
    onNextStep: () => void;
    loading: boolean; 
  }

export default function ContractSelection({ contractChoice, 
    selectedContract, 
    handleSelectContract, 
    handleContractChoice, 
    handleContractSubmit, 
    onNextStep,
    contracts,
    loading  }: ContractSelectionProps) {

  return (
    <div className="space-y-6">
      <RadioGroup defaultValue="new" onValueChange={(value) => handleContractChoice(value as "new" | "existing")}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="new" id="new" />
          <Label htmlFor="new">Deploy a new contract</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="existing" id="existing" />
          <Label htmlFor="existing">Choose an existing contract</Label>
        </div>
      </RadioGroup>

      {contractChoice === "existing" && (
        <Select value={selectedContract} onValueChange={handleSelectContract}>
          <SelectTrigger>
            <SelectValue placeholder="Select a contract" />
          </SelectTrigger>
          <SelectContent>
            {loading ? (
              <SelectItem disabled value="none">
                Loading contracts...
              </SelectItem>
            ) : (
              contracts.map((contract) => (
                <SelectItem key={contract.address} value={contract.address}>
                  {contract.name}: {contract.address}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )}

      {contractChoice === "new" && <NewContractForm onContractSubmit={handleContractSubmit} />}

      <Button onClick={onNextStep} disabled={contractChoice === "new" //&& !isContractSubmitted

      }>
        Next
      </Button>
    </div>
  );
}
