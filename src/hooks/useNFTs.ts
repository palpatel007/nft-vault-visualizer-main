import { useState, useEffect } from 'react';

export interface NFTAttribute {
  trait_type: string;
  value: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  image_url: string;
  attributes: NFTAttribute[];
  dna: string;
  edition: number;
  date: number;
  compiler: string;
}

export interface NFT {
  contract_address: string;
  token_standard: string;
  token_id: string;
  chain: string;
  chain_id: number;
  name: string;
  symbol: string;
  metadata: NFTMetadata;
  balance: string;
  last_acquired: string;
}

export interface APIResponse {
  wallet: string;
  contract: string;
  total: number;
  nfts: NFT[];
}

const CONTRACT = '0x8420B95bEac664b6E8E89978C3fDCaA1A71c8350';
const WALLET = '0x2bD6576a217f8d8F69b063DE6C9cf599399c30c2';

export const useNFTs = (wallet?: string) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wallet) {
      setNfts([]);
      return;
    }
    const fetchNFTs = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = `http://api.alphalions.io/api/nfts?wallet=${wallet}&contract=${CONTRACT}&page=1&limit=1000`;
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`API request failed: ${response.status} - ${errorData.error || response.statusText}`);
        }
        const data: APIResponse = await response.json();
        setNfts(data.nfts || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NFTs';
        setError(errorMessage);
        console.error('Error fetching NFTs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNFTs();
  }, [wallet]);

  return { nfts, loading, error };
};
