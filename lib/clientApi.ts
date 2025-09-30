'use client';

import { addContractAction, getContractsAction, addWaitlistAction, getWaitlistAction, checkHealthAction } from './actions';
import { DatabaseEnvironment } from './database';

// Client-safe API wrapper using server actions
export class ClientApi {
  private environment: DatabaseEnvironment;

  constructor(environment: DatabaseEnvironment = 'main') {
    this.environment = environment;
  }

  // Set the environment for API calls
  setEnvironment(environment: DatabaseEnvironment) {
    this.environment = environment;
  }

  // Get the current environment
  getEnvironment(): DatabaseEnvironment {
    return this.environment;
  }

  // Add a deployed contract
  async addDeployedContract(address: string, contractAddress: string, contractType: string) {
    return addContractAction(address, contractAddress, contractType, this.environment);
  }

  // Get deployed contracts by address
  async getDeployedContractsByAddress(address: string) {
    return getContractsAction(address, this.environment);
  }

  // Add a waitlist entry
  async addWaitlistEntry(lensUsername: string, email: string, walletAddress: string) {
    return addWaitlistAction(lensUsername, email, walletAddress, this.environment);
  }

  // Get waitlist entries
  async getWaitlistEntries() {
    return getWaitlistAction(this.environment);
  }

  // Check database health
  async checkHealth() {
    return checkHealthAction(this.environment);
  }
}

// Create a default client API instance
export const clientApi = new ClientApi();

// Convenience functions for quick API calls
export const addDeployedContract = (address: string, contractAddress: string, contractType: string, environment?: DatabaseEnvironment) => {
  if (environment) {
    clientApi.setEnvironment(environment);
  }
  return clientApi.addDeployedContract(address, contractAddress, contractType);
};

export const getDeployedContractsByAddress = (address: string, environment?: DatabaseEnvironment) => {
  if (environment) {
    clientApi.setEnvironment(environment);
  }
  return clientApi.getDeployedContractsByAddress(address);
};

export const addWaitlistEntry = (lensUsername: string, email: string, walletAddress: string, environment?: DatabaseEnvironment) => {
  if (environment) {
    clientApi.setEnvironment(environment);
  }
  return clientApi.addWaitlistEntry(lensUsername, email, walletAddress);
};

export const getWaitlistEntries = (environment?: DatabaseEnvironment) => {
  if (environment) {
    clientApi.setEnvironment(environment);
  }
  return clientApi.getWaitlistEntries();
};

export const checkHealth = (environment?: DatabaseEnvironment) => {
  if (environment) {
    clientApi.setEnvironment(environment);
  }
  return clientApi.checkHealth();
}; 