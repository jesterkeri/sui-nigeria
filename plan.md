# Wallet Connect for Seal Academy

## Overview
Add Sui wallet connection to the Academy page using `@mysten/dapp-kit`. Connected wallet address will be used to key progress storage, so users can track progress across devices.

## Steps

### 1. Install dependencies
```
npm install @mysten/dapp-kit @mysten/sui @tanstack/react-query
```

### 2. Create wallet providers wrapper
- **New file:** `src/components/SuiProviders.tsx`
- Wrap app with `QueryClientProvider`, `SuiClientProvider`, and `WalletProvider`
- Configure for Sui mainnet (or testnet)

### 3. Update root layout
- **File:** `src/app/layout.tsx`
- Wrap `LenisProvider` children with `SuiProviders`

### 4. Add Connect Wallet button to Academy page
- **File:** `src/app/academy/page.tsx`
- Add a `ConnectButton` (from dApp Kit) in the hero actions area, next to "START LEARNING" and "EXPLORE PATHS"
- Style it to match the neubrutalist design

### 5. Update progress tracking to be wallet-aware
- **File:** `src/hooks/useAcademyProgress.ts`
- Change localStorage key to include wallet address when connected: `sui-academy-progress-{address}`
- Falls back to anonymous `sui-academy-progress` when no wallet connected
- On wallet connect, load wallet-specific progress
- On wallet disconnect, revert to anonymous progress

### 6. Style the connect button
- **File:** `src/app/academy/academy.css`
- Style the dApp Kit `ConnectButton` to match existing CTA buttons (Russo One font, uppercase, neubrutalist border)

## Notes
- No on-chain storage — progress stays in localStorage but keyed by wallet address
- dApp Kit's `ConnectButton` handles wallet selection modal, connect/disconnect flow
- `@tanstack/react-query` is a peer dependency of dApp Kit
