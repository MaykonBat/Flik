import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { baseSepolia } from "viem/chains";
import { coinbaseWallet } from "wagmi/connectors";

export function getConfig() {
  return createConfig({
    chains: [baseSepolia], // Apenas Base Sepolia
    connectors: [
      coinbaseWallet({
        appName: "Event Platform",
        preference: "smartWalletOnly",
        version: "4",
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [baseSepolia.id]: http(),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
