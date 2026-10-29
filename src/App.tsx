/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Home as HomeIcon, Search as SearchIcon, PlusCircle, MessageSquare, User as UserIcon, MessageCircle, AlertTriangle } from 'lucide-react';
import { UserRole, NGO, DonationItem, ChatSession, ChatMessage } from './types';
import { INITIAL_NGOS, INITIAL_TRENDING_NEEDS, INITIAL_CHATS } from './mockData';

// Modular Screen Component Imports
import OnboardingScreen from './components/OnboardingScreen';
import HomeScreen from './components/HomeScreen';
import PostDonationScreen from './components/PostDonationScreen';
import ChatScreen from './components/ChatScreen';
import ProfileScreen from './components/ProfileScreen';
import SearchScreen from './components/SearchScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('donor');
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'donate' | 'chat' | 'profile'>('home');
  
  // App data states
  const [ngos, setNgos] = useState<NGO[]>(INITIAL_NGOS);
  const [donationItems, setDonationItems] = useState<DonationItem[]>(INITIAL_TRENDING_NEEDS);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(INITIAL_CHATS);
  
  // Specific view sub-states
  const [selectedChatSessionId, setSelectedChatSessionId] = useState<string | null>(null);
  const [viewingSpecificNGOId, setViewingSpecificNGOId] = useState<string | null>(null);

  // Global Handlers
  const handleSelectRole = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setActiveTab('home');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setActiveTab('home');
  };

  const handleFollowNGO = (id: string) => {
    setNgos(prev => prev.map(n => n.id === id ? { ...n, followed: !n.followed } : n));
  };

  const handleSelectNGO = (id: string) => {
    setViewingSpecificNGOId(id);
    const targetNGO = ngos.find(n => n.id === id);
    if (targetNGO) {
      alert(`NGO Details:\n\nName: ${targetNGO.name}\nMission: ${targetNGO.description}\nDistance: ${targetNGO.distance} miles away\nContact: ${targetNGO.contactPerson}`);
    }
  };

  const handleQuickDonate = (needId: string) => {
    const needItem = donationItems.find(d => d.id === needId);
    if (!needItem) return;

    // Simulate instant giving handover thread trigger
    setSelectedChatSessionId('hope-shelter');
    setActiveTab('chat');
    alert(`Handover Triggered:\n\nYou chosen to supply "${needItem.title}". Redirecting to private secure chat coordinate handover logistics with Hope Shelter!`);
  };

  // Create new user-posted listing
  const handleAddNewDonation = (newItem: Partial<DonationItem>) => {
    const freshItem: DonationItem = {
      id: `donation-${Date.now()}`,
      title: newItem.title || 'Kindness Package',
      description: newItem.description || 'Gently-used charity package from our neighboring donor series.',
      category: newItem.category || 'Clothing',
      condition: newItem.condition || 'Used',
      quantity: newItem.quantity || 1,
      logisticPreference: newItem.logisticPreference || 'Pickup',
      meetingPoint: newItem.meetingPoint || '123 Charity Lane, Emerald City',
      status: 'available',
      images: newItem.images || ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600'],
      priority: 'Normal',
      createdAt: newItem.createdAt || new Date().toISOString(),
    };

    setDonationItems(prev => [freshItem, ...prev]);
  };

  // Dispatch live chat message logic
  const handleSendMessage = (sessionId: string, messageText: string, mediaType: 'text' | 'image' | 'location' = 'text') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let newMessage: ChatMessage;

    if (mediaType === 'image') {
      newMessage = {
        id: `msg-user-image-${Date.now()}`,
        sender: 'user',
        text: 'Confirmation: Loaded winter items verification photo.',
        timestamp: timeStr,
        type: 'image',
        mediaUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCbSi35C3m5P8OhiYptMX8N9HVdskZZVPeBEHYnD3oOxKT77dOUFkjEeOjqbtLEW0n2Mt6j7-Ey_IjPHWoqWNoHyQyHXNxxld3I00Mt9pBFsS-XJuWwIINbv2Vt4VmvkXpw8cG6rQ3ekRM6S9Bj_IeU7XljEYEYVMp53ZQvUevTzJTqafAwsrK8Wo7SmI_dcupH0TN631jNmqvt8JN5VPDv-Je1aNyjlTZpcr3E_9bXmOmrjQhgGZ3eXsDDngCTf85uf2od1c_yn4',
        mediaLabel: '5 Items • Winter Essentials',
      };
    } else if (mediaType === 'location') {
      newMessage = {
        id: `msg-user-loc-${Date.now()}`,
        sender: 'user',
        text: 'Shared location: Home Pickup delivery point coordinates.',
        timestamp: timeStr,
        type: 'location',
        mediaUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH7H4euTrMsrmINYbHuvaQ3FfMly5Zp8IFG_TP9tF27NbvYNJgUVtSyXjDxOnnLYjNsKeTxXjK1FAifVe4KuusDxVVdd-i-AiBJFKvl9JjL0WGVFg7-ZpkPWGCR7yHkzhpZ7XPnaQ0-yARfKLC5DfDr3T_CB2jfMS5-VsKbiCZmXzMdeztkiJoUWaCwWDdV2WJf03KgAT_YITX-k9gNoJGZsmrECANBeTQL0aleivCUln5OYIe9xTX6vmc97g_ls0E4iUvuM8l08I',
        mediaLabel: '123 Charity Lane, Seattle, WA 98101',
      };
    } else {
      newMessage = {
        id: `msg-user-txt-${Date.now()}`,
        sender: 'user',
        text: messageText,
        timestamp: timeStr,
        type: 'text',
      };
    }

    setChatSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          lastMessageTime: timeStr,
          messages: [...session.messages, newMessage],
        };
      }
      return session;
    }));
  };

  // Calculate dynamic count donor listing
  const currentDonorItemsCount = donationItems.length + 3; // Starts with initial baseline matching Screen 4 preloads

  // Tab views rendering Router logic
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            ngos={ngos}
            trendingNeeds={donationItems}
            onFollowNGO={handleFollowNGO}
            onSelectNGO={handleSelectNGO}
            onQuickDonate={handleQuickDonate}
            onSearchClick={() => setActiveTab('search')}
          />
        );
      case 'search':
        return (
          <SearchScreen
            donationItems={donationItems}
            onSelectNeed={(id) => {
              const selectedItem = donationItems.find(d => d.id === id);
              if (selectedItem) {
                alert(`Donation Details:\n\nTitle: ${selectedItem.title}\nCategory: ${selectedItem.category}\nCondition: ${selectedItem.condition}\nQuantity: ${selectedItem.quantity}\nLogistic: ${selectedItem.logisticPreference}`);
              }
            }}
          />
        );
      case 'donate':
        return (
          <PostDonationScreen
            onBack={() => setActiveTab('home')}
            onSubmit={handleAddNewDonation}
          />
        );
      case 'chat':
        // If a specific conversation detail is active, load ChatScreen detailed view
        if (selectedChatSessionId) {
          const matchedSession = chatSessions.find(s => s.id === selectedChatSessionId);
          if (matchedSession) {
            return (
              <ChatScreen
                currentSession={matchedSession}
                onBack={() => setSelectedChatSessionId(null)}
                onSendMessage={handleSendMessage}
                allNgos={ngos}
              />
            );
          }
        }

        // Otherwise render chat thread sessions inbox selector
        return (
          <div id="chat-inbox-root" className="pb-24 max-w-xl mx-auto px-4 pt-4 animate-fade-in font-sans">
            <h2 id="inbox-title" className="text-3xl font-extrabold text-[#071e27]">Messages Inbox</h2>
            <p className="text-xs text-gray-500 mt-1">Coordinate pickups, logistical steps, and review charity queries.</p>
            
            <div id="inbox-thread-list" className="mt-6 space-y-3">
              {chatSessions.map(session => (
                <div
                  id={`chat-session-row-${session.id}`}
                  key={session.id}
                  onClick={() => setSelectedChatSessionId(session.id)}
                  className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border">
                      <img className="w-full h-full object-cover" src={session.ngoLogo} alt={session.ngoName} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#071e27]">{session.ngoName}</h4>
                      <p className="text-xs text-[#0d631b] mt-0.5 max-w-[200px] truncate">
                        {session.messages.length > 0 
                          ? session.messages[session.messages.length - 1].text 
                          : 'Click to start coordinating logistics'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-gray-400 font-mono">
                    {session.lastMessageTime}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'profile':
        return (
          <ProfileScreen
            role={userRole}
            onRoleChange={setUserRole}
            donationCount={currentDonorItemsCount}
          />
        );
      default:
        return null;
    }
  };

  // If simple role selection is active
  if (!isLoggedIn) {
    return (
      <OnboardingScreen 
        onSelectRole={handleSelectRole} 
        onLogin={handleLogin} 
      />
    );
  }

  // Determine if specific chat detail view is dominant to hide structural navbar
  const hideNavigation = activeTab === 'chat' && selectedChatSessionId !== null;

  return (
    <div id="app-viewport-wrapper" className="min-h-screen bg-[#f3faff] font-sans relative">
      
      {/* Dynamic Selected Tab Channel */}
      <main id="app-main-view" className={hideNavigation ? '' : 'pt-2 pt-mb-4'}>
        {renderTabContent()}
      </main>

      {/* Floating Bottom Navigator Bar for seamless switching - matching Screen 2 Design precisely */}
      {!hideNavigation && (
        <nav 
          id="global-bottom-navbar" 
          className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-150 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-4 py-2.5 flex items-center justify-around"
        >
          {/* Home Active tab */}
          <button
            id="nav-tab-home"
            onClick={() => { setActiveTab('home'); setSelectedChatSessionId(null); }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeTab === 'home' ? 'text-[#0d631b]' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <div className={`p-1 px-3.5 rounded-full ${activeTab === 'home' ? 'bg-[#cbffc2]/50 text-[#0d631b]' : 'bg-transparent text-gray-400'}`}>
              <HomeIcon className="w-5.5 h-5.5" />
            </div>
            <span className="text-[10px] font-bold tracking-tight">Home</span>
          </button>

          {/* Search Tab */}
          <button
            id="nav-tab-search"
            onClick={() => { setActiveTab('search'); setSelectedChatSessionId(null); }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeTab === 'search' ? 'text-[#0d631b]' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <div className={`p-1 px-3.5 rounded-full ${activeTab === 'search' ? 'bg-[#cbffc2]/50 text-[#0d631b]' : 'bg-transparent text-gray-400'}`}>
              <SearchIcon className="w-5.5 h-5.5" />
            </div>
            <span className="text-[10px] font-bold tracking-tight font-sans">Search</span>
          </button>

          {/* Center framed Donate tab */}
          <button
            id="nav-tab-donate"
            onClick={() => { setActiveTab('donate'); setSelectedChatSessionId(null); }}
            className="flex flex-col items-center cursor-pointer relative -top-3 transform active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-[#0d631b] flex items-center justify-center text-white shadow-md hover:bg-[#1b6d24]">
              <PlusCircle className="w-6.5 h-6.5" />
            </div>
            <span className="text-[10px] font-bold text-[#0d631b] mt-1 font-sans">Donate</span>
          </button>

          {/* Chat inbox tab */}
          <button
            id="nav-tab-chat"
            onClick={() => { setActiveTab('chat'); setSelectedChatSessionId(null); }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeTab === 'chat' ? 'text-[#0d631b]' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <div className={`p-1 px-3.5 rounded-full ${activeTab === 'chat' ? 'bg-[#cbffc2]/50 text-[#0d631b]' : 'bg-transparent text-gray-400'}`}>
              <MessageSquare className="w-5.5 h-5.5" />
            </div>
            <span className="text-[10px] font-bold tracking-tight font-sans">Chat</span>
          </button>

          {/* Profile Tab */}
          <button
            id="nav-tab-profile"
            onClick={() => { setActiveTab('profile'); setSelectedChatSessionId(null); }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeTab === 'profile' ? 'text-[#0d631b]' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <div className={`p-1 px-3.5 rounded-full ${activeTab === 'profile' ? 'bg-[#cbffc2]/50 text-[#0d631b]' : 'bg-transparent text-gray-400'}`}>
              <UserIcon className="w-5.5 h-5.5" />
            </div>
            <span className="text-[10px] font-bold tracking-tight font-sans">Profile</span>
          </button>
        </nav>
      )}

    </div>
  );
}
