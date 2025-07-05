import React, { useState, useEffect } from 'react';
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
const pixelArtImages = import.meta.glob('../assets/images/picsart/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

// Import all FBX files as URLs
const fbxFiles = import.meta.glob('../assets/images/fbx_output/*.fbx', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

// Import all GLB files as URLs
const glbFiles = import.meta.glob('../assets/images/glb/*.glb', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

// Skeleton loading component
const ImageSkeleton = () => (
  <div className="w-full h-48 sm:h-56 lg:h-64 bg-gray-200 animate-pulse rounded-lg">
    <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
  </div>
);

export const NFTCard: React.FC<NFTCardProps> = ({ nft, index, downloadFormat, showGLB }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const cleanTokenId = String(nft.token_id).replace(/^0+/, '').trim();
  const glbUrl = glbFiles[`../assets/images/glb/${cleanTokenId}.glb`];
  const glbPath = glbUrl; // Use the actual imported URL directly

  // Check if 3D models are available for this token
  const hasGLB = !!glbFiles[`../assets/images/glb/${cleanTokenId}.glb`];
  const hasFBX = !!fbxFiles[`../assets/images/fbx_output/${cleanTokenId}.fbx`];

  // Get the correct image source
  const getImageSrc = () => {
    if (downloadFormat === 'Pixel Art') {
      return pixelArtImages[`../assets/images/picsart/${nft.token_id}.png`];
    }
    return nft.metadata.image_url;
  };

  const imageSrc = getImageSrc();

  // Handle image load events
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Reset loading state when image source changes
  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
  }, [imageSrc]);

  const show3D = downloadFormat === 'GLB' || downloadFormat === 'FBX';

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (downloadFormat === 'GLB') {
        const glbUrl = glbFiles[`../assets/images/glb/${cleanTokenId}.glb`];
        if (!glbUrl) {
          toast.error('GLB file not found for this token.');
          return;
        }
        const response = await fetch(glbUrl);
        if (!response.ok) {
          toast.error('GLB file not found for this token.');
          return;
        }
        const blob = await response.blob();
        
        if (blob.size === 0) {
          toast.error('No 3D model available.');
          return;
        }
        
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${nft.metadata.name || 'nft-model'}.glb`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
        toast.success(`Download started for ${nft.metadata.name} GLB!`);
      } else if (downloadFormat === 'FBX') {
        const fbxUrl = fbxFiles[`../assets/images/fbx_output/${cleanTokenId}.fbx`];
        if (!fbxUrl) {
          toast.error('FBX file not found for this token.');
          return;
        }
        const response = await fetch(fbxUrl);
        if (!response.ok) {
          toast.error('FBX file not found for this token.');
          return;
        }
        const blob = await response.blob();
        
        if (blob.size === 0) {
          toast.error('FBX file is empty for this token. No 3D model available.');
          return;
        }
        
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

        }
      }
    } catch (error) {
      toast.error('Failed to download file.');
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
              {downloadFormat === 'GLB' ? (
                hasGLB ? (
                  <GLBViewer modelPath={glbPath} backgroundColor="#dddddd" />
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ddd',
                    color: '#666',
                    fontSize: '14px',
                    textAlign: 'center',
                    padding: '20px'
                  }}>
                    <div>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
                      <div>Coming Soon</div>
                    </div>
                  </div>
                )
              ) : downloadFormat === 'FBX' ? (
                hasFBX ? (
                  <GLBViewer modelPath={glbPath} backgroundColor="#dddddd" />
                ) : (
                  <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg">
                    <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
                        <div className="text-sm font-medium">Coming Soon</div>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ddd',
                  color: '#666',
                  fontSize: '14px',
                  textAlign: 'center',
                  padding: '20px'
                }}>
                  <div>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>❓</div>
                    <div>Unknown 3D Format</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>Please select GLB or FBX</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative w-full h-48 sm:h-56 lg:h-64">
              {/* Skeleton loading */}
              {imageLoading && <ImageSkeleton />}
              
              {/* Error state */}
              {imageError && (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                  <div className="text-center text-gray-500">
                    <div className="text-2xl mb-2">🖼️</div>
                    <div className="text-sm">Image not available</div>
                  </div>
                </div>
              )}
              
              {/* Actual image */}
              <img
                src={imageSrc}
                alt={nft.metadata.name}
                className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                } ${imageError ? 'hidden' : ''}`}
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ 
                  position: imageLoading ? 'absolute' : 'relative',
                  top: 0,
                  left: 0
                }}
              />
            </div>
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
              className={`flex items-center justify-center p-2 sm:p-3 border transition-colors ${
                (downloadFormat === 'GLB' && !hasGLB) || (downloadFormat === 'FBX' && !hasFBX)
                  ? 'bg-gray-400 text-gray-600 border-gray-400 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-white hover:text-black border-black'
              }`}
              whileHover={{ scale: (downloadFormat === 'GLB' && !hasGLB) || (downloadFormat === 'FBX' && !hasFBX) ? 1 : 1.1 }}
              whileTap={{ scale: (downloadFormat === 'GLB' && !hasGLB) || (downloadFormat === 'FBX' && !hasFBX) ? 1 : 0.9 }}
              title={
                (downloadFormat === 'GLB' && !hasGLB) || (downloadFormat === 'FBX' && !hasFBX)
                  ? 'No 3D model available for this token'
                  : 'Download'
              }
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>
        </div>
        <div className="space-y-1 sm:space-y-2 px-2 sm:px-3 pb-2 sm:pb-3">
          <h3 className="font-semibold text-black md:truncate text-sm sm:text-base">{nft.metadata.name}</h3>
          {/* Show 3D model availability indicator */}
          {(downloadFormat === 'GLB' || downloadFormat === 'FBX') && (
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                (downloadFormat === 'GLB' && hasGLB) || (downloadFormat === 'FBX' && hasFBX)
                  ? 'bg-green-500'
                  : 'bg-yellow-500'
              }`}></div>
              <span className="text-xs text-gray-600">
                {(downloadFormat === 'GLB' && hasGLB) || (downloadFormat === 'FBX' && hasFBX)
                  ? '3D Model Available'
                  : 'Coming Soon'}
              </span>
            </div>
          )}
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
              {downloadFormat === 'GLB' ? (
                hasGLB ? (
                  <GLBViewer modelPath={glbPath} backgroundColor="#dddddd" />
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ddd',
                    color: '#666',
                    fontSize: '16px',
                    textAlign: 'center',
                    padding: '40px',
                    borderRadius: '12px'
                  }}>
                    <div>
                      <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
                      <div>Coming Soon</div>
                    </div>
                  </div>
                )
              ) : downloadFormat === 'FBX' ? (
                hasFBX ? (
                  <GLBViewer modelPath={glbPath} backgroundColor="#dddddd" />
                ) : (
                  <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg">
                    <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
                        <div className="text-base font-medium">Coming Soon</div>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ddd',
                  color: '#666',
                  fontSize: '16px',
                  textAlign: 'center',
                  padding: '40px',
                  borderRadius: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
                    <div>Coming Soon</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative" style={{ maxHeight: '80vh', maxWidth: '90vw' }}>
              {/* Skeleton loading for modal */}
              {imageLoading && (
                <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg">
                  <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
                </div>
              )}
              
              {/* Error state for modal */}
              {imageError && (
                <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-lg">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-4">🖼️</div>
                    <div className="text-lg">Image not available</div>
                  </div>
                </div>
              )}
              
              {/* Actual image for modal */}
              <img
                src={imageSrc}
                alt={nft.metadata.name}
                style={{ 
                  transform: `scale(${zoom})`, 
                  maxHeight: '80vh', 
                  maxWidth: '90vw', 
                  transition: 'transform 0.2s',
                  opacity: imageLoading ? 0 : 1,
                  display: imageError ? 'none' : 'block'
                }}
                className="shadow-2xl border-4 border-white"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};
