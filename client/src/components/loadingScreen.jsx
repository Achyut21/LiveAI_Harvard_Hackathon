import React from 'react';
import loaderSvg from '../assets/loader.svg'; // Make sure this path is correct

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-white z-50">
      {/* Spinner image, optionally animate with Tailwind classes */}
      <img src={loaderSvg} alt="Loading..." className="w-16 h-16 animate-spin" />
      
      {/* Loading text */}
      <p className="mt-4 text-lg text-gray-700">
        Loading, please wait...
      </p>
    </div>
  );
}
