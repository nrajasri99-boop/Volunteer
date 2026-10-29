/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, SlidersHorizontal, Bell, Compass, MapPin, Heart, BookOpen, Utensils, Anchor, Users, Check, CheckCircle, Crosshair } from 'lucide-react';
import { NGO, DonationItem } from '../types';

interface HomeScreenProps {
  ngos: NGO[];
  trendingNeeds: DonationItem[];
  onFollowNGO: (id: string) => void;
  onSelectNGO: (id: string) => void;
  onQuickDonate: (needId: string) => void;
  onSearchClick: () => void;
}

export default function HomeScreen({
  ngos,
  trendingNeeds,
  onFollowNGO,
  onSelectNGO,
  onQuickDonate,
  onSearchClick,
}: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMapPin, setSelectedMapPin] = useState<string | null>(null);
  const [mapCenterAlert, setMapCenterAlert] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);

  const filteredNGOs = ngos.filter(ngo => {
    const matchesSearch = ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ngo.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType ? ngo.type.toLowerCase().includes(filterType.toLowerCase()) : true;
    return matchesSearch && matchesFilter;
  });

  const handleCenterMap = () => {
    setMapCenterAlert(true);
    setTimeout(() => setMapCenterAlert(false), 2500);
  };

  return (
    <div id="home-screen-root" className="pb-24 animate-fade-in">
      {/* Header Profile Info */}
      <header id="home-top-nav" className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div id="user-avatar" className="w-10 h-10 rounded-full border-2 border-emerald-500 overflow-hidden shadow-sm">
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
              alt="Sarah Profile" 
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span id="app-logo-text" className="font-sans font-extrabold text-lg text-[#0d631b]">Heart Hands</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 font-sans">
              <MapPin className="w-3.5 h-3.5 text-[#0d631b]" />
              San Francisco, CA
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active alerts panel */}
          <button 
            id="notification-bell-btn"
            onClick={() => alert("Notification: Hope Shelter has requested coat handover delivery coordinates.")}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#0d631b] hover:bg-emerald-50 transition-colors relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span id="badge-dot" className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500"></span>
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 mt-4">
        {/* Search Bar matching mock design screen 2 */}
        <div id="search-filter-bar" className="flex items-center gap-2">
          <div className="flex-grow relative flex items-center">
            <Search className="absolute left-3.5 w-5 h-5 text-[#707a6c]" />
            <input 
              id="search-input"
              type="text" 
              placeholder="Search NGOs or needs near you" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#e6f6ff]/40 border border-transparent rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d631b] focus:bg-white transition-all font-sans"
            />
          </div>
          <button 
            id="filter-configs-btn"
            onClick={() => setFilterType(prev => prev === 'Food' ? null : 'Food')}
            className={`p-3 rounded-2xl flex items-center justify-center border transition-all cursor-pointer ${
              filterType === 'Food' ? 'bg-[#0d631b] text-white border-transparent' : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Custom interactive Map preview matching visual design of screen 2 */}
        <div id="local-map-container" className="relative mt-6 rounded-3xl overflow-hidden shadow-inner border border-blue-50">
          {/* Simulated Web Map SVG/Canvas Design */}
          <div className="w-full h-72 bg-[#dff4ff] relative overflow-hidden">
            {/* Beautiful SF shoreline and street grids */}
            <svg className="absolute inset-0 w-full h-full opacity-65" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0,220 C 120,200 240,250 350,150 C 440,80 500,40 800,90 L 800,0 L 0,0 Z" fill="#9cd6ff" />
              {/* Streets pattern */}
              <line x1="0" y1="50" x2="800" y2="80" stroke="#fff" strokeWidth="6" />
              <line x1="0" y1="120" x2="800" y2="150" stroke="#fff" strokeWidth="5" />
              <line x1="0" y1="190" x2="800" y2="210" stroke="#fff" strokeWidth="6" />
              <line x1="120" y1="0" x2="180" y2="300" stroke="#fff" strokeWidth="5" />
              <line x1="300" y1="0" x2="350" y2="300" stroke="#fff" strokeWidth="6" />
              <line x1="550" y1="0" x2="590" y2="300" stroke="#fff" strokeWidth="5" />
              {/* Green parks */}
              <rect x="50" y="80" width="120" height="70" rx="10" fill="#a4f69c" fillOpacity="0.5" />
              <rect x="420" y="110" width="160" height="90" rx="15" fill="#a4f69c" fillOpacity="0.5" />
              {/* Bay waters anchor label */}
              <text x="320" y="50" fill="#1b6d24" fillOpacity="0.2" className="text-xs font-mono tracking-widest font-bold">SAN FRANCISCO BAY</text>
            </svg>

            {/* GPS center target button */}
            <button 
              id="gps-recentre-btn"
              onClick={handleCenterMap}
              className="absolute bottom-4 right-4 w-11 h-11 bg-white rounded-full flex items-center justify-center text-[#0d631b] shadow-md hover:bg-gray-50 active:scale-95 transition-transform"
            >
              <Crosshair className="w-5 h-5" />
            </button>

            {mapCenterAlert && (
              <div id="map-alert" className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-900/90 text-white text-xs px-3 py-1.5 rounded-full font-mono shadow-lg transition-all duration-300">
                Centered to your SF physical GPS coordinates
              </div>
            )}

            {/* Simulated Map Markers with Labels exactly matching Screen 2 */}
            {/* Maker 1: St. Mary's Shelter - Food symbol */}
            <div 
              id="map-pin-shelter"
              onClick={() => setSelectedMapPin('hope-shelter')}
              className="absolute top-[80px] left-[130px] flex flex-col items-center cursor-pointer group"
            >
              <div className="bg-[#2e7d32] w-9 h-9 rounded-full flex items-center justify-center text-white border-2 border-white shadow-md transform group-hover:scale-110 group-hover:bg-[#1b5e20] transition-all">
                <Utensils className="w-4 h-4" />
              </div>
              <div className="mt-1 bg-white px-2.5 py-1 rounded-full shadow-md border border-gray-100 flex items-center gap-1 scale-90 sm:scale-100">
                <span className="text-[10px] font-extrabold text-[#071e27] whitespace-nowrap">St. Mary's Shelter</span>
              </div>
            </div>

            {/* Marker 2: City Youth Center - Clothing/Hanger or Book symbol */}
            <div 
              id="map-pin-youth"
              onClick={() => setSelectedMapPin('green-steps')}
              className="absolute top-[160px] left-[260px] flex flex-col items-center cursor-pointer group"
            >
              <div className="bg-[#005db7] w-9 h-9 rounded-full flex items-center justify-center text-white border-2 border-white shadow-md transform group-hover:scale-110 group-hover:bg-[#00468c] transition-all">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="mt-1 bg-white px-2.5 py-1 rounded-full shadow-md border border-gray-100 flex items-center gap-1 scale-90 sm:scale-100">
                <span className="text-[10px] font-extrabold text-[#071e27] whitespace-nowrap font-sans">City Youth Center</span>
              </div>
            </div>

            {/* Unselected soft standard target points */}
            <div className="absolute top-[110px] left-[230px] w-4.5 h-4.5 rounded-full bg-red-400 border-2 border-white shadow opacity-80 pointer-events-none animate-pulse"></div>
            <div className="absolute top-[60px] left-[320px] w-4.5 h-4.5 rounded-full bg-red-400 border-2 border-white shadow opacity-80 pointer-events-none"></div>
            <div className="absolute top-[180px] left-[190px] w-4.5 h-4.5 rounded-full bg-red-400 border-2 border-white shadow opacity-80 pointer-events-none"></div>
          </div>

          {/* Inline marker details when selected */}
          {selectedMapPin && (
            <div id="map-interaction-drawer" className="bg-white border-t border-gray-100 p-4 transition-all animate-slide-up flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-[#0d631b]">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#071e27] font-sans">
                    {selectedMapPin === 'hope-shelter' ? 'St. Mary\'s Shelter Drive' : 'Green Steps Educational Hub'}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {selectedMapPin === 'hope-shelter' ? 'Active: Needs 180 lbs fresh nutrients' : 'Active: Seeking primary math publications'}
                  </p>
                </div>
              </div>
              <button 
                id="drawer-visit-ngo"
                onClick={() => {
                  onSelectNGO(selectedMapPin);
                  setSelectedMapPin(null);
                }}
                className="text-xs font-bold text-[#0d631b] bg-emerald-50 px-3 py-1.5 rounded-xl hover:bg-[#0d631b] hover:text-white transition-colors duration-200"
              >
                Learn More
              </button>
            </div>
          )}
        </div>

        {/* URGENT IMPACT / Trending Needs matching Screen 2 */}
        <section id="trending-needs-section" className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 id="trending-header" className="text-sm font-sans font-bold uppercase tracking-wider text-gray-400">URGENT IMPACT</h2>
            <button 
              id="view-all-needs-btn" 
              onClick={onSearchClick}
              className="text-xs font-sans font-bold text-[#0d631b] hover:underline"
            >
              View all
            </button>
          </div>
          <h3 className="text-2xl font-bold text-[#071e27] font-sans -mt-3 mb-4 leading-tight">Trending Needs</h3>

          <div id="trending-cards-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingNeeds.map(need => {
              const currentCollected = parseInt(need.collectedAmount || '0');
              const targetGoal = parseInt(need.targetAmount || '100');
              const percent = Math.min(Math.round((currentCollected / targetGoal) * 100), 100);

              return (
                <div 
                  id={`trending-card-${need.id}`}
                  key={need.id} 
                  className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full bg-gray-50">
                    <img 
                      className="w-full h-full object-cover" 
                      src={need.images[0]} 
                      alt={need.title} 
                    />
                    
                    {need.priority === 'High' && (
                      <span id="priority-tag" className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-sans">
                        High Priority
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 id={`trending-card-title-${need.id}`} className="text-lg font-bold text-[#071e27] font-family-sans leading-snug">
                        {need.title}
                      </h4>
                      <p className="text-xs text-gray-500 font-sans mt-1">
                        Goal: {need.targetAmount} • {need.collectedAmount} collected
                      </p>

                      {/* Custom stylish thick Progress Bar matching Heart Hands spec */}
                      <div className="mt-3 w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-[#2e7d32] h-full rounded-full transition-all duration-500" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <button 
                      id={`donate-now-btn-${need.id}`}
                      onClick={() => onQuickDonate(need.id)}
                      className="mt-4 w-full bg-[#0d631b] hover:bg-[#1b6d24] text-white py-3 px-4 rounded-xl text-sm font-sans font-bold shadow-sm transition-all duration-200 hover:shadow active:scale-98 flex items-center justify-center gap-1.5"
                    >
                      Donate Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Nearby Organizations Directory matching Screen 2 list layout */}
        <section id="nearby-organizations-section" className="mt-8">
          <h3 className="text-xl font-bold text-[#071e27] font-sans mb-4">Nearby Organizations</h3>
          
          <div id="ngo-list-wrapper" className="space-y-3">
            {filteredNGOs.map(ngo => {
              // Custom semantic logo rendering
              const logoNode = () => {
                if (ngo.logo.startsWith('http')) {
                  return <img className="w-full h-full object-cover" src={ngo.logo} alt={ngo.name} />;
                }
                if (ngo.logo === 'anchor') {
                  return <Anchor className="w-5 h-5 text-sky-600" />;
                }
                if (ngo.logo === 'footprints') {
                  return <Compass className="w-5 h-5 text-emerald-600" />;
                }
                return <Utensils className="w-5 h-5 text-amber-600" />;
              };

              const logoBg = () => {
                if (ngo.logo.startsWith('http')) return 'bg-gray-50';
                if (ngo.logo === 'anchor') return 'bg-sky-50';
                if (ngo.logo === 'footprints') return 'bg-emerald-50';
                return 'bg-amber-50';
              };

              return (
                <div 
                  id={`ngo-row-${ngo.id}`}
                  key={ngo.id}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center ${logoBg()}`}>
                      {logoNode()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 
                          onClick={() => onSelectNGO(ngo.id)}
                          className="text-sm font-sans font-bold text-[#071e27] hover:text-[#0d631b] cursor-pointer"
                        >
                          {ngo.name}
                        </h4>
                        {ngo.verified && (
                          <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-500 text-white" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-sans mt-0.5">
                        {ngo.type === 'Homelessness & Warmth' ? 'Homelessness' : ngo.type} • {ngo.distance} miles away
                      </p>
                    </div>
                  </div>

                  <button
                    id={`ngo-follow-btn-${ngo.id}`}
                    onClick={() => onFollowNGO(ngo.id)}
                    className={`text-xs font-sans font-bold px-4 py-2 rounded-full border transition-all cursor-pointer ${
                      ngo.followed 
                        ? 'bg-emerald-50 text-[#0d631b] border-transparent hover:bg-emerald-100'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {ngo.followed ? 'Following' : 'Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
