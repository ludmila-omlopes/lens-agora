import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContractSelection } from "@/hooks/useContractSelection";
import NewContractForm from "./NewContractForm";
import { Dispatch, SetStateAction } from "react";

interface ContractSelectionProps {
  contractChoice: "new" | "existing";
  selectedContract: string;
  contracts: { name: string; address: string }[];
  handleContractChoice: Dispatch<SetStateAction<"new" | "existing">>;
  handleContractSubmit: (contractAddress: string) => void;
  handleSelectContract: (contractAddress: string) => void;
  onNextStep: () => void;
  loading: boolean;
}

export default function ContractSelection({
  contractChoice,
  selectedContract,
  handleSelectContract,
  handleContractChoice,
  handleContractSubmit,
  onNextStep,
  contracts,
  loading,
}: ContractSelectionProps) {
  return (
    <div className="bg-gradient-to-br from-[#F7B5DE] to-[#F29BD4] rounded-lg border-4 border-black p-6 space-y-6">
      <h2 className="text-xl font-black mb-2">Select Contract</h2>

      <RadioGroup
        defaultValue="new"
        onValueChange={(value) =>
          handleContractChoice(value as "new" | "existing")
        }
        className="space-y-3"
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem
            value="new"
            id="new"
            className="border-2 border-black"
          />
          <Label htmlFor="new" className="font-bold">
            Deploy a new contract
          </Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem
            value="existing"
            id="existing"
            className="border-2 border-black"
          />
          <Label htmlFor="existing" className="font-bold">
            Choose an existing contract
          </Label>
        </div>
      </RadioGroup>

      {contractChoice === "existing" && (
        <Select value={selectedContract} onValueChange={handleSelectContract}>
          <SelectTrigger className="border-2 border-black font-bold bg-white">
            <SelectValue placeholder="Select a contract" />
          </SelectTrigger>
          <SelectContent className="border-2 border-black">
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

      {contractChoice === "new" && (
        <div className="">
          <NewContractForm onContractSubmit={handleContractSubmit} />
        </div>
      )}

      <Button
        onClick={onNextStep}
        disabled={contractChoice === "new"}
        className="bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-black py-3 px-4 border-2 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200"
      >
        Next
      </Button>
    </div>
  );
}
