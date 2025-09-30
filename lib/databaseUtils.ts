import { DatabaseEnvironment, getCurrentEnvironment } from './database';

// Environment switching utilities
export class DatabaseManager {
  private currentEnvironment: DatabaseEnvironment;

  constructor(environment?: DatabaseEnvironment) {
    this.currentEnvironment = environment || getCurrentEnvironment();
  }

  // Set the current environment
  setEnvironment(environment: DatabaseEnvironment) {
    this.currentEnvironment = environment;
  }

  // Get the current environment
  getEnvironment(): DatabaseEnvironment {
    return this.currentEnvironment;
  }

  // Check if we're in testnet
  isTestnet(): boolean {
    return this.currentEnvironment === 'testnet';
  }

  // Check if we're in main
  isMain(): boolean {
    return this.currentEnvironment === 'main';
  }

  // Get the appropriate API base URL
  getApiBaseUrl(): string {
    if (this.isTestnet()) {
      return '/api/testnet';
    }
    return '/api';
  }

  // Get environment-specific endpoint
  getEndpoint(endpoint: string): string {
    return `${this.getApiBaseUrl()}/${endpoint}`;
  }
}

// Global database manager instance
export const dbManager = new DatabaseManager();

// Environment-specific database operations
export const testnetDb = new DatabaseManager('testnet');
export const mainDb = new DatabaseManager('main');

// Utility function to get environment from query parameters
export function getEnvironmentFromQuery(query: Record<string, any>): DatabaseEnvironment {
  return query.env === 'testnet' ? 'testnet' : 'main';
}

// Utility function to get environment from headers
export function getEnvironmentFromHeaders(headers: Headers): DatabaseEnvironment {
  const env = headers.get('x-database-environment');
  return env === 'testnet' ? 'testnet' : 'main';
}

// Environment configuration helper
export function getEnvironmentConfig() {
  return {
    main: {
      name: 'Main',
      color: 'green',
      apiBase: '/api',
    },
    testnet: {
      name: 'Testnet',
      color: 'orange',
      apiBase: '/api/testnet',
    },
  };
} 