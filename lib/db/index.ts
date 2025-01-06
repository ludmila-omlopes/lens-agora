import { sql, postgresConnectionString } from "@vercel/postgres";
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
  const response = await fetch("/api/addContractByAddress", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address: address,
      contractAddress: contractAddress,
      contractType: contractType,
    }),
  });

  const data = await response.json();
  if (response.ok) {
    console.log("Contract added:", data.message);
  } else {
    console.error("Error:", data.error);
  }
  return data;
};

/**
 * Retrieves all deployed contracts for a specific account.
 * @param address - The address of the account to fetch contracts for.
 * @returns An array of deployed contracts.
 */

export const listDeployedContractsByAddress = async (address: string): Promise<DeployedContract[]> => {
  try {
    const response = await fetch(`/api/listContractsByAddress?address=${address}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Contracts retrieved:", data.contracts);
      return data.contracts.map((contract: any) => ({
        address: contract.address,
        contractAddress: contract.contract_address,
        contractType: contract.contract_type,
        createdAt: contract.created_at,
      }));
    } else {
      console.error("Error:", data.error);
      return [];
    }
  } catch (error) {
    console.error("Error fetching deployed contracts:", error);
    return [];
  }
};