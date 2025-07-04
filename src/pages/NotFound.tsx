import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-black">404</h1>
        <p className="text-lg sm:text-xl text-black mb-4 sm:mb-6">Oops! Page not found</p>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
          The page you're looking for doesn't exist.
        </p>
        <a 
          href="/" 
          className="inline-block px-6 py-3 bg-black text-white hover:bg-white hover:text-black border border-black transition-colors text-sm sm:text-base"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
