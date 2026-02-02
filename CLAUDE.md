# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lens Agora is an NFT marketplace built on Lens Network that combines social interaction with NFT trading. It integrates Lens Protocol for social features (posts, comments, likes, follows) and Thirdweb for NFT marketplace operations (listings, auctions, minting).

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Provider Stack (Root Layout)
```
ThirdwebProvider
  └── Web3Provider (Wagmi + ConnectKit)
      └── ThemeProvider
          └── LensSessionProvider
              └── App
```

### Key Integrations

**Lens Protocol** (`lib/lensProtocolUtils.ts`, `lib/client/lensProtocolClient.ts`)
- Authentication: `loginWithAccount()`, `getCurrentSession()`, `logout()`
- Social: `createCommentOnPost()`, `createLikeOnPost()`, `executeLikeClickForNFT()`
- Profiles: `getLensAccount()`, `getLensAccountByAddress()`, `getAccountStats()`
- Session management via `LensSessionContext`

**Thirdweb Marketplace** (`lib/marketplacev3.ts`, `lib/nfts.ts`)
- Listings: `createNewListing()`, `editListing()`, `cancelListing()`
- Auctions: `bidInAuction()`, `cancelAuction()`, `getBidsByAuction()`
- Offers: `makeOffer()`, `acceptOffer()`
- Queries: `getAllValidListings()`, `getNFTMarketplaceInfo()`, `fetchNftActivity()`
- NFTs: `getCurrentNFT()`, `getCurrentCollection()`, `createNFTContract()`
- Marketplace address (testnet): `0x564C902f98565bE6ecE4278b4bf16452d0F246bD`

**Database** (`lib/database.ts`, `lib/db/index.ts`)
- Vercel Postgres with multi-environment support
- Tables: `contracts_deployed_by_address`, `lensagora_waitlist`, `lens_collections`, `mailing_list_subscribers`
- Environment selection via `NEXT_PUBLIC_DATABASE_ENVIRONMENT` ("main" or "testnet")

### Directory Structure

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components (UI in `ui/`, NFT-specific in `NFT/`)
- `src/contexts/` - React contexts (`LensSessionContext`, `ThemeContext`)
- `src/hooks/` - Custom hooks (`useLensProfile`, `useNFTDetails`, `useMintNFT`)
- `lib/` - Shared utilities and SDK clients
- `lib/client/` - SDK client instances (Lens, Thirdweb)

### Key Routes

- `/explore` - NFT marketplace exploration
- `/create` - Contract/NFT creation workflow
- `/dashboard` - User dashboard (listings, collected NFTs)
- `/profile/[username]` - User profile with tabs (owned, collections, followers)
- `/items/[address]` - Collection view
- `/items/[address]/[id]` - NFT detail page
- `/newAccount` - Create Lens account

### Data Flow Pattern

Server actions (`lib/actions.ts`) wrap database operations. Client components fetch data via:
1. Direct SDK calls (Thirdweb, Lens Protocol)
2. Custom hooks for common patterns
3. Server actions for database writes

### NFT Type Handling

The codebase auto-detects ERC721 vs ERC1155:
- ERC721: Single owner display
- ERC1155: Multiple owners list with quantities

## Environment Variables

```
LENS_API_KEY                          # Lens Protocol server key
NEXT_PUBLIC_THIRDWEB_CLIENT_ID        # Thirdweb public client ID
THIRDWEB_SECRET_KEY                   # Thirdweb server secret
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID  # WalletConnect v2
DATABASE_URL_MAIN                     # Production Postgres
DATABASE_URL_TESTNET                  # Testnet Postgres
NEXT_PUBLIC_DATABASE_ENVIRONMENT      # "main" or "testnet"
NEXT_PUBLIC_LENSNETWORK_ENVIRONMENT   # "main" or "testnet"
NEXT_PUBLIC_FEATURED_LISTINGS_IDS     # Comma-separated listing IDs
```

## Tech Stack

- Next.js 14.2 (App Router) with TypeScript
- Tailwind CSS + Shadcn/ui (Radix-based components)
- Wagmi v2 + ConnectKit for wallet connection
- Thirdweb v5 for NFT/marketplace SDK
- Lens Protocol (canary builds) for social features
- Vercel Postgres for database
- Apollo Client for GraphQL
- TanStack React Query for server state
