import React from 'react';

export default function Login() {
  const connectWallet = async () => {
    try {
      await window.pontem.connect();
      localStorage.setItem('isConnected', true);
      window.location.reload();
    } catch (error) {
      console.error('Error connecting or fetching balance:', error);
    }
  };

  return (
    <div className="h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      
      {/* Background decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Login container */}
      <div className="relative z-10 bg-gray-900 p-8 rounded-2xl border border-gray-800 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-indigo-500 rounded-lg"></div>
          <h1 className="text-3xl font-bold text-white">BillRewards</h1>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-3">Welcome Back</h2>
          <p className="text-gray-400">Connect your wallet to access your rewards</p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <svg 
                className="w-5 h-5 text-indigo-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-medium">Pontem Wallet</h3>
              <p className="text-sm text-gray-400">Connect to continue</p>
            </div>
          </div>
        </div>

        <button 
          onClick={connectWallet}
          className="w-full bg-indigo-500 hover:bg-indigo-600 py-4 rounded-xl transition-all duration-300 font-medium text-lg flex items-center justify-center gap-2"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Connect Wallet
        </button>

        <p className="text-center mt-6 text-gray-400 text-sm">
          By connecting, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}