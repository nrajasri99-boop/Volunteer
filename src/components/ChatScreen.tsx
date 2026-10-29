/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Phone, MoreVertical, Plus, Camera, Send, MapPin, Smile, Landmark, Sparkles } from 'lucide-react';
import { ChatSession, ChatMessage, NGO } from '../types';

interface ChatScreenProps {
  currentSession: ChatSession;
  onBack: () => void;
  onSendMessage: (sessionId: string, messageText: string, mediaType?: 'text' | 'image' | 'location') => void;
  allNgos: NGO[];
}

export default function ChatScreen({
  currentSession,
  onBack,
  onSendMessage,
  allNgos,
}: ChatScreenProps) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession.messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setInputText('');

    // Send outgoing donor message to our local React state
    onSendMessage(currentSession.id, userText, 'text');

    // Simulate community manager reading state with typing delay
    setIsTyping(true);

    try {
      // API call to our server backend proxying live Gemini chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ngoId: currentSession.id,
          ngoName: currentSession.ngoName,
          messages: currentSession.messages,
          userPrompt: userText,
        }),
      });

      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      
      // Add incoming simulated NGO response
      setTimeout(() => {
        setIsTyping(false);
        onSendMessage(currentSession.id, data.reply || 'Thanks for your details!', 'text');
      }, 1000);
    } catch (err) {
      console.error('Error fetching chat response:', err);
      // Fallback
      setTimeout(() => {
        setIsTyping(false);
        onSendMessage(currentSession.id, `Thank you for your response! Sarah, our volunteers can coordinate detailed logistics shortly.`, 'text');
      }, 1200);
    }
  };

  // Helper to trigger simulated visual location coordinates
  const handleQuickSendLocation = () => {
    onSendMessage(
      currentSession.id,
      'Shared pickup coordinates',
      'location'
    );
  };

  // Helper to trigger simulated visual clothing image attachment
  const handleQuickSendImage = () => {
    onSendMessage(
      currentSession.id,
      'Attached winter coats package confirmation',
      'image'
    );
  };

  return (
    <div id="chat-screen-root" className="min-h-screen bg-[#f3faff] flex flex-col justify-between animate-fade-in relative z-10">
      
      {/* Fixed top navigation - exactly matching Header spec */}
      <header id="chat-header" className="fixed top-0 left-0 w-full z-50 bg-[#ffffff] shadow-sm py-3 px-4 flex justify-between items-center border-b border-gray-150">
        <div className="flex items-center gap-3">
          <button 
            id="chat-back-btn"
            onClick={onBack}
            className="p-1 rounded-full text-[#0d631b] hover:bg-emerald-50 active:scale-95 transition-transform cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <div id="ngo-avatar-circle" className="w-10 h-10 rounded-full border-2 border-emerald-100 overflow-hidden shadow-inner">
              <img 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ_5VR-pKFq69D69BvM7fHJ8OMxClGateq2mo0DWUhLUNO9C2N09YVZPNc9AKTcqI0UQFhbLvvB8I8JN9uMaaiUH8LFzR48VrKwUDdg-o4W9T663usojKzmU-4uvRGStrVrrppOdlMTJZKFng1blDWaRLzuPLaP3mVR65kqbVNQXfj5JA0j8So2zeYwf9wCw_ovfteH8IBljxnn-DUNJFVfWecgMWtHG3AazWHfYD66hhc1SftMCCp-kN9Jm-zsUfjfVi4DRXQdgc" 
                alt="Representative photo" 
              />
            </div>
            <div>
              <h1 id="chat-ngo-target-name" className="text-sm font-sans font-bold text-[#071e27] leading-tight flex items-center gap-1">
                {currentSession.ngoName}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${currentSession.online ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                <span className="text-[11px] font-sans text-gray-500">{currentSession.online ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            id="chat-call-btn"
            onClick={() => alert(`Calling simulated representative for ${currentSession.ngoName} via safe proxy...`)}
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#0d631b] hover:bg-emerald-50 active:scale-90 transition-all cursor-pointer"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button 
            id="chat-menu-btn"
            onClick={() => alert(`Active Handover Protocol: NGO is authorized to request pickup transport.`)}
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#0d631b] hover:bg-emerald-50 active:scale-90 transition-all cursor-pointer"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main chat log channel */}
      <main id="chat-messages-container" className="flex-1 pt-20 pb-28 px-4 max-w-2xl w-full mx-auto flex flex-col font-sans space-y-4 overflow-y-auto">
        
        {/* Date bubble divider - matches Screen 4 design */}
        <div id="chat-date-divider" className="flex justify-center my-4">
          <span className="px-4 py-1 rounded-full bg-[#dbf1fe] text-[10px] uppercase font-bold tracking-wider text-gray-600 font-sans">
            Today
          </span>
        </div>

        {/* Render serial log arrays */}
        {currentSession.messages.map(msg => {
          const isMe = msg.sender === 'user';
          
          return (
            <div 
              id={`chat-msg-row-${msg.id}`}
              key={msg.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full animate-fade-in`}
            >
              <div className="max-w-[75%] flex flex-col">
                
                {/* 1. TEXT payload matching Screen 4 layout bubbles */}
                {msg.type === 'text' && (
                  <div 
                    id={`chat-bubble-${msg.id}`}
                    className={`px-4 py-3 rounded-2xl shadow-sm font-sans text-sm ${
                      isMe 
                        ? 'bg-[#0d631b] text-white rounded-br-none' 
                        : 'bg-white border border-gray-150 text-[#071e27] rounded-bl-none'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                  </div>
                )}

                {/* 2. IMAGE payload matching Screen 4 coats stack preview */}
                {msg.type === 'image' && (
                  <div 
                    id={`chat-bubble-image-${msg.id}`}
                    className="relative overflow-hidden rounded-2xl rounded-br-none shadow-md border-2 border-[#0d631b] bg-white h-52 w-64 cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => alert('Opening attached verification photo coordinates')}
                  >
                    <img 
                      className="w-full h-full object-cover" 
                      src={msg.mediaUrl} 
                      alt="Verification listing stack" 
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
                      <span className="text-white text-xs font-bold font-sans">
                        {msg.mediaLabel || 'Winter Essentials'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. LOCATION GPS pinpoint matching Seattle Screen 4 static map layout */}
                {msg.type === 'location' && (
                  <div 
                    id={`chat-bubble-location-${msg.id}`}
                    className="bg-[#0b631b] text-white p-1 rounded-2xl rounded-br-none shadow-md overflow-hidden max-w-[270px]"
                  >
                    <div 
                      onClick={() => alert(`Loading map location for home pickup delivery coordinates`)}
                      className="bg-white rounded-xl overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="h-32 w-64 bg-gray-100 relative">
                        <img 
                          className="w-full h-full object-cover" 
                          src={msg.mediaUrl} 
                          alt="Seattle WA pick point map" 
                        />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 animate-bounce">
                          <MapPin className="w-7 h-7 fill-red-500 text-white" />
                        </div>
                      </div>
                      <div className="p-3 text-[#071e27]">
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <span className="material-symbols-outlined text-[15px] text-[#0d631b]">home</span>
                          Home Pickup
                        </div>
                        <p className="text-[10px] text-gray-500 font-sans tracking-tight mt-0.5 truncate pr-2">
                          {msg.mediaLabel || '123 Charity Lane, Seattle, WA 98101'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message Timestamp underlay */}
                <span className={`text-[10px] text-gray-400 mt-1 px-1.5 font-sans ${isMe ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* simulated writing feedback loading panel */}
        {isTyping && (
          <div id="assistant-typing-indic" className="flex justify-start w-full animate-pulse">
            <div className="bg-white border border-gray-150 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
              <span className="text-xs text-emerald-600 font-mono font-bold">Assistant representative typing</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0d631b] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0d631b] animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0d631b] animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input controller sticky container matching Screen 4 */}
      <div id="sticky-message-bar" className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-150 py-3.5 px-4 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        
        {/* Quick Simulated Attachments Shortcut Row */}
        <div className="max-w-2xl mx-auto flex gap-2 mb-2 px-1">
          <button
            id="quick-attachment-photo"
            type="button"
            onClick={handleQuickSendImage}
            className="flex items-center gap-1 bg-emerald-50 text-[#0d631b] border border-emerald-100 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-100 cursor-pointer active:scale-95 duration-150"
          >
            <Sparkles className="w-3 h-3 animate-pulse" /> Attach Winter Coats image
          </button>
          <button
            id="quick-attachment-gps"
            type="button"
            onClick={handleQuickSendLocation}
            className="flex items-center gap-1 bg-emerald-50 text-[#0d631b] border border-emerald-100 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-100 cursor-pointer active:scale-95 duration-150"
          >
            <MapPin className="w-3 h-3" /> Share Home Location Map
          </button>
        </div>

        <form onSubmit={handleSend} className="max-w-2xl mx-auto flex items-end gap-3">
          
          {/* Action plus & camera layout elements */}
          <div id="chat-input-controls" className="flex items-center gap-2 mb-1">
            <button 
              id="plus-action-btn"
              type="button"
              onClick={handleQuickSendLocation}
              className="w-10 h-10 flex items-center justify-center text-emerald-800 bg-emerald-50 rounded-full hover:bg-emerald-150 active:scale-90 transition-all cursor-pointer border border-emerald-100"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button 
              id="camera-action-btn"
              type="button"
              onClick={handleQuickSendImage}
              className="w-10 h-10 flex items-center justify-center text-emerald-800 bg-emerald-50 rounded-full hover:bg-emerald-150 active:scale-90 transition-all cursor-pointer border border-emerald-100"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          {/* Dynamic input text bar */}
          <div className="flex-grow">
            <input 
              id="chat-text-input"
              type="text" 
              placeholder="Type a message..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-[#f3faff] border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d631b] focus:bg-white font-sans text-[#071e27]"
            />
          </div>

          {/* Round Send Button */}
          <button 
            id="chat-send-msg-btn"
            type="submit"
            className="w-12 h-12 flex items-center justify-center bg-[#0d631b] hover:bg-[#1b6d24] text-white rounded-full shadow-md transition-all active:scale-90 mb-0.5 shrink-0 cursor-pointer"
          >
            <Send className="w-5 h-5 fill-current transform rotate-15" />
          </button>
        </form>
      </div>

      {/* SVG dots subtle green visual background canvas matching Screen 4 spec */}
      <div className="fixed inset-0 -z-10 bg-[#f3faff] pointer-events-none opacity-40">
        <svg className="absolute top-0 right-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotPatternMain" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#0d631b" fillOpacity="0.04" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotPatternMain)" />
        </svg>
      </div>
    </div>
  );
}
