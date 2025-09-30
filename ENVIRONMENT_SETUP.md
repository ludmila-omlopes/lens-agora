# Multi-Environment Database Setup with Neon

This guide shows you how to configure your application to use both main and testnet database environments using Neon branches with secure server actions.

## Architecture Overview

The environment switching is handled automatically at the database layer based on your `.env` configuration or request headers. Database operations are secured using Next.js server actions to keep sensitive database URLs server-side only.

- **Environment Detection**: The database layer automatically detects which environment to use from `NEXT_PUBLIC_DATABASE_ENVIRONMENT` or `x-environment` header
- **Server Actions**: All database operations use server actions to keep sensitive URLs secure
- **Single API**: All endpoints work for both environments using headers
- **Simple Switching**: Change environments by updating your `.env` file or using headers

## Environment Variables Setup

Create or update your `.env.local` file with the following variables:

```env
# Database Environment Configuration (Public - available on client and server)
# Set this to 'main' or 'testnet' to control which database to use
NEXT_PUBLIC_DATABASE_ENVIRONMENT=testnet

# Main Database (Production) - Server only - NEVER make this public
# This can be your main Neon branch or any production database
DATABASE_URL_MAIN=postgresql://username:password@hostname:port/database?sslmode=require

# Testnet Database (Development/Testing) - Server only - NEVER make this public
# This should be your Neon dev branch for testing
DATABASE_URL_TESTNET=postgresql://username:password@hostname:port/database?sslmode=require

# Legacy support - if you only have one database URL, use this
# DATABASE_URL=postgresql://username:password@hostname:port/database?sslmode=require
```

## Security Architecture

### Server Actions (Secure)
All database operations are handled through server actions in `lib/actions.ts`:
- Database URLs are never exposed to the client
- All sensitive operations happen server-side
- Environment switching is handled securely

### Client API (Safe)
Client-side code uses `lib/clientApi.ts`:
- Provides a safe interface to server actions
- No direct database access
- Environment switching through server actions

## Environment Switching

### Method 1: Using Server Actions (Recommended)
```typescript
import { addDeployedContract } from '../lib/clientApi';

// Add contract to main environment
await addDeployedContract(address, contractAddress, contractType, 'main');

// Add contract to testnet environment
await addDeployedContract(address, contractAddress, contractType, 'testnet');
```

### Method 2: Using React Hook
```typescript
import { useEnvironment } from '../hooks/useEnvironment';

const { environment, setEnvironment, clientApi } = useEnvironment();

// Switch to testnet
setEnvironment('testnet');

// Add contract using current environment
await clientApi.addDeployedContract(address, contractAddress, contractType);
```

### Method 3: Change .env File
Simply update your `NEXT_PUBLIC_DATABASE_ENVIRONMENT` variable:

```env
# For production
NEXT_PUBLIC_DATABASE_ENVIRONMENT=main

# For development/testing
NEXT_PUBLIC_DATABASE_ENVIRONMENT=testnet
```

## Testing Your Setup

