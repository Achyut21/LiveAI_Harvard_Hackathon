import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import Login from './components/login';
import Game from './components/game';

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
      </Routes>
    </BrowserRouter>
  )
}
