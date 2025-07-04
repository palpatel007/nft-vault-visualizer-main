import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WalletButton } from './WalletButton';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <motion.header
      className="bg-white border border-black p-4 sm:p-6 mb-4 sm:mb-8 shadow"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <motion.div
            className="w-8 h-8 sm:w-12 sm:h-12 bg-black flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-white font-bold text-sm sm:text-xl">
              <img src="/1_1.jpg" alt="Alpha Lions" className="w-8 h-8 sm:w-12 sm:h-12" />
            </span>
          </motion.div>
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
              Alpha Lions Hub
            </h1>
            <p className="text-black text-xs sm:text-sm">
              Get your Alpha Lions Assets
            </p>
          </div>
        </div>
        <div className="hidden sm:block">
          <WalletButton />
        </div>
      </div>
    </motion.header>
  );
};
