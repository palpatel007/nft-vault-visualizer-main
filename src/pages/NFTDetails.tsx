import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, ExternalLink, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDownload } from '../contexts/DownloadContext';
import { NFT, APIResponse } from '../hooks/useNFTs';
import { useAccount } from 'wagmi';

const NFTDetails = () => {
  const { contractAddress, tokenId } = useParams();
  const { address } = useAccount();
  const { selectedFormat } = useDownload();
  const [copied, setCopied] = useState(false);
  const [nft, setNft] = useState<NFT | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFTDetails = async () => {
      if (!address || !contractAddress) return;
      
      setLoading(true);
      setError(null);

      try {
        // Replace with your actual API endpoint
        const apiUrl = `YOUR_API_ENDPOINT_HERE?wallet=${address}&contract=${contractAddress}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }
        
        const data: APIResponse = await response.json();
        
        // Find the specific NFT by token ID
        const foundNft = data.nfts.find(nft => nft.token_id === tokenId);
        
        if (foundNft) {
          setNft(foundNft);
        } else {
          setError('NFT not found');
        }
      } catch (err) {
        setError('Failed to fetch NFT details');
        console.error('Error fetching NFT details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTDetails();
  }, [address, contractAddress, tokenId]);

  const handleDownload = () => {
    if (nft) {
      toast.success(`Download started for ${nft.metadata.name} in ${selectedFormat} format!`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success('Address copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-nft-accent mx-auto mb-4"></div>
          <p className="text-white text-sm sm:text-base">Loading NFT details...</p>
        </div>
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 mb-4 text-sm sm:text-base">{error || 'NFT not found'}</p>
          <button
            onClick={handleGoBack}
            className="text-nft-accent hover:text-white transition-colors text-sm sm:text-base"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Back Button */}
        <motion.button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-nft-accent hover:text-white transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back to Collection
        </motion.button>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* NFT Image */}
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-card p-4 sm:p-6">
              <img
                src={nft.metadata.image_url}
                alt={nft.metadata.name}
                className="w-full aspect-square object-cover rounded-lg"
              />
            </div>

            {/* Download Button */}
            <motion.button
              onClick={handleDownload}
              className="w-full bg-nft-accent hover:bg-nft-secondary text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-colors flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              Download in {selectedFormat} Format
            </motion.button>
          </motion.div>

          {/* NFT Details */}
          <motion.div
            className="space-y-6 sm:space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Basic Info */}
            <div className="glass-card p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text mb-2">
                {nft.metadata.name}
              </h1>
              <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                {nft.name} Collection
              </p>
              <p className="text-white leading-relaxed text-sm sm:text-base">
                {nft.metadata.description}
              </p>
            </div>

            {/* Contract & Owner Info */}
            <div className="glass-card p-4 sm:p-6 space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Details</h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground">Token ID</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white font-mono text-sm sm:text-base">{nft.token_id}</span>
                    <button
                      onClick={() => handleCopyAddress(nft.token_id)}
                      className="p-1 hover:bg-dark-surface rounded"
                    >
                      <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground hover:text-white" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground">Contract Address</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white font-mono text-xs sm:text-sm">
                      {nft.contract_address.slice(0, 6)}...{nft.contract_address.slice(-4)}
                    </span>
                    <button
                      onClick={() => handleCopyAddress(nft.contract_address)}
                      className="p-1 hover:bg-dark-surface rounded"
                    >
                      <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground hover:text-white" />
                    </button>
                    <a
                      href={`https://etherscan.io/address/${nft.contract_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-dark-surface rounded"
                    >
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground hover:text-white" />
                    </a>
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground">Chain</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white font-mono text-xs sm:text-sm capitalize">
                      {nft.chain.replace('_', ' ')} (ID: {nft.chain_id})
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground">Last Acquired</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white text-xs sm:text-sm">
                      {new Date(nft.last_acquired).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Attributes */}
            <div className="glass-card p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Attributes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {nft.metadata.attributes.map((attr, index) => (
                  <motion.div
                    key={index}
                    className="bg-dark-surface/50 p-3 sm:p-4 rounded-lg text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                      {attr.trait_type}
                    </div>
                    <div className="text-white font-semibold text-sm sm:text-base">
                      {attr.value}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetails;
