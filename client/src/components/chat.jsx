import React, { useState } from 'react';
import { Send, User, Bot } from 'lucide-react';

export default function Chat() {
  // Initial state: one welcome message from the bot.
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to BillRewards support! How can I help you today?", sender: "bot" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Helper function that replicates your Express sending logic.
  // It checks for a transfer command like: "send 1 magic aptos to 0x..."
  const parseMessage = (message) => {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('send') && lowerMsg.includes('aptos')) {
      // Updated regex to capture the amount and receiver address
      const regex = /send\s+(\d+)\s+magic\s+aptos\s+to\s+(\w+)/i;
      const match = message.match(regex);
      if (match) {
        const amount = parseInt(match[1], 10);
        const receiverAddress = match[2];
        return { action: 'transfer', amount, receiverAddress };
      }
    }
    // Price query: message contains both "aptos" and "price"
    if (/aptos/i.test(message) && /price/i.test(message)) {
      return { action: 'price' };
    }
    return { action: 'unknown' };
  };

  // Function to fetch the real-time price of Aptos from CoinGecko.
  const fetchAptosPrice = async () => {
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=aptos&vs_currencies=usd'
      );
      const data = await res.json();
      return data?.aptos?.usd;
    } catch (error) {
      console.error("Error fetching price:", error);
      return null;
    }
  };

  // Function to send the message.
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    // Add the user's message immediately.
    const userMsg = { id: messages.length + 1, text: newMessage, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Use the parsing logic.
    const parsed = parseMessage(newMessage);

    // If the user is asking for the price.
    if (parsed.action === 'price') {
      const price = await fetchAptosPrice();
      if (price !== null) {
        const botMsg = {
          id: messages.length + 2,
          text: `The current price of Aptos is $${price} USD.`,
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const botMsg = {
          id: messages.length + 2,
          text: "Sorry, I couldn't fetch the price at this time.",
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMsg]);
      }
      setNewMessage("");
      setIsLoading(false);
      return;
    }

    // If the user is asking to transfer Aptos.
    if (parsed.action === 'transfer') {
      // Print the extracted amount and receiver address to the console.
      console.log('Transfer details:', {
        amount: parsed.amount,
        receiverAddress: parsed.receiverAddress
      });

      try {
        // Call your backend endpoint to handle the transfer.
        const accountAddress = await window.pontem.account();
        const response = await fetch('http://localhost:3000/user/transfer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: accountAddress, amount: parsed.amount, receiverAddress: parsed.receiverAddress }),
        });
        const data = await response.json();
        const botMsg = {
          id: messages.length + 2,
          text: data.reply || "Transfer processed.",
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch (error) {
        console.error("Transfer failed", error);
        const botMsg = {
          id: messages.length + 2,
          text: "Transfer failed. Please try again later.",
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMsg]);
      }
      setNewMessage("");
      setIsLoading(false);
      return;
    }

    // If the message doesn't match any supported command.
    const botMsg = {
      id: messages.length + 2,
      text: "I can only assist with transferring Aptos or fetching the real-time price. Please check your command.",
      sender: "bot",
    };
    setMessages((prev) => [...prev, botMsg]);
    setNewMessage("");
    setIsLoading(false);
  };

  // Handle "Enter" key press in the textarea.
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

      <div className="relative h-full flex flex-col max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Support Chat</h1>
            <p className="text-gray-400 text-sm">Always here to help</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  message.sender === "user" ? "bg-indigo-500" : "bg-gray-700"
                }`}
              >
                {message.sender === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div
                className={`max-w-[70%] px-4 py-3 rounded-lg ${
                  message.sender === "user" ? "bg-indigo-500 text-white" : "bg-gray-800 text-gray-100"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-700">
                <Bot size={16} />
              </div>
              <div className="max-w-[70%] px-4 py-3 rounded-lg bg-gray-800 text-gray-100">
                Loading...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-end gap-4">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-transparent outline-none border-none resize-none text-white placeholder-gray-400 max-h-32"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim() || isLoading}
              className={`p-3 rounded-lg transition-all duration-300 ${
                newMessage.trim() && !isLoading ? "bg-indigo-500 hover:bg-indigo-600" : "bg-gray-700 cursor-not-allowed"
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
