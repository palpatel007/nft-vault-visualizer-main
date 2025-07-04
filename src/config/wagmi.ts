import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Chain } from 'wagmi/chains';

// Official ApeChain Mainnet config
export const apeChain = {
  id: 33139,
  name: 'ApeChain',
  nativeCurrency: {
    decimals: 18,
    name: 'APE',
    symbol: 'APE',
  },
  rpcUrls: {
    default: { http: ['https://apechain.calderachain.xyz/http'] },
    public: { http: ['https://apechain.calderachain.xyz/http'] },
  },
  blockExplorers: {
    default: { name: 'ApeChain Explorer', url: 'https://apechain.calderaexplorer.xyz/' },
  },
  testnet: false,
} satisfies Chain;

export const config = getDefaultConfig({
  appName: 'NFT Holder Dashboard',
  projectId: 'your-project-id', // Replace with your WalletConnect project ID
  chains: [apeChain],
  ssr: false,
});
