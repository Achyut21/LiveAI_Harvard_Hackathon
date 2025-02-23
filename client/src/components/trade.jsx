import React, { useState, useEffect } from 'react';
import { Coins, ArrowDown, RefreshCcw, Check } from 'lucide-react';

export default function Trade() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [magicAPTAmount, setMagicAPTAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const conversionRate = 50; // 1 APT = 50 Magic APT

  // Fetch the user's account and balance from the Aptos fullnode
  const fetchAccountAndBalance = async () => {
    try {
      if (window.pontem) {
        const accountAddress = await window.pontem.account();
        const balanceResponse = await fetch(
          `https://fullnode.testnet.aptoslabs.com/v1/accounts/${accountAddress}/resource/0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`
        );
        const balanceData = await balanceResponse.json();
        setAccount(accountAddress);
        setBalance(balanceData.data.coin.value / 100000000);
      }
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };

  // When the component mounts, poll for window.pontem and fetch account details once available
  useEffect(() => {
    let mounted = true;
    const intervalId = setInterval(() => {
      if (window.pontem) {
        clearInterval(intervalId);
        if (mounted) {
          fetchAccountAndBalance();
        }
      }
    }, 100);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // Handle the trade: submit the transaction, update balance and backend Magic APT
  const handleTrade = async () => {
    if (!magicAPTAmount || isProcessing) return;
    setIsProcessing(true);
    try {
      const aptAmount = Number(magicAPTAmount);
      if (isNaN(aptAmount) || aptAmount <= 0) {
        console.error("Invalid APT amount");
        setIsProcessing(false);
        return;
      }
      // Convert APT to its smallest unit (1 APT = 100,000,000 units)
      const aptAmountInSmallestUnit = Math.floor(aptAmount * 100000000);

      const tx = {
        function: '0x1::coin::transfer',
        type_arguments: ['0x1::aptos_coin::AptosCoin'],
        arguments: [
          '0x7f27217edd1851d0d8d1c785d04c1e3f21c5bc945a000c3e2f638fdbde18f6e6', // recipient address
          aptAmountInSmallestUnit.toString()
        ]
      };

      // Sign and submit the transaction via the Pontem wallet
      const result = await window.pontem.signAndSubmit(tx);
      console.log("Transaction result:", result);

      // Optionally wait for confirmation/delay before proceeding
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Refresh the on-chain balance after the trade
      await fetchAccountAndBalance();

      // Update the user's Magic APT balance on your backend
      await getUser();

      setSuccessMessage('Successfully purchased Magic APT!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setMagicAPTAmount('');
    } catch (error) {
      console.error('Trade failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Get the current user data from your backend and then update the Magic APT balance
  const getUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/user/get_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: account }),
      });
      const data = await response.json();
      await updateUser(data.magicAPT);
    } catch (error) {
      console.error("Error getting user:", error);
    }
  };

  // Update the user's Magic APT by adding the purchased amount to their current balance
  const updateUser = async (currentMagicAPT) => {
    try {
      const currentMagicAPTNum = Number(currentMagicAPT) || 0;
      const additionalMagicAPT = Number(magicAPTAmount) * conversionRate;
      const newMagicAPT = currentMagicAPTNum + additionalMagicAPT;
      const response = await fetch("http://localhost:3000/user/update_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: account, magicAPT: newMagicAPT.toString() }),
      });
      const data = await response.json();
      console.log("Update user response:", data);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="h-screen bg-black text-white relative overflow-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="relative h-full flex flex-col p-6 pb-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg"></div>
            <h1 className="text-2xl font-bold text-white">Magic APT Exchange</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Your Balance</p>
            <p className="text-xl font-bold">{balance} APT</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Buy Magic APT</h2>
              <p className="text-gray-400">Exchange your APT for Magic APT</p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-400">From</p>
                    <p className="text-lg font-bold">APT</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Available: {balance} APT
                  </p>
                </div>
                <input
                  type="number"
                  value={magicAPTAmount}
                  onChange={(e) => setMagicAPTAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-transparent text-2xl font-bold outline-none"
                />
              </div>

              <div className="flex justify-center">
                <div className="bg-indigo-500 rounded-full p-2">
                  <ArrowDown size={24} />
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-400">To</p>
                    <p className="text-lg font-bold">Magic APT</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins className="text-yellow-400" size={20} />
                    <p className="text-lg font-bold">
                      {magicAPTAmount ? (Number(magicAPTAmount) * conversionRate).toFixed(2) : '0.0'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  Rate: 1 APT = {conversionRate} Magic APT
                </p>
              </div>

              {successMessage && (
                <div className="bg-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-2">
                  <Check size={20} />
                  <p>{successMessage}</p>
                </div>
              )}

              <button
                onClick={handleTrade}
                disabled={!magicAPTAmount || isProcessing}
                className={`w-full py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  magicAPTAmount && !isProcessing
                    ? 'bg-indigo-500 hover:bg-indigo-600'
                    : 'bg-gray-700 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCcw className="animate-spin" size={20} />
                    <span>Processing...</span>
                  </>
                ) : (
                  'Buy Magic APT'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
