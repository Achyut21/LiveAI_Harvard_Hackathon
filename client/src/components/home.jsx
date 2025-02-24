import React, { useState, useEffect, useRef } from "react";
import { Check, Copy, Coins, Upload, X } from "lucide-react";
import Tesseract from "tesseract.js";
import { MessageCircle } from "lucide-react";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [magicAPT, setMagicAPT] = useState(null);
  const [bills, setBills] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedBillType, setSelectedBillType] = useState("");

  useEffect(() => {
    let mounted = true;
    const intervalId = setInterval(() => {
      if (window.pontem) {
        clearInterval(intervalId);
        fetchAccountAndBalance();
      }
    }, 100);

    async function fetchAccountAndBalance() {
      try {
        const accountAddress = await window.pontem.account();
        const balanceResponse = await fetch(
          `https://fullnode.testnet.aptoslabs.com/v1/accounts/${accountAddress}/resource/0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`
        );
        const balanceData = await balanceResponse.json();

        if (mounted) {
          setAccount(accountAddress);
          get_details(accountAddress);
          get_bills(accountAddress);
          setBalance(balanceData.data.coin.value / 100000000);
        }
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    }

    return () => {
      mounted = false;
      clearInterval(intervalId);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const get_details = async (address) => {
    const response = await fetch("http://localhost:3000/user/get_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });
    const data = await response.json();
    setMagicAPT(data.magicAPT);
  };

  const get_bills = async (address) => {
    const response = await fetch("http://localhost:3000/user/get_bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });
    const data = await response.json();
    setBills(data);
  };

  const update_user = async (address, magicAPT) => {
    console.log(address, magicAPT);
    const response = await fetch("http://localhost:3000/user/update_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, magicAPT }),
    });
    const data = await response.json();
    setMagicAPT(data.magicAPT);
  };

  const add_bill = async (address, billLink) => {
    const response = await fetch("http://localhost:3000/user/add_bill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, billLink }),
    });
    const data = await response.json();
    setBills(data);
  };

  // OCR extraction function to extract both amount and date from the bill image
  const extractBillData = async (imageFile) => {
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(imageFile, "eng", {
        logger: (m) => console.log(m),
      });

      // Split text into lines for easier processing
      const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

      // Extract amount: look for a line containing "total" (ignoring case)
      let targetLine = lines.find((line) => /total/i.test(line));
      if (!targetLine && lines.length > 0) {
        targetLine = lines[lines.length - 1];
      }
      const amountRegex = /\$?(\d+(\.\d{1,2})?)/;
      let amountMatch = targetLine ? targetLine.match(amountRegex) : null;
      if (!amountMatch) {
        const allMatches = [...text.matchAll(amountRegex)];
        if (allMatches.length > 0) {
          amountMatch = allMatches[allMatches.length - 1];
        }
      }
      const amount = amountMatch ? amountMatch[1] : null;

      // Extract date: try to find a line containing "date" (ignoring case)
      // then match a common date format (e.g., MM/DD/YYYY, DD-MM-YYYY, etc.)
      const dateRegex = /\b(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})\b/;
      let targetDateLine = lines.find((line) => /date/i.test(line));
      let date = null;
      if (targetDateLine) {
        const dateMatch = targetDateLine.match(dateRegex);
        if (dateMatch) {
          date = dateMatch[1];
        }
      }
      // Fallback: search the entire text for a date
      if (!date) {
        const dateMatch = text.match(dateRegex);
        date = dateMatch ? dateMatch[1] : null;
      }
      return { amount, date };
    } catch (error) {
      console.error("OCR extraction error:", error);
      return { amount: null, date: null };
    }
  };

  // Helper function to calculate loyalty points based on amount and date
  const calculateLoyaltyPoints = (amount, date) => {
    if (!amount || !date) return 0;
    const amt = parseFloat(amount);
    let multiplier = 10;
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate)) {
      const day = parsedDate.getDay();
      if (day === 0 || day === 6) {
        multiplier *= 1.2;
      }
    }
    return Math.floor(amt * multiplier);
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);

      const { amount, date } = await extractBillData(file);
      const points = calculateLoyaltyPoints(amount, date);
      console.log("Calculated Loyalty Points:", points);
      setLoyaltyPoints(points);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;
    setIsUploading(true);
    try {
      const response = await fetch("http://localhost:3000/user/add_bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: account,
          magicAPTEarned: loyaltyPoints,
          merchant: selectedBillType,
        }),
      });

      const data = await response.json();
      console.log("Upload response:", data);
      if (data != null) {
        const num = parseInt(magicAPT, 10);
        const num1 = parseInt(loyaltyPoints, 10);
        await update_user(account, String(num + num1));
        await get_bills(account);
        clearSelectedImage();
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setLoyaltyPoints(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      await window.pontem.disconnect();
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  const gotoGame = () => {
    window.location.href = "/game";
  };

  const gotoTrade = () => {
    window.location.href = "/trade";
  };

  const gotoChat = () => {
    window.location.href = "/chat";
  };

  return (
    <div className="h-screen bg-black text-white relative overflow-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="relative h-full flex flex-col p-6 pb-24 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg"></div>
            <h1 className="text-2xl font-bold text-white">BillRewards</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right relative">
              <p className="text-sm text-gray-400">Wallet</p>
              <div className="flex items-center gap-2">
                <p className="text-white/90">
                  {account
                    ? `${account.slice(0, 6)}...${account.slice(-4)}`
                    : "Loading..."}
                </p>
                {account && (
                  <button
                    onClick={handleCopyAddress}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    title="Copy address"
                  >
                    {copySuccess ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={gotoChat}
              className="text-gray-400 hover:text-white transition-colors duration-200"
              title="Open Chat"
            >
              <MessageCircle size={24} />
            </button>
            <button
              onClick={disConnectWallet}
              className="bg-indigo-500 hover:bg-indigo-600 px-6 py-2 rounded-lg transition-all duration-300"
            >
              Disconnect
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 mb-2">Total Balance</p>
            <p className="text-3xl font-bold text-white">
              {balance || "0"} APT
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 mb-2">Bills Uploaded</p>
            <p className="text-3xl font-bold text-white">{bills.length}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 mb-2">Rewards Redeemed</p>
            <p className="text-3xl font-bold text-white">5</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 flex-1">
          <div
            className="bg-gray-900 rounded-xl p-6 transition-all duration-300"
            onMouseEnter={() => setActiveCard("upload")}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">
                Upload Bills
              </h2>
              <p className="text-gray-400">Upload bills to earn points</p>
            </div>
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 relative ${
                  activeCard === "upload"
                    ? "border-indigo-500 bg-indigo-500/5"
                    : "border-gray-800"
                }`}
              >
                <input
                  type="file"
                  className="hidden"
                  id="bill-upload"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                />
                {!previewUrl ? (
                  <label
                    htmlFor="bill-upload"
                    className="cursor-pointer text-gray-400 hover:text-white flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 mb-3" />
                    <span>Drop your bill here or click to browse</span>
                  </label>
                ) : (
                  <div className="relative mb-6">
                    <img
                      src={previewUrl}
                      alt="Bill preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <button
                      onClick={clearSelectedImage}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
              <select
                value={selectedBillType}
                onChange={(e) => setSelectedBillType(e.target.value)}
                className={`w-full py-3 px-4 rounded-lg bg-gray-800 text-white border ${
                  selectedBillType ? "border-indigo-500" : "border-gray-700"
                } focus:outline-none focus:border-indigo-500 transition-all duration-300`}
              >
                <option value="" className="text-gray-400">
                  Select Merchant
                </option>
                <option value="amazon" className="flex items-center">
                  🛒 Amazon
                </option>
                <option value="walmart" className="flex items-center">
                  🏪 Costco
                </option>
                <option value="target" className="flex items-center">
                  🎯 Target
                </option>
              </select>
              <button
                onClick={handleUpload}
                disabled={!selectedImage || isUploading || loyaltyPoints === null}
                className={`w-full py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedImage && loyaltyPoints !== null
                    ? "bg-indigo-500 hover:bg-indigo-600"
                    : "bg-gray-700 cursor-not-allowed"
                } ${isUploading ? "animate-pulse" : ""}`}
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    <span>Upload Bill</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">
                Available Rewards Balance
              </h2>
              <p className="text-white/80">Current Balance</p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Coins className="w-8 h-8 text-yellow-400" />
                <div className="text-5xl font-bold">
                  {magicAPT || "0"} Magic APT
                </div>
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
                    style={{
                      width: `${Math.min((balance || 0) / 10, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
              {/* Updated container with two buttons one below the other */}
              <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-lg flex flex-col gap-4">
                <button
                  onClick={gotoGame}
                  className="w-full text-sm font-medium text-white text-center"
                >
                  🎮 Play more fun games to earn more points!
                </button>
              </div>
              <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-lg flex flex-col gap-4">
              <button
                  onClick={gotoTrade}
                  className="w-full text-sm font-medium text-white text-center"
                >
                  🔄 Trade Aptos to Magic Aptos
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">
                Redeem Rewards
              </h2>
              <p className="text-gray-400">
                Available rewards in Tier-1
              </p>
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
