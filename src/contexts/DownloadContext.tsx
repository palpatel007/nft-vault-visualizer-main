
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DownloadFormat = 'JPL' | '4K' | '2K';

interface DownloadContextType {
  selectedFormat: DownloadFormat;
  setSelectedFormat: (format: DownloadFormat) => void;
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined);

export const DownloadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>('4K');

  return (
    <DownloadContext.Provider value={{ selectedFormat, setSelectedFormat }}>
      {children}
    </DownloadContext.Provider>
  );
};

export const useDownload = () => {
  const context = useContext(DownloadContext);
  if (context === undefined) {
    throw new Error('useDownload must be used within a DownloadProvider');
  }
  return context;
};
