import React, { useState } from 'react';
import GLBViewer from './GLBViewer';

interface GLBViewerWithFallbackProps {
  modelPaths: string[];
  backgroundColor?: string;
  className?: string;
}

const GLBViewerWithFallback: React.FC<GLBViewerWithFallbackProps> = ({ 
  modelPaths, 
  backgroundColor = '#dddddd',
  className = ''
}) => {
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: any) => {
    console.error('Model failed to load:', error);
    setError(`Failed to load model: ${modelPaths[currentModelIndex]}`);
    
    // Try next model if available
    if (currentModelIndex < modelPaths.length - 1) {
      setTimeout(() => {
        setCurrentModelIndex(prev => prev + 1);
        setError(null);
      }, 2000);
    }
  };

  const handleSuccess = () => {
    setError(null);
  };

  if (currentModelIndex >= modelPaths.length) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height: '100vh' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Valid Models Found</h2>
          <p className="text-gray-600 mb-4">
            All provided GLB files appear to be corrupted or invalid.
          </p>
          <button 
            onClick={() => {
              setCurrentModelIndex(0);
              setError(null);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {error && (
        <div className="absolute top-4 left-4 right-4 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          {currentModelIndex < modelPaths.length - 1 && (
            <span className="ml-2">Trying next model...</span>
          )}
        </div>
      )}
      
      <div className="absolute top-4 right-4 z-10 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
        <strong>Model:</strong> {modelPaths[currentModelIndex].split('/').pop()}
        <span className="ml-2">({currentModelIndex + 1}/{modelPaths.length})</span>
      </div>
      
      <GLBViewer 
        modelPath={modelPaths[currentModelIndex]}
        backgroundColor={backgroundColor}
        onError={handleError}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default GLBViewerWithFallback; 