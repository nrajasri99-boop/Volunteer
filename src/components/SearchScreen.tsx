/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, MapPin, Heart, Share2, Sparkles, Filter, ChevronRight, Bookmark } from 'lucide-react';
import { DonationItem } from '../types';

interface SearchScreenProps {
  donationItems: DonationItem[];
  onSelectNeed: (needId: string) => void;
}

export default function SearchScreen({ donationItems, onSelectNeed }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const CATEGORIES = ['All', 'Food', 'Clothing', 'Books', 'Shelter Supplies', 'Electronics'];

  const filteredItems = donationItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="search-screen-root" className="pb-24 animate-fade-in max-w-xl mx-auto px-4 pt-4">
      <h2 id="search-header-title" className="text-3xl font-extrabold text-[#071e27] font-sans">Explore Feed</h2>
      <p className="text-xs text-slate-500 font-sans mt-1">Discover, inspect, and coordinate item donations live around your San Francisco locality.</p>

      {/* Embedded Search Text Input bar */}
      <div id="search-input-wrapper" className="relative mt-5 flex items-center pr-1 bg-white border border-gray-200 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-[#0d631b] transition-all">
        <Search className="absolute left-3.5 w-4.5 h-4.5 text-gray-400" />
        <input 
          id="explore-search-input"
          type="text" 
          placeholder="e.g. Winter coats, canned soup" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-none rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none font-sans"
        />
      </div>

      {/* Horizontal Category Filtering Chips */}
      <div id="filter-chips-wrapper" className="flex items-center gap-1.5 overflow-x-auto py-3.5 hide-scrollbar scroll-smooth">
        {CATEGORIES.map(category => (
          <button
            id={`filter-chip-${category.toLowerCase().replace(' ', '-')}`}
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold leading-none shrink-0 font-sans cursor-pointer transition-all ${
              selectedCategory === category
                ? 'bg-[#0d631b] text-white shadow-sm font-medium'
                : 'bg-white border border-gray-150 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Rendered Search Result listings */}
      <div id="explore-items-list" className="space-y-4 font-sans mt-2">
        {filteredItems.length === 0 ? (
          <div id="empty-search-fallback" className="bg-white p-8 rounded-3xl border border-dashed border-gray-200 text-center flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl text-gray-300">search_off</span>
            <h4 className="mt-2 font-bold text-gray-700">No active matches found</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">We couldn't locate any live items matching your parameters. Try another term or submit a custom donation request!</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div 
              id={`explore-card-${item.id}`}
              key={item.id}
              className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
              onClick={() => onSelectNeed(item.id)}
            >
              <div className="flex gap-4 p-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-50 border border-gray-100">
                  <img className="w-full h-full object-cover" src={item.images[0]} alt={item.title} />
                </div>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="bg-[#cbd1fe]/40 text-[#0d5312] font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-gray-400 font-sans shrink-0">{item.condition} condition</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#071e27] font-semibold mt-1 truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 max-h-8 leading-normal font-normal">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5 leading-none">
                      <MapPin className="w-3.5 h-3.5 text-[#0d631b]" />
                      {item.meetingPoint || 'San Francisco, CA'}
                    </span>
                    <span className="text-[11px] font-bold font-sans text-[#0d631b] flex items-center gap-0.5 leading-none hover:underline">
                      Coordinate <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
