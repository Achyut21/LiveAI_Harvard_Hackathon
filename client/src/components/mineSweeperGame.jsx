import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

// Import images from /assets
import BR3Logo from '../assets/BR3.png';
import mineImg from '../assets/mines.png';

export default function MinesweeperGame() {
  const [gameState, setGameState] = useState({
    // A 5×5 board (25 tiles). Default to all mines.
    board: Array(25).fill('mine'),
    revealed: Array(25).fill(false),
    isGameOver: false,
    isWinner: false,
    stakeAmount: '',
    targetBRCount: '',
    actualBRCount: 0,
    revealedCount: 0,
    isGameStarted: false,
  });

  const [reward, setReward] = useState(0);

  // ---------------------------------------------------------------------------
  // 1) Start / Initialize the game
  // ---------------------------------------------------------------------------
  const initializeGame = () => {
    const { targetBRCount, stakeAmount } = gameState;
    // Validate inputs
    if (!targetBRCount || !stakeAmount || targetBRCount <= 0 || stakeAmount <= 0) {
      return; // do nothing if invalid
    }

    // Create a new board. Everything is "mine" by default.
    const newBoard = Array(25).fill('mine');
    const brCount = parseInt(targetBRCount);

    // Place exactly 'brCount' BR tiles in random positions
    let placed = 0;
    while (placed < brCount) {
      const pos = Math.floor(Math.random() * 25);
      if (newBoard[pos] !== 'br') {
        newBoard[pos] = 'br';
        placed++;
      }
    }

    setGameState((prev) => ({
      ...prev,
      board: newBoard,
      revealed: Array(25).fill(false),
      isGameOver: false,
      isWinner: false,
      revealedCount: 0,
      actualBRCount: brCount,
      isGameStarted: true,
    }));
  };

  // ---------------------------------------------------------------------------
  // 2) Auto-calculate reward whenever stake / targetBRCount changes
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const { stakeAmount, targetBRCount } = gameState;
    if (stakeAmount && targetBRCount) {
      const multiplier = 1 + parseInt(targetBRCount) * 0.5;
      setReward(parseFloat(stakeAmount) * multiplier);
    } else {
      setReward(0);
    }
  }, [gameState.stakeAmount, gameState.targetBRCount]);

  // ---------------------------------------------------------------------------
  // 3) Handle tile click
  // ---------------------------------------------------------------------------
  const handleTileClick = (index) => {
    const { board, revealed, isGameStarted, isGameOver, targetBRCount } = gameState;
    if (!isGameStarted || isGameOver || revealed[index]) return;

    const newRevealed = [...revealed];
    newRevealed[index] = true; // reveal the tile

    let { isWinner, revealedCount } = gameState;
    let gameOver = isGameOver;
    revealedCount++;

    const clickedTile = board[index];
    if (clickedTile === 'mine') {
      // If user hits a mine → game over, reveal everything
      gameOver = true;
      newRevealed.fill(true);
    } else {
      // If user hits a BR tile, check if all BR tiles are revealed
      const revealedBRCount = board.reduce((count, val, i) => {
        return count + (val === 'br' && newRevealed[i] ? 1 : 0);
      }, 0);

      if (revealedBRCount === parseInt(targetBRCount)) {
        // user revealed all br tiles => they win
        isWinner = true;
        gameOver = true;
        newRevealed.fill(true);
      }
    }

    setGameState((prev) => ({
      ...prev,
      revealed: newRevealed,
      isGameOver: gameOver,
      isWinner,
      revealedCount,
    }));
  };

  // (Optional) goBack function if you have a different route
  const goBack = () => {
    window.location.href = '/game';
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Optional background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

      <div className="relative flex flex-col p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={goBack}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Minesweeper Stakes</h1>
        </div>

        {/* Game Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Stake Amount */}
          <div className="bg-gray-900 p-6 rounded-xl">
            <label className="block mb-2 text-gray-400">Stake Amount (APT)</label>
            <input
              type="number"
              value={gameState.stakeAmount}
              onChange={(e) =>
                setGameState((prev) => ({ ...prev, stakeAmount: e.target.value }))
              }
              className="w-full bg-gray-800 rounded-lg p-3 text-white"
              placeholder="Enter stake amount"
              min="1"
              disabled={gameState.isGameStarted}
            />
          </div>
          {/* BR Tiles */}
          <div className="bg-gray-900 p-6 rounded-xl">
            <label className="block mb-2 text-gray-400">Number of BR Tiles</label>
            <input
              type="number"
              value={gameState.targetBRCount}
              onChange={(e) =>
                setGameState((prev) => ({ ...prev, targetBRCount: e.target.value }))
              }
              className="w-full bg-gray-800 rounded-lg p-3 text-white"
              placeholder="Enter number of BR tiles"
              min="1"
              max="25"
              disabled={gameState.isGameStarted}
            />
          </div>
        </div>

        {/* Potential Reward */}
        <div className="bg-indigo-500/20 p-6 rounded-xl mb-8">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Potential Reward:</span>
            <span className="text-indigo-400 text-2xl font-bold">
              {reward.toFixed(2)} APT
            </span>
          </div>
        </div>

        {/* Game Board: always 5 x 5 => no breakpoints => 25 tiles total */}
        <div className="grid grid-cols-5 gap-2 w-fit mx-auto mb-8">
          {gameState.board.map((tileVal, idx) => {
            const isRevealed = gameState.revealed[idx];
            // Crisp Indigo color scheme:
            // - covered tile => solid "bg-indigo-500" + hover
            // - revealed tile => a border + lighter background
            return (
              <button
                key={idx}
                onClick={() => handleTileClick(idx)}
                disabled={!gameState.isGameStarted || isRevealed}
                className={`w-16 h-16 flex items-center justify-center
                  transition-all duration-200 rounded-md
                  ${
                    isRevealed
                      ? 'border-2 border-indigo-300 bg-indigo-200'
                      : 'bg-indigo-500 hover:bg-indigo-400'
                  }
                `}
              >
                {/* If revealed, show BR or Mine */}
                {isRevealed && (
                  tileVal === 'br' ? (
                    <img
                      src={BR3Logo}
                      alt="BR Tile"
                      className="w-2/3 h-2/3 object-contain"
                    />
                  ) : (
                    <img
                      src={mineImg}
                      alt="Mine"
                      className="w-2/3 h-2/3 object-contain"
                    />
                  )
                )}
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={initializeGame}
            disabled={
              !gameState.stakeAmount || !gameState.targetBRCount || gameState.isGameStarted
            }
            className="bg-indigo-500 hover:bg-indigo-600 px-6 py-3 rounded-lg
                       transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start New Game
          </button>

          {gameState.isGameStarted && !gameState.isGameOver && (
            <button
              onClick={() => setGameState((prev) => ({ ...prev, isGameStarted: false }))}
              className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg transition-all duration-300"
            >
              Reset Game
            </button>
          )}
        </div>

        {/* Game Over Modal */}
        {gameState.isGameOver && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">
                {gameState.isWinner ? 'Congratulations!' : 'Game Over!'}
              </h2>
              <p className="text-gray-400 mb-6">
                {gameState.isWinner
                  ? `You won ${reward.toFixed(2)} APT!`
                  : 'Better luck next time!'}
              </p>
              <button
                onClick={() =>
                  setGameState((prev) => ({
                    ...prev,
                    isGameStarted: false,
                    isGameOver: false,
                    isWinner: false,
                    board: Array(25).fill('mine'), // default to all mines again
                    revealed: Array(25).fill(false),
                    revealedCount: 0,
                  }))
                }
                className="w-full bg-indigo-500 hover:bg-indigo-600 py-3 rounded-lg 
                           transition-all duration-300"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