### 1. Health Check Current Environment
```bash
curl "http://localhost:3000/api/health"
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "environment": "testnet",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Health Check All Environments
```bash
curl "http://localhost:3000/api/health?all=true"
```

Expected response:
```json
{
  "status": "multi-environment",
  "environments": {
    "main": { "success": true },
    "testnet": { "success": true }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3. Test Server Actions
```typescript
import { addDeployedContract, getDeployedContractsByAddress } from '../lib/clientApi';

// Add contract to main environment
const result = await addDeployedContract(
  "0x123...", 
  "0x456...", 
  "NFTCollection", 
  'main'
);

// Get contracts from testnet environment
const contracts = await getDeployedContractsByAddress("0x123...", 'testnet');
```

## API Endpoints

All endpoints automatically use the environment specified in your `.env` file or `x-environment` header:

- `POST /api/addContractByAddress` - Add contract to current environment
- `GET /api/listContractsByAddress` - List contracts from current environment
- `POST /api/addWaitlist` - Add waitlist entry to current environment
- `GET /api/health` - Check current environment
- `GET /api/health?all=true` - Check all environments

## Using in Your Code

### Server Actions (Server-side only)
All database operations are handled through secure server actions:

```typescript
import { addContractAction, getContractsAction } from '../lib/actions';

// These automatically use the environment from NEXT_PUBLIC_DATABASE_ENVIRONMENT or headers
await addContractAction(address, contractAddress, contractType);
const contracts = await getContractsAction(address);
```

### Business Logic Layer (Server-side only)
Your business logic remains clean and simple:

```typescript
import { addDeployedContract, listDeployedContractsByAddress } from '../lib/db';

// These work the same regardless of environment
await addDeployedContract(address, contractAddress, contractType);
const contracts = await listDeployedContractsByAddress(address);
```

### Frontend Integration (Client-side)
For frontend components, use the client API:

```typescript
import { clientApi } from '../lib/clientApi';
import { useEnvironment } from '../hooks/useEnvironment';

// Using the hook
const { environment, setEnvironment, clientApi } = useEnvironment();

// Switch environments
const handleEnvironmentSwitch = () => {
  setEnvironment(environment === 'main' ? 'testnet' : 'main');
};

// Make API calls
const addContract = async () => {
  const result = await clientApi.addDeployedContract(
    address, 
    contractAddress, 
    contractType
  );
};

// Or use convenience functions
import { addDeployedContract } from '../lib/clientApi';

const result = await addDeployedContract(
  address, 
  contractAddress, 
  contractType, 
  'testnet' // specify environment
);
```

### Access Environment in Frontend
You can also access the current environment in your frontend components:

```typescript
// In any React component
const currentEnvironment = process.env.NEXT_PUBLIC_DATABASE_ENVIRONMENT;
console.log('Current environment:', currentEnvironment); // 'testnet' or 'main'
```

## Development Workflow

### 1. Development Phase
```env
NEXT_PUBLIC_DATABASE_ENVIRONMENT=testnet
DATABASE_URL_TESTNET=your_dev_neon_branch_url
```

- Develop and test features using the testnet database
- All server actions automatically use the testnet environment
- Safe to experiment without affecting production data

### 2. Production Deployment
```env
NEXT_PUBLIC_DATABASE_ENVIRONMENT=main
DATABASE_URL_MAIN=your_main_neon_branch_url
```

- Deploy to production with main environment
- All server actions automatically use the main environment
- Production data is isolated from test data

## Best Practices

1. **Security First**: Never expose database URLs to the client
2. **Server Actions**: Always use server actions for database operations
3. **Environment Isolation**: Keep production and test data completely separate
4. **Development Safety**: Always use testnet for development and testing
5. **Configuration Management**: Use environment variables for all configuration
6. **Health Monitoring**: Use the health check endpoints to monitor database connectivity
7. **Clear Naming**: Use descriptive names for your Neon branches
8. **Header Usage**: Use `x-environment` header for dynamic environment switching
9. **Public Variables**: Use `NEXT_PUBLIC_` prefix only for variables needed on client side

## Troubleshooting

### Connection Issues
- Verify your database URLs are correct for both environments
- Ensure both Neon branches are active
- Check that your IP is allowed for both connections

### Environment Issues
- Verify `NEXT_PUBLIC_DATABASE_ENVIRONMENT` is set to either 'main' or 'testnet'
- Ensure the corresponding `DATABASE_URL_MAIN` or `DATABASE_URL_TESTNET` is set
- Use the health check endpoint to verify the current environment
- Check that headers are being passed correctly if using header-based switching
- Restart your development server after changing environment variables

### Server Action Issues
- Ensure all database operations go through server actions
- Check that database URLs are not exposed in client-side code
- Verify server actions are properly imported and used

### Data Isolation
- Double-check your environment configuration before making changes
- Use the health check endpoint to confirm which environment is active
- Test in testnet environment before switching to main

## Benefits of This Approach

1. **Security**: Database URLs are never exposed to the client
2. **Clean Architecture**: Environment switching is handled at the lowest layer
3. **Single API**: No duplicate routes, easier to maintain
4. **Flexible**: Can switch environments via server actions or .env
5. **Type Safety**: No risk of passing wrong environment parameters
6. **Industry Standard**: Follows patterns used by major APIs
7. **Maintainability**: Less code complexity in business logic layers
8. **Client Access**: Public environment variables work on both client and server
9. **Server Actions**: Leverages Next.js server actions for secure database operations 