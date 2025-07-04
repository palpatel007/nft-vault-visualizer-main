
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { config } from './config/wagmi';
import { DownloadProvider } from './contexts/DownloadContext';
import Index from './pages/Index';
import NFTDetails from './pages/NFTDetails';
import GLBViewerPage from './pages/GLBViewerPage';

const queryClient = new QueryClient();

const App = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <DownloadProvider>
            <Router>
              <div className="min-h-screen bg-dark-bg">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/apecoin-nft-details/:contractAddress/:tokenId" element={<NFTDetails />} />
                  <Route path="/glb-viewer" element={<GLBViewerPage />} />
                </Routes>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
                />
              </div>
            </Router>
          </DownloadProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
