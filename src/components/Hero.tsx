import React from 'react';

// Mock Logo3D component
const Logo3D = ({ className }) => (
  <div className={`bg-gradient-to-br from-purple-600 via-violet-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl ${className}`}>
    <div className="text-white font-bold text-4xl">G</div>
  </div>
);

// Mock SearchBar component
const SearchBar = () => (
  <div className="max-w-2xl mx-auto">
    <div className="relative">
      <input
        type="text"
        placeholder="What would you like to create today?"
        className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 shadow-lg"
      />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-lg text-sm font-medium">
          /
        </div>
      </div>
    </div>
  </div>
);

// Simple motion replacement for basic animations
const motion = {
  div: ({ children, initial, animate, transition, className, ...props }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    
    React.useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), transition?.delay ? transition.delay * 1000 : 0);
      return () => clearTimeout(timer);
    }, [transition?.delay]);

    return (
      <div 
        className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-95'
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  },
  h1: ({ children, initial, animate, transition, className, ...props }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    
    React.useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), transition?.delay ? transition.delay * 1000 : 0);
      return () => clearTimeout(timer);
    }, [transition?.delay]);

    return (
      <h1 
        className={`transition-all duration-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        } ${className}`}
        {...props}
      >
        {children}
      </h1>
    );
  },
  p: ({ children, initial, animate, transition, className, ...props }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    
    React.useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), transition?.delay ? transition.delay * 1000 : 0);
      return () => clearTimeout(timer);
    }, [transition?.delay]);

    return (
      <p 
        className={`transition-all duration-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        } ${className}`}
        {...props}
      >
        {children}
      </p>
    );
  }
};

const Hero = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-purple-50 to-white pt-32 pb-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2 }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-purple-100 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-64 -left-24 w-72 h-72 bg-teal-100 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2, delay: 1 }}
          className="absolute bottom-12 right-12 w-64 h-64 bg-pink-100 rounded-full blur-3xl"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="mb-12 flex justify-center"
          >
            <Logo3D className="w-40 h-40" />
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-700 via-violet-600 to-pink-600 bg-clip-text text-transparent"
          >
            GenWorks
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
          >
            Your AI-Powered Creative Development Ecosystem
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-16"
          >
            <SearchBar />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-sm text-gray-500"
          >
            Press '/' to start or explore our ecosystem
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;``