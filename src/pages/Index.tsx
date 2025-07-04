import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { NFTGrid } from '../components/NFTGrid';
import { useNFTs } from '../hooks/useNFTs';
import { WalletButton } from '../components/WalletButton';
import { Menu, X } from 'lucide-react';

const Index = () => {
  const { address, isConnected } = useAccount();
  const { nfts, loading, error } = useNFTs(address);
  const [downloadFormat, setDownloadFormat] = useState('PFP');
  const [showGLB, setShowGLB] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleFormatChange = (format: string) => {
    setDownloadFormat(format);
    setShowGLB(format === 'GLB');
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Mobile Menu Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white border border-black hover:bg-white hover:text-black transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            {sidebarOpen ? 'Close Menu' : 'Download Options'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Sidebar - Hidden on mobile unless open */}
          <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block lg:w-64 lg:flex-shrink-0`}>
            <Sidebar onFormatChange={handleFormatChange} selectedFormat={downloadFormat} />
          </div>
          
          {/* Main Content */}
          <main className="flex-1 flex items-center justify-center min-w-0">
            {!isConnected ? (
              <div className="w-full flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 max-w-md mx-auto px-4 sm:px-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4">Alpha Lions NFT Dashboard</h1>
                <p className="text-black text-base sm:text-lg mb-6 sm:mb-8 px-4">
                  Connect your wallet to access your NFT collection and download options
                </p>
                <div className="sm:hidden">
                  <WalletButton />
                </div>
                <div className="hidden sm:block">
                  <WalletButton />
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">
                    {`Your ${downloadFormat} Collection`}
                  </h2>
                  <p className="text-black text-sm sm:text-base">
                    {loading ? 'Loading...' : `${nfts.length} NFTs in your wallet`}
                  </p>
                </div>
                <NFTGrid 
                  nfts={nfts} 
                  loading={loading} 
                  error={error}
                  downloadFormat={downloadFormat}
                  showGLB={showGLB}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
