# API Architecture Guide: Environment Switching Best Practices

## 🏆 Recommended Approach: Single API with Environment Headers

This guide explains why we chose **Single API with Environment Headers** as the best approach for your Lens Protocol application.

## Why This Approach?

### Industry Standards
- **Stripe**: Uses `x-stripe-version` header for API versions
- **AWS**: Uses `x-amz-target` for different services
- **Google Cloud**: Uses `x-goog-api-version` for API versions
- **Lens Protocol**: Uses environment switching in their SDKs

### Benefits for Your Use Case
1. **Consistent with Lens Protocol**: Matches how Lens handles testnet/mainnet
2. **Single Codebase**: Easier to maintain and deploy
3. **Flexible**: Can switch environments per request
4. **Scalable**: Easy to add more environments later
5. **Industry Standard**: What most developers expect

## Implementation

### 1. API Usage

#### Using Headers (Recommended)
```bash
# Production
curl -X POST "http://localhost:3000/api/addContractByAddress" \
  -H "Content-Type: application/json" \
  -H "x-environment: main" \
  -d '{"address":"0x123...","contractAddress":"0x456...","contractType":"NFTCollection"}'

# Testnet
curl -X POST "http://localhost:3000/api/addContractByAddress" \
  -H "Content-Type: application/json" \
  -H "x-environment: testnet" \
  -d '{"address":"0x123...","contractAddress":"0x456...","contractType":"NFTCollection"}'
```

#### Using .env (Fallback)
```env
DATABASE_ENVIRONMENT=testnet
```

### 2. Frontend Integration

#### React Hook Example
```typescript
import { useState } from 'react';

export const useApi = () => {
  const [environment, setEnvironment] = useState<'main' | 'testnet'>('main');

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'x-environment': environment,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  };

  return { apiCall, environment, setEnvironment };
};
```

#### Usage in Components
```typescript
const { apiCall, environment, setEnvironment } = useApi();

// Switch environments
const handleEnvironmentSwitch = () => {
  setEnvironment(environment === 'main' ? 'testnet' : 'main');
};

// Make API calls
const addContract = async () => {
  const result = await apiCall('/api/addContractByAddress', {
    method: 'POST',
    body: JSON.stringify({ address, contractAddress, contractType }),
  });
};
```

### 3. Environment Detection Logic

The system follows this priority:
1. **Header**: `x-environment: testnet` (highest priority)
2. **Environment Variable**: `DATABASE_ENVIRONMENT=main` (fallback)

```typescript
// In lib/database.ts
export function getCurrentEnvironment(headers?: Headers): DatabaseEnvironment {
  // First, check if environment is specified in headers
  if (headers) {
    const headerEnv = headers.get('x-environment') as DatabaseEnvironment;
    if (headerEnv && (headerEnv === 'main' || headerEnv === 'testnet')) {
      return headerEnv;
    }
  }
  
  // Fallback to environment variable
  return (process.env.DATABASE_ENVIRONMENT as DatabaseEnvironment) || 'main';
}
```

## Alternative Approaches (Not Recommended for Your Use Case)

### 1. Separate API Routes
```typescript
// ❌ Not recommended - creates code duplication
POST /api/main/contracts
POST /api/testnet/contracts
```

**Problems:**
- Code duplication
- Harder to maintain
- Inconsistent with industry standards

### 2. Subdomain Approach
```typescript
// ❌ Overkill for your use case
https://api.yourdomain.com/contracts
https://testnet-api.yourdomain.com/contracts
```

**Problems:**
- Complex DNS setup
- More infrastructure overhead
- Harder to deploy

### 3. Query Parameters
```typescript
// ❌ Not recommended - pollutes URLs
POST /api/contracts?env=testnet
```

**Problems:**
- URL pollution
- Not RESTful
- Harder to cache

## Best Practices

### 1. Header Naming
- Use `x-environment` (industry standard)
- Keep it simple and clear
- Document the header in your API docs

### 2. Error Handling
```typescript
// Validate environment in your API routes
const environment = request.headers.get('x-environment');
if (environment && !['main', 'testnet'].includes(environment)) {
  return NextResponse.json({ 
    error: 'Invalid environment. Use "main" or "testnet"' 
  }, { status: 400 });
}
```

### 3. Documentation
```typescript
/**
 * @api {post} /api/addContractByAddress Add Contract
 * @apiHeader {String} x-environment Environment to use (main|testnet)
 * @apiParam {String} address Wallet address
 * @apiParam {String} contractAddress Contract address
 * @apiParam {String} contractType Contract type
 */
```

### 4. Testing
```typescript
// Test both environments
describe('API Environment Switching', () => {
  it('should use main environment', async () => {
    const response = await fetch('/api/health', {
      headers: { 'x-environment': 'main' }
    });
    const data = await response.json();
    expect(data.environment).toBe('main');
  });

  it('should use testnet environment', async () => {
    const response = await fetch('/api/health', {
      headers: { 'x-environment': 'testnet' }
    });
    const data = await response.json();
    expect(data.environment).toBe('testnet');
  });
});
```

## Migration Strategy

### Phase 1: Implement Header Support
- Add header detection to database layer
- Keep .env fallback for backward compatibility
- Update API routes to pass headers

### Phase 2: Update Frontend
- Create environment switching UI
- Update API calls to use headers
- Add environment indicators

### Phase 3: Documentation & Testing
- Document the new approach
- Add comprehensive tests
- Update deployment guides

## Security Considerations

### 1. Environment Validation
```typescript
// Validate environment values
const validEnvironments = ['main', 'testnet'];
if (!validEnvironments.includes(environment)) {
  throw new Error('Invalid environment');
}
```

### 2. Rate Limiting
```typescript
// Different rate limits per environment
const rateLimit = environment === 'testnet' ? 1000 : 100;
```

### 3. Access Control
```typescript
// Restrict certain operations to specific environments
if (environment === 'main' && !isAdmin) {
  throw new Error('Admin required for main environment');
}
```

## Conclusion

The **Single API with Environment Headers** approach is the most suitable for your Lens Protocol application because:

1. **Industry Standard**: Matches how major APIs handle environment switching
2. **Lens Protocol Compatible**: Aligns with Lens SDK patterns
3. **Maintainable**: Single codebase, easy to update
4. **Flexible**: Can switch environments per request
5. **Scalable**: Easy to add more environments or features

This approach gives you the best balance of simplicity, maintainability, and industry alignment. 