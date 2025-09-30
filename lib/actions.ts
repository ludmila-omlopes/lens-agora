'use server';

import { addDeployedContract, getDeployedContractsByAddress, addWaitlistEntry, getWaitlistEntries, checkDatabaseConnection } from './database';
import { DatabaseEnvironment } from './database';

// Server action to add a deployed contract
export async function addContractAction(
  address: string,
  contractAddress: string,
  contractType: string,
  environment?: DatabaseEnvironment
) {
  try {
    // Create headers object for environment detection
    const headers = new Headers();
    if (environment) {
      headers.set('x-environment', environment);
    }

    const result = await addDeployedContract(address, contractAddress, contractType, headers);
    return result;
  } catch (error) {
    console.error('Server action error:', error);
    return {
      success: false,
      message: 'Failed to add contract',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Server action to get deployed contracts by address
export async function getContractsAction(
  address: string,
  environment?: DatabaseEnvironment
) {
  try {
    // Create headers object for environment detection
    const headers = new Headers();
    if (environment) {
      headers.set('x-environment', environment);
    }

    const result = await getDeployedContractsByAddress(address, headers);
    return result;
  } catch (error) {
    console.error('Server action error:', error);
    return {
      success: false,
      contracts: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Server action to add waitlist entry
export async function addWaitlistAction(
  lensUsername: string,
  email: string,
  walletAddress: string,
  environment?: DatabaseEnvironment
) {
  try {
    // Create headers object for environment detection
    const headers = new Headers();
    if (environment) {
      headers.set('x-environment', environment);
    }

    const result = await addWaitlistEntry(lensUsername, email, walletAddress, headers);
    return result;
  } catch (error) {
    console.error('Server action error:', error);
    return {
      success: false,
      message: 'Failed to add waitlist entry',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Server action to get waitlist entries
export async function getWaitlistAction(environment?: DatabaseEnvironment) {
  try {
    // Create headers object for environment detection
    const headers = new Headers();
    if (environment) {
      headers.set('x-environment', environment);
    }

    const result = await getWaitlistEntries(headers);
    return result;
  } catch (error) {
    console.error('Server action error:', error);
    return {
      success: false,
      entries: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Server action to check database health
export async function checkHealthAction(environment?: DatabaseEnvironment) {
  try {
    // Create headers object for environment detection
    const headers = new Headers();
    if (environment) {
      headers.set('x-environment', environment);
    }

    const result = await checkDatabaseConnection(headers);
    return result;
  } catch (error) {
    console.error('Server action error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: environment || 'unknown'
    };
  }
} 