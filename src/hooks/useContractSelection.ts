import { useState, useEffect } from "react";
import { listCreatedContractsByAddress } from "../../lib/nfts";
import { useAccount } from "wagmi";
import { Collection } from "../../lib/types";

export function useContractSelection() {
  const [contractChoice, setContractChoice] = useState<"new" | "existing">("new");
  const [selectedContract, setSelectedContract] = useState<Collection>();
  const [isContractSubmitted, setIsContractSubmitted] = useState(false);
  const [contracts, setContracts] = useState<Collection[]>([]);
  const [newContractAddress, setNewContractAddress] = useState<string | null>(null);
  const { address } = useAccount();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      if (!address) return;

      try {
        setLoading(true);
        const fetchedContracts = await listCreatedContractsByAddress(address);
        if (fetchedContracts) {
          setContracts(fetchedContracts);
        }
      } catch (error) {
        console.error("Error fetching contracts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [address]);

  const handleContractSubmit = (contractAddress: string) => {
    setNewContractAddress(contractAddress); 
    setIsContractSubmitted(true);
  };

  const handleSelectContract = (contractAddress: string) => { 
    setSelectedContract(contracts && contracts.find((contract) => contract.address === contractAddress));
  };

  return {
    contractChoice,
    selectedContract,
    isContractSubmitted,
    handleContractChoice: setContractChoice,
    handleContractSubmit,
    contracts,
    handleSelectContract,
    loading
  };
}
