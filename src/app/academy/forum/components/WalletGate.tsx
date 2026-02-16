'use client';

import { ConnectButton } from '@mysten/dapp-kit';

export function WalletGate({ message }: { message?: string }) {
  return (
    <div className="forum-wallet-gate">
      <p>{message || 'Connect your Sui wallet to participate'}</p>
      <ConnectButton />
    </div>
  );
}
