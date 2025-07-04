import React from 'react';
import GLBViewerWithFallback from '../components/GLBViewerWithFallback';

const GLBViewerPage: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GLBViewerWithFallback 
        modelPaths={[
          '/glb/6.glb',
          '/glb/alpha_lion_250.glb'
        ]}
        backgroundColor="#dddddd"
      />
    </div>
  );
};

export default GLBViewerPage; 