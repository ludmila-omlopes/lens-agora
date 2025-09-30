# Database Migration to Neon

This project has been migrated from Prisma to Neon (PostgreSQL) using `@vercel/postgres`.

## What Changed

1. **Removed Prisma**: All Prisma dependencies and configuration have been removed
2. **Centralized Database Operations**: Created `lib/database.ts` with centralized database functions
3. **Updated API Routes**: All API routes now use the centralized database functions
4. **Improved Error Handling**: Better error handling and type safety

## Setup Instructions

### 1. Create a Neon Database

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy your connection string from the dashboard

### 2. Set Up Environment Variables

Add your Neon connection string to your `.env.local` file:

```env
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"
```

### 3. Create Database Tables

Run these SQL commands in your Neon database:

```sql
-- Table for deployed contracts
CREATE TABLE IF NOT EXISTS contracts_deployed_by_address (
    id SERIAL PRIMARY KEY,
    address VARCHAR(42) NOT NULL,
    contract_address VARCHAR(42) NOT NULL,
    contract_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for waitlist entries
CREATE TABLE IF NOT EXISTS lensagora_waitlist (
    id SERIAL PRIMARY KEY,
    lens_username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(42) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contracts_address ON contracts_deployed_by_address(address);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON lensagora_waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_wallet ON lensagora_waitlist(wallet_address);
```

### 4. Test the Connection

Visit `/api/health` to test your database connection:

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Database Functions

The following functions are available in `lib/database.ts`:

### Contract Operations
- `addDeployedContract(address, contractAddress, contractType)` - Add a new deployed contract
- `getDeployedContractsByAddress(address)` - Get all contracts for an address

### Waitlist Operations
- `addWaitlistEntry(lensUsername, email, walletAddress)` - Add a waitlist entry
- `getWaitlistEntries()` - Get all waitlist entries

### Utility Functions
- `checkDatabaseConnection()` - Test database connectivity

## API Endpoints

- `POST /api/addContractByAddress` - Add a deployed contract
- `GET /api/listContractsByAddress?address=<address>` - List contracts by address
- `POST /api/addWaitlist` - Add a waitlist entry
- `GET /api/health` - Database health check

## Benefits of This Migration

1. **Better Performance**: Direct SQL queries with `@vercel/postgres`
2. **Simplified Setup**: No need for Prisma schema management
3. **Type Safety**: TypeScript interfaces for all database operations
4. **Error Handling**: Consistent error handling across all operations
5. **Scalability**: Neon provides serverless PostgreSQL with automatic scaling

## Troubleshooting

### Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure your Neon database is active
- Check that your IP is allowed (if using IP restrictions)

### Migration Issues
- If you have existing data, export it from your old database and import it to Neon
- Use the health check endpoint to verify connectivity
- Check the browser console and server logs for detailed error messages

## Next Steps

1. Test all your existing functionality
2. Monitor the health check endpoint in production
3. Consider adding database migrations for future schema changes
4. Set up monitoring and alerting for database connectivity 