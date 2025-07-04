import { motion } from 'framer-motion';

interface SidebarProps {
  onFormatChange: (format: string) => void;
  selectedFormat: string;
}

const formatDescriptions: Record<string, string> = {
  PFP: 'High Quality PNG (2048×2024)',
  'Pixel Art': 'Pixelated Version of Alpha Lions',
  GLB: 'For Metaverse',
  FBX: 'For Animation',
};

export const Sidebar = ({ onFormatChange, selectedFormat }: SidebarProps) => {
  const formats = ['PFP', 'Pixel Art', 'GLB', 'FBX'];

  return (
    <motion.aside
      className="w-full md:w-64 bg-white border border-black p-4 sm:p-6 h-fit md:sticky md:top-6 shadow"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Download Options */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4 flex items-center gap-2">
            Download Options
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {formats.map((format) => (
              <motion.button
                key={format}
                onClick={() => onFormatChange(format)}
                className={`group w-full text-left px-3 sm:px-4 py-2 sm:py-3 transition-all duration-200 border border-black font-medium text-sm sm:text-base ${
                  selectedFormat === format
                    ? 'bg-[#ff8b00] text-white shadow-lg'
                    : 'bg-white text-black hover:bg-[#ff8b00] hover:text-white'
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <span>{format}</span>
                  {selectedFormat === format && (
                    <motion.div
                      className="w-2 h-2 bg-white border border-black"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    />
                  )}
                </div>
                <div className={`text-xs mt-1 ${selectedFormat === format ? 'text-white' : 'text-black'} group-hover:text-white`}>
                  {formatDescriptions[format]}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};
