import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const WalletButton = () => {
  const navigate = useNavigate();
  const wasConnected = useRef(false);

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        // Redirect to dashboard after connect
        useEffect(() => {
          if (!wasConnected.current && connected) {
            navigate('/');
          }
          wasConnected.current = connected;
        }, [connected, navigate]);

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <motion.button
                    onClick={openConnectModal}
                    type="button"
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-black text-white font-medium hover:bg-white hover:text-black border border-black transition-all duration-300 text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Connect Wallet
                  </motion.button>
                );
              }

              if (chain.unsupported) {
                return (
                  <motion.button
                    onClick={openChainModal}
                    type="button"
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Wrong network
                  </motion.button>
                );
              }

              return (
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                  <motion.button
                    onClick={openChainModal}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-black text-white border border-black hover:bg-white hover:text-black transition-colors text-xs sm:text-sm"
                    whileHover={{ scale: 1.02 }}
                  >
                    {chain.hasIcon && (
                      <div className="w-3 h-3 sm:w-4 sm:h-4">
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            className="w-3 h-3 sm:w-4 sm:h-4"
                          />
                        )}
                      </div>
                    )}
                    <span className="font-medium">{chain.name}</span>
                  </motion.button>

                  <motion.button
                    onClick={openAccountModal}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-black text-white border border-black hover:bg-white hover:text-black transition-colors text-xs sm:text-sm"
                    whileHover={{ scale: 1.02 }}
                  >
                    {chain.hasIcon && (
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white flex items-center justify-center text-black text-xs sm:text-sm font-bold border border-black">
                        {account.displayName?.[0]?.toUpperCase() || 'A'}
                      </div>
                    )}
                    <span className="font-medium">{account.displayName}</span>
                  </motion.button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
