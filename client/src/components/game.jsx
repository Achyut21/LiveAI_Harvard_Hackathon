import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GAME_CONSTANTS } from '../constants';

export default function Game() {
  const { HEADER, GAMES, INFO_CARD, BUTTONS } = GAME_CONSTANTS;
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
  };

  const handleGameSelect = (gameTitle) => {
    switch(gameTitle) {
      case "Minesweeper":
        navigate('/minesweeper');
        break;
      case "Memory Flip":
        // navigate('/memory-flip'); // Future implementation
        break;
      case "Rock Paper Scissors":
        navigate('/rps'); 
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      
      <div className="relative h-full flex flex-col p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={goBack}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
              aria-label={BUTTONS.BACK}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-lg"></div>
              <h1 className="text-2xl font-bold text-white">{HEADER.TITLE}</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game, index) => (
            <div 
              key={index}
              onClick={() => handleGameSelect(game.title)}
              className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-video mb-4 bg-gray-800 rounded-lg overflow-hidden">
                <img 
                  src="/api/placeholder/400/225" 
                  alt={game.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{game.title}</h3>
                <p className="text-gray-400 text-sm">{game.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-indigo-400 font-medium">{game.points}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGameSelect(game.title);
                    }}
                    className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    {BUTTONS.PLAY_NOW}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-blue-700 rounded-xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-2">{INFO_CARD.TITLE}</h2>
              <p className="text-white/80">{INFO_CARD.DESCRIPTION}</p>
            </div>
            <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-all duration-300">
              {HEADER.LEADERBOARD_BTN}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}