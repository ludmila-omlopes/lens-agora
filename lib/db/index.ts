import { addContractAction, getContractsAction, addWaitlistAction } from "../actions";
import { DeployedContract } from "../types";

/**
 * Inserts a new deployed contract record into the database.
 * @param address - The address of the account deploying the contract.
 * @param contractAddress - The address of the deployed contract.
 * @param contractType - The type or category of the deployed contract.
 */
export const addDeployedContract = async (
  address: string,
  contractAddress: string,
  contractType: string
) => {
  const result = await addContractAction(address, contractAddress, contractType);
  
  if (result.success) {
    console.log("Contract added:", result.message);
  } else {
    console.error("Error:", result.error);
  }
  return result;
};

/**
 * Retrieves all deployed contracts for a specific account.
 * @param address - The address of the account to fetch contracts for.
 * @returns An array of deployed contracts.
 */
export const listDeployedContractsByAddress = async (address: string): Promise<DeployedContract[]> => {
  try {
    const result = await getContractsAction(address);
    
    if (result.success && result.contracts) {
      console.log("Contracts retrieved:", result.contracts);
      return result.contracts.map((contract: any) => ({
        id: contract.id || 0,
        address: contract.address,
        contractAddress: contract.contract_address,
        contractType: contract.contract_type,
        createdAt: contract.created_at,
      }));
    } else {
      console.error("Error:", result.error);
      return [];
    }
  } catch (error) {
    console.error("Error fetching deployed contracts:", error);
    return [];
  }
};

export const addWaitlist = async (
  lens_username: string,
  email: string,
  wallet_address: string
) => {
  const result = await addWaitlistAction(lens_username, email, wallet_address);
  
  if (result.success) {
    console.log("Waitlist added:", result.message);
  } else {
    console.error("Error:", result.error);
  }
  return result;
}