import { createPool, createClient, sql } from "@vercel/postgres";

// Environment configuration
export type DatabaseEnvironment = 'main' | 'testnet';

// Get the current environment from environment variables or headers
export function getCurrentEnvironment(headers?: Headers): DatabaseEnvironment {
  // Debug logging
  console.log('🔍 Environment Detection Debug:');
  console.log('- NEXT_PUBLIC_DATABASE_ENVIRONMENT:', process.env.NEXT_PUBLIC_DATABASE_ENVIRONMENT);
  console.log('- Headers provided:', !!headers);
  
  // First, check if environment is specified in headers (for API requests)
  if (headers) {
    const headerEnv = headers.get('x-environment') as DatabaseEnvironment;
    console.log('- x-environment header:', headerEnv);
    if (headerEnv && (headerEnv === 'main' || headerEnv === 'testnet')) {
      console.log('✅ Using environment from header:', headerEnv);
      return headerEnv;
    }
  }
  
  // Fallback to public environment variable
  const envVar = process.env.NEXT_PUBLIC_DATABASE_ENVIRONMENT as DatabaseEnvironment;
  console.log('✅ Using environment from env var:', envVar || 'main (default)');
  return envVar || 'main';
}

// Database connection configuration
const databaseConfig = {
  main: {
    url: process.env.DATABASE_URL_MAIN || process.env.DATABASE_URL,
  },
  testnet: {
    url: process.env.DATABASE_URL_TESTNET,
  },
};

// Create SQL client for current environment
export function createSqlClient(headers?: Headers) {
  const currentEnv = getCurrentEnvironment(headers)
  const config = databaseConfig[currentEnv]

  console.log('🔧 Database Config Debug:')
  console.log('- Current environment:', currentEnv)
  console.log('- Config URL exists:', !!config?.url)
  console.log('- Config URL:', config?.url)

  if (!config?.url) {
    throw new Error(`Database URL not configured for environment: ${currentEnv}`)
  }

  // Create a new client and connect
  const pool = createPool({ connectionString: config.url });
  return pool
}

// Types for database operations
export interface DeployedContract {
  id?: number;
  address: string;
  contract_address: string;
  contract_type: string;
  created_at?: Date;
}

export interface WaitlistEntry {
  id?: number;
  lens_username: string;
  email: string;
  wallet_address: string;
  timestamp?: Date;
}

// Contract operations - automatically use current environment
export async function addDeployedContract(
  address: string,
  contractAddress: string,
  contractType: string,
  headers?: Headers
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const currentEnv = getCurrentEnvironment(headers);
    const sqlClient = createSqlClient(headers);
    
    await sqlClient.sql`
      INSERT INTO contracts_deployed_by_address (address, contract_address, contract_type)
      VALUES (${address}, ${contractAddress}, ${contractType})
    `;
    return { success: true, message: `Contract added successfully to ${currentEnv}` };
  } catch (error) {
    console.error("Error adding deployed contract:", error);
    return { 
      success: false, 
      message: 'Failed to add contract',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function getDeployedContractsByAddress(
  address: string,
  headers?: Headers
): Promise<{ success: boolean; contracts?: DeployedContract[]; error?: string }> {
  try {
    const currentEnv = getCurrentEnvironment(headers);
    const sqlClient = createSqlClient(headers);
    
    console.log('📖 Fetching contracts from environment:', currentEnv);
    
    const { rows } = await sqlClient.sql`
      SELECT address, contract_address, contract_type, created_at
      FROM contracts_deployed_by_address
      WHERE address = ${address}
      ORDER BY created_at DESC
    `;
    return { success: true, contracts: rows as DeployedContract[] };
  } catch (error) {
    console.error("Error fetching deployed contracts:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Waitlist operations - automatically use current environment
export async function addWaitlistEntry(
  lensUsername: string,
  email: string,
  walletAddress: string,
  headers?: Headers
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const currentEnv = getCurrentEnvironment(headers);
    const sqlClient = createSqlClient(headers);
    
    console.log('📝 Adding waitlist entry to environment:', currentEnv);
    
    await sqlClient.sql`
      INSERT INTO lensagora_waitlist (lens_username, email, wallet_address, timestamp)
      VALUES (${lensUsername}, ${email}, ${walletAddress}, NOW())
    `;
    return { success: true, message: `Waitlist entry added successfully to ${currentEnv}` };
  } catch (error) {
    console.error("Error adding waitlist entry:", error);
    return { 
      success: false, 
      message: 'Failed to add waitlist entry',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function getWaitlistEntries(headers?: Headers): Promise<{ success: boolean; entries?: WaitlistEntry[]; error?: string }> {
  try {
    const currentEnv = getCurrentEnvironment(headers);
    const sqlClient = createSqlClient(headers);
    
    console.log('📖 Fetching waitlist entries from environment:', currentEnv);
    
    const { rows } = await sqlClient.sql`
      SELECT lens_username, email, wallet_address, timestamp
      FROM lensagora_waitlist
      ORDER BY timestamp DESC
    `;
    return { success: true, entries: rows as WaitlistEntry[] };
  } catch (error) {
    console.error("Error fetching waitlist entries:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Database health check - automatically use current environment
export async function checkDatabaseConnection(headers?: Headers): Promise<{ success: boolean; error?: string; environment?: string }> {
  try {
    const currentEnv = getCurrentEnvironment(headers);
    const sqlClient = createSqlClient(headers);
    
    console.log('🏥 Health check for environment:', currentEnv);
    
    await sqlClient.sql`SELECT 1`;
    return { success: true, environment: currentEnv };
  } catch (error) {
    console.error("Database connection failed:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: getCurrentEnvironment(headers)
    };
  }
}

// Check all environments (for health monitoring)
export async function checkAllEnvironments(): Promise<{
  main: { success: boolean; error?: string };
  testnet: { success: boolean; error?: string };
}> {
  const [mainResult, testnetResult] = await Promise.allSettled([
    checkSpecificEnvironment('main'),
    checkSpecificEnvironment('testnet')
  ]);

  return {
    main: mainResult.status === 'fulfilled' ? mainResult.value : { success: false, error: 'Promise rejected' },
    testnet: testnetResult.status === 'fulfilled' ? testnetResult.value : { success: false, error: 'Promise rejected' }
  };
}

// Helper function to check a specific environment
async function checkSpecificEnvironment(environment: DatabaseEnvironment): Promise<{ success: boolean; error?: string }> {
  try {
    const config = databaseConfig[environment];
    if (!config?.url) {
      return { success: false, error: `Database URL not configured for environment: ${environment}` };
    }
    
    // For now, we'll use the default sql client
    // In a more sophisticated setup, you might create environment-specific connections
    await sql`SELECT 1`;
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 