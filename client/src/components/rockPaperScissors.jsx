import React, { useState } from "react";
import { CreditCard, Sparkles, Trophy, Swords, DollarSign, RefreshCcw } from "lucide-react";

const RockPaperScissors = () => {
  const choices = ["rock", "paper", "scissors"];
  
  const [yourChoice, setYourChoice] = useState(null);
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [yourScore, setYourScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [betAmount, setBetAmount] = useState(0);
  const [aptosEarned, setAptosEarned] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);

  const startGame = () => {
    if (betAmount <= 0) {
      alert("Please place a bet before starting the game!");
      return;
    }
    setGameStarted(true);
    resetRound();
    setAptosEarned(0);
  };

  const resetRound = () => {
    setYourChoice(null);
    setOpponentChoice(null);
    setRoundComplete(false);
  };

  const selectChoice = (choice) => {
    if (!gameStarted || roundComplete) return;
    
    setYourChoice(choice);
    const opponent = choices[Math.floor(Math.random() * 3)];
    setOpponentChoice(opponent);
    
    let newYourScore = yourScore;
    let newOpponentScore = opponentScore;
    let roundEarnings = 0;
    
    if (choice === opponent) {
      // Tie - return bet amount
      roundEarnings = parseFloat(betAmount);
    } else {
      if (
        (choice === "rock" && opponent === "scissors") ||
        (choice === "scissors" && opponent === "paper") ||
        (choice === "paper" && opponent === "rock")
      ) {
        // Win - double bet amount
        newYourScore += 1;
        roundEarnings = parseFloat(betAmount) * 2;
      } else {
        // Lose - lose bet amount
        newOpponentScore += 1;
        roundEarnings = 0;
      }
    }

    setYourScore(newYourScore);
    setOpponentScore(newOpponentScore);
    setAptosEarned(roundEarnings);
    setRoundComplete(true);
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto h-full flex flex-col lg:flex-row bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Panel - Game Controls */}
        <div className="w-full lg:w-1/3 bg-gradient-to-b from-gray-800 to-gray-900 p-6">
          <div className="space-y-6">
            {/* Mobile Title */}
            <div className="lg:hidden text-center mb-6">
              <h1 className="text-3xl font-bold text-blue-400">Rock Paper Scissors</h1>
            </div>

            {/* Betting Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="text-blue-400 w-6 h-6" />
                <h2 className="text-xl font-bold text-blue-400">Place Your Bet</h2>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.00000001"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  placeholder="0"
                  disabled={gameStarted}
                />
                <span className="absolute right-3 top-3 text-blue-400 font-semibold">APT</span>
              </div>
              <button
                onClick={gameStarted ? resetRound : startGame}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2"
              >
                {gameStarted ? (
                  <>
                    <RefreshCcw className="w-5 h-5" />
                    New Round
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Start Game
                  </>
                )}
              </button>
            </div>

            {/* Game Stats */}
            {gameStarted && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="text-yellow-500 w-5 h-5" />
                    <span className="text-yellow-500 font-bold">You: {yourScore}</span>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Swords className="text-red-500 w-5 h-5" />
                    <span className="text-red-500 font-bold">CPU: {opponentScore}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Rewards Section */}
            {roundComplete && (
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">Round Results</h2>
                </div>
                <p className="text-white/80 mb-2">Earnings</p>
                <p className="text-3xl font-bold text-white">{aptosEarned.toFixed(8)} APT</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Game Board */}
        <div className="w-full lg:w-2/3 p-6 flex flex-col">
          {/* Desktop Title */}
          <div className="hidden lg:block mb-6">
            <h1 className="text-4xl font-bold text-blue-400 text-center">Rock Paper Scissors</h1>
          </div>

          {/* Game Board */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Choices Grid */}
            <div className="grid grid-cols-3 gap-6 mb-12 w-full max-w-2xl">
              {choices.map((choice) => (
                <div
                  key={choice}
                  className={`relative aspect-square rounded-xl overflow-hidden ${
                    gameStarted ? "cursor-pointer hover:scale-105" : "opacity-50"
                  } transition-all duration-200`}
                  onClick={() => selectChoice(choice)}
                >
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <img
                      src={`/api/placeholder/120/120`}
                      alt={choice}
                      className="w-3/4 h-3/4 object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Results Display */}
            {(yourChoice || opponentChoice) && (
              <div className="grid grid-cols-2 gap-12 w-full max-w-2xl">
                <div className="space-y-4 text-center">
                  <h3 className="text-xl font-bold text-blue-400">Your Choice</h3>
                  <div className="aspect-square rounded-xl bg-gray-800 flex items-center justify-center">
                    {yourChoice && (
                      <img
                        src={`/api/placeholder/120/120`}
                        alt={yourChoice}
                        className="w-3/4 h-3/4 object-contain"
                      />
                    )}
                  </div>
                </div>
                <div className="space-y-4 text-center">
                  <h3 className="text-xl font-bold text-red-400">CPU's Choice</h3>
                  <div className="aspect-square rounded-xl bg-gray-800 flex items-center justify-center">
                    {opponentChoice && (
                      <img
                        src={`/api/placeholder/120/120`}
                        alt={opponentChoice}
                        className="w-3/4 h-3/4 object-contain"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RockPaperScissors;