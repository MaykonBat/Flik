import { base, baseSepolia } from "viem/chains";

export const CONTRACTS = {
  EVENT_FACTORY: {
    // Endereço do seu contrato deployado
    [base.id]: "0x478E2322e0b7bD28d522bFD1a39E7ecD38f34AC0" as `0x${string}`,
    [baseSepolia.id]:
      "0x478E2322e0b7bD28d522bFD1a39E7ecD38f34AC0" as `0x${string}`,
  },
  EVENT_HUB: {
    // Endereço do EventHub contract
    [base.id]: "0x6cD0f16959f7F5ed513bE879C9d79B0136BA76Ea" as `0x${string}`,
    [baseSepolia.id]:
      "0x6cD0f16959f7F5ed513bE879C9d79B0136BA76Ea" as `0x${string}`,
  },
  PAID_EVENT_FACTORY: {
    // Endereço do PaidEventFactory contract
    [base.id]: "0x6f5Eb737556Db3d43725D52b0399C10a99f03552" as `0x${string}`,
    [baseSepolia.id]:
      "0x6f5Eb737556Db3d43725D52b0399C10a99f03552" as `0x${string}`,
  },
} as const;

export function getContractAddress(
  chainId: number,
  contract: keyof typeof CONTRACTS
): `0x${string}` {
  const addresses = CONTRACTS[contract];
  return (
    addresses[chainId as keyof typeof addresses] || addresses[baseSepolia.id]
  );
}
