import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import Login from './components/login';
import Game from './components/game';
import Trade from './components/trade';
import Chat from './components/chat';
import MinesweeperGame from './components/mineSweeperGame';
import RockPaperScissors from './components/rockPaperScissors';

export default function App() {

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    async function checkConnection() {
      try {
        if(localStorage.getItem('isConnected')) {
          setIsConnected(true);
          return;
        }
        const connected = await window.pontem.isConnected();
        setIsConnected(connected);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    } 
    checkConnection();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isConnected === true ? <Home /> : <Login />} />
        <Route path="/game" element={<Game />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/minesweeper" element={<MinesweeperGame />} />
        <Route path="/rps" element={<RockPaperScissors />} />
      </Routes>
    </BrowserRouter>
  )
}
