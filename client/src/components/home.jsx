import React, { useState, useEffect } from "react";
import { Check, Copy, Coins } from "lucide-react";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    const intervalId = setInterval(() => {
      if (window.pontem) {
        clearInterval(intervalId);
        fetchAccountAndBalance();
      }
    }, 50);

    async function fetchAccountAndBalance() {
      try {
        const accountAddress = await window.pontem.account();
        const balanceResponse = await fetch(
          `https://fullnode.testnet.aptoslabs.com/v1/accounts/${accountAddress}/resource/0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`
        );
        const balanceData = await balanceResponse.json();

        if (mounted) {
          setAccount(accountAddress);
          setBalance(balanceData.data.coin.value / 100000000);
        }
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    }

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);


  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => setIsUploading(false), 2000);
  };

  const handleCopyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const disConnectWallet = async () => {
    try {
      await window.pontem.connect();
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  const gotoGame = () => {
    window.location.href = '/game';
  };

  return (
    <div className="h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="relative h-full flex flex-col p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg"></div>
            <h1 className="text-2xl font-bold text-white">BillRewards</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right relative">
              <p className="text-sm text-gray-400">Wallet</p>
              <div className="flex items-center gap-2">
                <p className="text-white/90">{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Loading...'}</p>
                {account && (
                  <button
                    onClick={handleCopyAddress}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    title="Copy address"
                  >
                    {copySuccess ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                )}
              </div>
            </div>
            <button onClick={disConnectWallet} className="bg-indigo-500 hover:bg-indigo-600 px-6 py-2 rounded-lg transition-all duration-300">
              Disconnect
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 mb-2">Total Balance</p>
            <p className="text-3xl font-bold text-white">{balance || "0"} APT</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 mb-2">Bills Uploaded</p>
            <p className="text-3xl font-bold text-white">24</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 mb-2">Rewards Redeemed</p>
            <p className="text-3xl font-bold text-white">5</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 flex-1">
          <div 
            className="bg-gray-900 rounded-xl p-6 transition-all duration-300"
            onMouseEnter={() => setActiveCard('upload')}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Upload Bills</h2>
              <p className="text-gray-400">Upload bills to earn points</p>
            </div>
            <div className="space-y-4">
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                activeCard === 'upload' ? 'border-indigo-500 bg-indigo-500/5' : 'border-gray-800'
              }`}>
                <input type="file" className="hidden" id="bill-upload" />
                <label
                  htmlFor="bill-upload"
                  className="cursor-pointer text-gray-400 hover:text-white flex flex-col items-center"
                >
                  <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Drop your bill here
                </label>
              </div>
              <button
                onClick={handleUpload}
                className={`w-full bg-indigo-500 hover:bg-indigo-600 py-3 rounded-lg transition-all duration-300 ${
                  isUploading ? 'animate-pulse' : ''
                }`}
              >
                {isUploading ? "Processing..." : "Upload Bill"}
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Available Rewards Balance</h2>
              <p className="text-white/80">Current Balance</p>
            </div>
            <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Coins className="w-8 h-8 text-yellow-400" />
              <div className="text-5xl font-bold">{balance || "0"} Magic APT</div>
            </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/80">Progress to next tier</span>
                  <span className="text-white">
                    {Math.min((balance || 0) / 10, 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{ width: `${Math.min((balance || 0) / 10, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-lg">
                <button onClick={gotoGame} className="text-sm font-medium text-white text-center">
                  🎮 Play more fun games to earn more points!
                </button>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Redeem Rewards</h2>
              <p className="text-gray-400">Available rewards in Tier-1</p>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="font-bold text-lg">$10 Shopping Coupon</p>
                    <p className="text-gray-400 text-sm">30 days validity</p>
                  </div>
                  <span className="text-indigo-400 font-bold">200 APT</span>
                </div>
                <button className="w-full bg-indigo-500 hover:bg-indigo-600 py-2 rounded-lg transition-all duration-300">
                  Redeem Now
                </button>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="font-bold text-lg">$25 Shopping Coupon</p>
                    <p className="text-gray-400 text-sm">60 days validity</p>
                  </div>
                  <span className="text-indigo-400 font-bold">450 APT</span>
                </div>
                <button className="w-full bg-indigo-500 hover:bg-indigo-600 py-2 rounded-lg transition-all duration-300">
                  Redeem Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}