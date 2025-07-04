import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, X, ZoomIn, ZoomOut } from 'lucide-react';
import { NFT } from '../hooks/useNFTs';
import { toast } from 'react-toastify';
import GLBViewer from './GLBViewer';

interface NFTCardProps {
  nft: NFT;
  index: number;
  downloadFormat: string;
  showGLB?: boolean;
}

// Import all pixel art images as URLs
const pixelArtImages = import.meta.glob('../assets/images/picsart/*.png', { eager: true, as: 'url' });

export const NFTCard: React.FC<NFTCardProps> = ({ nft, index, downloadFormat, showGLB }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const cleanTokenId = String(nft.token_id).replace(/^0+/, '').trim();
  const glbPath = `/src/assets/images/glb/${cleanTokenId}.glb`;
  if (showGLB) {
    console.log(`Requesting GLB for token_id: '${nft.token_id}' -> path: '${glbPath}'`);
  }

  const show3D = downloadFormat === 'GLB' || downloadFormat === 'FBX';

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (downloadFormat === 'GLB') {
        const url = `/src/assets/images/glb/${cleanTokenId}.glb`;
        const response = await fetch(url);
        if (!response.ok) {
          toast.error('GLB file not found for this token.');
          return;
        }
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${nft.metadata.name || 'nft-model'}.glb`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
        toast.success(`Download started for ${nft.metadata.name} GLB!`);
      } else if (downloadFormat === 'FBX') {
        const url = `/src/assets/images/fbx/${cleanTokenId}.fbx`;
        const response = await fetch(url);
        if (!response.ok) {
          toast.error('FBX file not found for this token.');
          return;
        }
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${nft.metadata.name || 'nft-model'}.fbx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
        toast.success(`Download started for ${nft.metadata.name} FBX!`);
      } else {
        if (downloadFormat === 'Pixel Art') {
          const pixelArtUrl = pixelArtImages[`../assets/images/picsart/${nft.token_id}.png`];
          if (!pixelArtUrl) {
            toast.error('Pixel Art image not found for this token.');
            return;
          }
          const response = await fetch(pixelArtUrl);
          if (!response.ok) {
            toast.error('Pixel Art image not found for this token.');
            return;
          }
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${nft.metadata.name || 'nft-pixelart'}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          toast.success(`Download started for ${nft.metadata.name} Pixel Art!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          console.log(`Downloading ${nft.metadata.name} Pixel Art from ${pixelArtUrl}`);
        } else {
          const response = await fetch(nft.metadata.image_url, { mode: 'cors' });
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${nft.metadata.name || 'nft-image'}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          toast.success(`Download started for ${nft.metadata.name} in ${downloadFormat} format!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          console.log(`Downloading ${nft.metadata.name} in ${downloadFormat} format`);
        }
      }
    } catch (error) {
      toast.error('Failed to download file.');
      console.error('Download error:', error);
    }
  };

  const handleViewImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.innerWidth < 768) {
      setZoom(1.5);
    } else {
      setZoom(1);
    }
    setModalOpen(true);
  };

  return (
    <>
      <motion.div
        className="nft-card group bg-white border border-black shadow-md hover:shadow-lg transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => { setZoom(1); setModalOpen(true); }}
      >
        <div className="relative overflow-hidden mb-3 sm:mb-4">
          {show3D ? (
            <div style={{ width: '100%', height: '320px', background: '#ddd' }}>
              <GLBViewer modelPath={glbPath} backgroundColor="#dddddd" />
            </div>
          ) : (
            <img
              src={downloadFormat === 'Pixel Art' ? pixelArtImages[`../assets/images/picsart/${nft.token_id}.png`] : nft.metadata.image_url}
              alt={nft.metadata.name}
              className="w-full h-48 sm:h-56 lg:h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          )}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          />
          {/* Action Buttons */}
          <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              onClick={e => { e.stopPropagation(); handleViewImage(e); }}
              className="flex items-center justify-center p-2 sm:p-3 bg-black text-white hover:bg-white hover:text-black border border-black transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
            <motion.button
              onClick={e => { e.stopPropagation(); handleDownload(e); }}
              className="flex items-center justify-center p-2 sm:p-3 bg-black text-white hover:bg-white hover:text-black border border-black transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>
        </div>
        <div className="space-y-1 sm:space-y-2 px-2 sm:px-3 pb-2 sm:pb-3">
          <h3 className="font-semibold text-black md:truncate text-sm sm:text-base">{nft.metadata.name}</h3>
          {/* <p className="text-sm text-black">Token ID: {nft.token_id}</p> */}
          {/* {nft.metadata.description && (
            <p className="text-xs text-black line-clamp-2">
              {nft.metadata.description}
            </p>
          )} */}
        </div>
      </motion.div>
      
      {/* Modal for viewing image or GLB */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 flex gap-1 sm:gap-2">
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
              className="flex items-center justify-center p-2 bg-black text-white hover:bg-white hover:text-black border border-white transition-colors"
            >
              <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
              className="flex items-center justify-center p-2 bg-black text-white hover:bg-white hover:text-black border border-white transition-colors"
            >
              <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); handleDownload(e); }}
              className="flex items-center justify-center p-2 bg-black text-white hover:bg-white hover:text-black border border-white transition-colors"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="flex items-center justify-center p-2 bg-white text-black hover:bg-black hover:text-white border border-black transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          {show3D ? (
            <div style={{ width: 480, height: 480, background: '#ddd', borderRadius: 12 }}>
              <GLBViewer modelPath={glbPath} backgroundColor="#dddddd" />
            </div>
          ) : (
            <img
              src={downloadFormat === 'Pixel Art' ? pixelArtImages[`../assets/images/picsart/${nft.token_id}.png`] : nft.metadata.image_url}
              alt={nft.metadata.name}
              style={{ transform: `scale(${zoom})`, maxHeight: '80vh', maxWidth: '90vw', transition: 'transform 0.2s' }}
              className="shadow-2xl border-4 border-white"
            />
          )}
        </div>
      )}
    </>
  );
};
