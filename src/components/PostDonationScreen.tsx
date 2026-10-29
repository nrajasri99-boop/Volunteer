/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, MapPin, Camera, Video, AlertCircle, Info, Check, Plus, Minus, CheckCircle } from 'lucide-react';
import { DonationItem } from '../types';

interface PostDonationScreenProps {
  onBack: () => void;
  onSubmit: (newItem: Partial<DonationItem>) => void;
}

export default function PostDonationScreen({ onBack, onSubmit }: PostDonationScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Clothing');
  const [condition, setCondition] = useState<'New' | 'Used'>('Used');
  const [quantity, setQuantity] = useState(1);
  const [logisticPreference, setLogisticPreference] = useState<'Pickup' | 'Drop-off'>('Pickup');
  const [meetingPoint, setMeetingPoint] = useState('123 Charity Lane, Emerald City');
  
  // AI assist states
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [aiTags, setAiTags] = useState<string[]>([]);
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);

  // Media upload simulation states
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [successPosted, setSuccessPosted] = useState(false);

  // Pre-loaded photo mockups to simulate selection
  const PHOTO_MOCKUPS = [
    {
      id: 'photo-coats',
      label: 'Winter Coats',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCbSi35C3m5P8OhiYptMX8N9HVdskZZVPeBEHYnD3oOxKT77dOUFkjEeOjqbtLEW0n2Mt6j7-Ey_IjPHWoqWNoHyQyHXNxxld3I00Mt9pBFsS-XJuWwIINbv2Vt4VmvkXpw8cG6rQ3ekRM6S9Bj_IeU7XljEYEYVMp53ZQvUevTzJTqafAwsrK8Wo7SmI_dcupH0TN631jNmqvt8JN5VPDv-Je1aNyjlTZpcr3E_9bXmOmrjQhgGZ3eXsDDngCTf85uf2od1c_yn4',
    },
    {
      id: 'photo-food',
      label: 'Fruits Crate',
      url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'photo-books',
      label: 'STEM Manuals',
      url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
    },
  ];

  const handleTogglePhoto = (url: string) => {
    if (selectedPhotos.includes(url)) {
      setSelectedPhotos(prev => prev.filter(p => p !== url));
    } else {
      setSelectedPhotos(prev => [...prev, url]);
    }
  };

  const handleQuantityAdd = () => setQuantity(prev => prev + 1);
  const handleQuantityMinus = () => setQuantity(prev => Math.max(1, prev - 1));

  // Trigger server-side Gemini analysis
  const handleTriggerAiAnalysis = async () => {
    if (!title && !description) {
      alert('Please enter a Title or Description first so Gemini has metadata to analyze!');
      return;
    }
    setAiAnalyzing(true);
    setAiTip(null);
    setSuggestedCategory(null);
    try {
      const response = await fetch('/api/analyze-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      
      // Update form values with AI suggestions
      if (data.enhancedTitle) setTitle(data.enhancedTitle);
      if (data.category) {
        setCategory(data.category);
        setSuggestedCategory(data.category);
      }
      if (data.tip) setAiTip(data.tip);
      if (data.tags) setAiTags(data.tags);
    } catch (error) {
      console.error('AI analysis error:', error);
      // Client-side fallback if server fails
      setCategory(title.toLowerCase().includes('food') ? 'Food' : 'Clothing');
      setAiTip('Tip: Ensure items are clean. High-quality visual logs increase trust matching nearby shelter requests.');
      setAiTags(['community-need', 'direct-help']);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Missing listing Title!');
      return;
    }

    const defaultImage = selectedPhotos.length > 0 
      ? selectedPhotos[0] 
      : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600';

    onSubmit({
      title,
      description: description || 'Gently-used kindness package shared with local community registries.',
      category,
      condition,
      quantity,
      logisticPreference,
      meetingPoint,
      status: 'available',
      images: selectedPhotos.length > 0 ? selectedPhotos : [defaultImage],
      priority: 'Normal',
      createdAt: new Date().toISOString(),
    });

    setSuccessPosted(true);
    setTimeout(() => {
      setSuccessPosted(false);
      onBack();
    }, 2000);
  };

  if (successPosted) {
    return (
      <div id="post-success-view" className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center animate-fade-in">
        <div id="success-pulse" className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-[#0d631b] mb-4 animate-bounce">
          <CheckCircle className="w-12 h-12 fill-emerald-50 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#071e27] font-sans">Listing Posted Successfully!</h2>
        <p className="text-sm text-gray-500 font-sans mt-2 max-w-sm">
          Your donation is now live on Heart Hands feeds and matching systems. Nearby organizers and receivers will be notified.
        </p>
      </div>
    );
  }

  return (
    <div id="post-screen-root" className="min-h-screen bg-[#f3faff] pb-24 animate-fade-in">
      {/* Header Profile Navbar */}
      <header id="post-navbar" className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4 sticky top-0 z-40">
        <button 
          id="post-back-btn"
          onClick={onBack}
          className="p-1 rounded-full text-[#0d631b] hover:bg-emerald-50 active:scale-95 transition-transform cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-grow">
          <h1 id="post-logo-title" className="font-sans font-extrabold text-lg text-[#0d631b]">Heart Hands</h1>
        </div>
        <div className="w-8 h-8 rounded-full border-2 border-[#0d631b] overflow-hidden">
          <img 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
            alt="Sarah profile" 
          />
        </div>
      </header>

      {/* Title Subtitle Block */}
      <div className="max-w-xl mx-auto px-4 mt-6">
        <div id="post-intro-header" className="mb-6 font-sans">
          <h2 className="text-3xl font-bold text-[#071e27]">Post a Donation</h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Help your neighbors by listing items you no longer need. Quick, transparent, and local.
          </p>
        </div>

        {/* Action Form */}
        <form id="post-donation-form" onSubmit={handleFormSubmit} className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-gray-150 shadow-sm space-y-4">
            
            {/* Form Title Input */}
            <div>
              <label htmlFor="donate-title-input" className="block text-xs font-bold uppercase tracking-wider text-[#071e27] mb-1.5 font-sans">
                Title
              </label>
              <div className="relative flex items-center">
                <input 
                  id="donate-title-input"
                  type="text" 
                  placeholder="e.g., Warm Winter Jackets for Kids" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#f3faff]/40 border border-gray-250 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0d631b] focus:outline-none focus:bg-white font-sans pr-10"
                  required
                />
                
                {/* AI suggestion sparkles trigger */}
                <button
                  id="ai-sparkle-autofill-btn"
                  type="button"
                  onClick={handleTriggerAiAnalysis}
                  title="Autofill category and enhance text using Gemini AI"
                  className="absolute right-3 text-[#0d631b] hover:text-[#1b6d24] transition-transform active:scale-90"
                >
                  <Sparkles className={`w-4.5 h-4.5 ${aiAnalyzing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Form Description Textarea */}
            <div>
              <label htmlFor="donate-desc-textarea" className="block text-xs font-bold uppercase tracking-wider text-[#071e27] mb-1.5 font-sans">
                Description
              </label>
              <textarea 
                id="donate-desc-textarea"
                rows={3}
                placeholder="Describe the items, their history, and any special notes for the recipient..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#f3faff]/40 border border-gray-250 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0d631b] focus:outline-none focus:bg-white font-sans resize-none"
              />
            </div>

            {/* Category and Condition layout Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category Dropdown Selection */}
              <div>
                <label htmlFor="donate-category-select" className="block text-xs font-bold uppercase tracking-wider text-[#071e27] mb-1.5 font-sans">
                  Category
                </label>
                <select 
                  id="donate-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-gray-250 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0d631b] focus:outline-none font-sans cursor-pointer"
                >
                  <option value="Food">Food</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Toys">Toys</option>
                  <option value="Shelter Supplies">Shelter Supplies</option>
                  <option value="Medical">Medical</option>
                  <option value="Other">Other</option>
                </select>
                {suggestedCategory && (
                  <span id="ai-category-alert" className="text-[10px] text-emerald-600 font-bold font-sans mt-1 flex items-center gap-1 animate-pulse">
                    <Check className="w-3.5 h-3.5" /> Categorized via Gemini Suggestions
                  </span>
                )}
              </div>

              {/* Condition Selection (Segmented Control matching Screen 3) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#071e27] mb-1.5 font-sans animate-fade-in">
                  Condition
                </label>
                <div id="condition-segmented-control" className="grid grid-cols-2 bg-[#f3faff] p-1.5 rounded-2xl border border-gray-100">
                  <button
                    id="condition-new-btn"
                    type="button"
                    onClick={() => setCondition('New')}
                    className={`py-2 px-3 text-xs font-bold font-sans rounded-xl transition-all cursor-pointer ${
                      condition === 'New' 
                        ? 'bg-white text-[#0d631b] shadow-sm' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    New
                  </button>
                  <button
                    id="condition-used-btn"
                    type="button"
                    onClick={() => setCondition('Used')}
                    className={`py-2 px-3 text-xs font-bold font-sans rounded-xl transition-all cursor-pointer ${
                      condition === 'Used' 
                        ? 'bg-white text-[#0d631b] shadow-sm' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Used
                  </button>
                </div>
              </div>
            </div>

            {/* Quantity Slider/Counter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#071e27] mb-1.5 font-sans">
                Quantity
              </label>
              <div id="quantity-counter-wrapper" className="flex items-center gap-3">
                <button
                  id="quantity-minus-btn"
                  type="button"
                  onClick={handleQuantityMinus}
                  className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-250 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:scale-95 transition-transform"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div id="quantity-display-val" className="w-16 h-10 rounded-xl bg-white border border-gray-250 flex items-center justify-center font-bold text-[#071e27] font-sans">
                  {quantity}
                </div>
                <button
                  id="quantity-plus-btn"
                  type="button"
                  onClick={handleQuantityAdd}
                  className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-250 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:scale-95 transition-transform"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* LOGISTIC PREFERENCE Box matching Screen 3 */}
          <div className="bg-white p-5 rounded-3xl border border-gray-150 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#071e27] font-sans">LOGISTIC PREFERENCE</h4>
              </div>
              <div id="logistic-toggle-segmented" className="grid grid-cols-2 bg-[#f3faff] p-1 rounded-xl border border-gray-150 w-44">
                <button
                  id="preference-pickup-btn"
                  type="button"
                  onClick={() => setLogisticPreference('Pickup')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    logisticPreference === 'Pickup' 
                      ? 'bg-[#0d631b] text-white shadow-sm' 
                      : 'text-gray-500 hover:text-[#071e27]'
                  }`}
                >
                  Pickup
                </button>
                <button
                  id="preference-dropoff-btn"
                  type="button"
                  onClick={() => setLogisticPreference('Drop-off')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    logisticPreference === 'Drop-off' 
                      ? 'bg-[#0d631b] text-white shadow-sm' 
                      : 'text-gray-500 hover:text-[#071e27]'
                  }`}
                >
                  Drop-off
                </button>
              </div>
            </div>

            {/* Meeting point with visual Map exactly as in screen 3 */}
            <div className="space-y-2">
              <label htmlFor="meeting-point-address" className="text-xs font-bold text-[#071e27] font-sans">
                Meeting Point
              </label>
              <div className="relative">
                <input 
                  id="meeting-point-address"
                  type="text" 
                  value={meetingPoint}
                  onChange={(e) => setMeetingPoint(e.target.value)}
                  className="w-full bg-[#f3faff]/40 border border-gray-250 rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#0d631b] focus:outline-none focus:bg-white font-sans"
                />
                <MapPin className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[#0d631b]" />
              </div>

              {/* Minimalist interactive map snippet matching Screen 3 GPS design */}
              <div id="logistic-mini-map" className="relative rounded-2xl overflow-hidden border border-gray-200 h-32 bg-[#e6f6ff]">
                <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="120" cy="50" r="40" fill="#a4f69c" fillOpacity="0.4" />
                  <line x1="0" y1="40" x2="300" y2="40" stroke="#fff" strokeWidth="4" />
                  <line x1="0" y1="80" x2="300" y2="100" stroke="#fff" strokeWidth="4" />
                  <line x1="100" y1="0" x2="150" y2="150" stroke="#fff" strokeWidth="4" />
                </svg>
                {/* Fixed center locator map pin */}
                <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="bg-[#0d631b] p-1.5 rounded-full shadow-lg text-white">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="bg-white/95 px-2 py-0.5 rounded-md shadow border border-gray-100 text-[9px] font-bold mt-1 max-w-[120px] truncate leading-none">
                    {meetingPoint}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MEDIA UPLOAD segment matching Screen 3 */}
          <div className="bg-white p-5 rounded-3xl border border-gray-150 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#071e27] font-sans">MEDIA UPLOAD</h4>
              <span id="media-count" className="text-xs text-gray-500 font-sans">{selectedPhotos.length} / 12 selected</span>
            </div>

            {/* Click to select preloaded real-world photos or custom simulation */}
            <p className="text-xs text-gray-500 font-sans -mt-2">
              Select/toggle real-world high quality charity items below to attach to your simulated listing:
            </p>
            <div id="media-selection-grid" className="grid grid-cols-3 gap-3">
              {PHOTO_MOCKUPS.map(photo => {
                const isSelected = selectedPhotos.includes(photo.url);
                return (
                  <div 
                    id={`media-item-${photo.id}`}
                    key={photo.id}
                    onClick={() => handleTogglePhoto(photo.url)}
                    className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${
                      isSelected ? 'border-[#0d631b]' : 'border-gray-200'
                    }`}
                  >
                    <img className="w-full h-full object-cover" src={photo.url} alt={photo.label} />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${
                        isSelected ? 'bg-[#0d631b]' : 'bg-black/60'
                      }`}>
                        {photo.label} {isSelected ? '✓' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Standard placeholders & videos section */}
            <div id="video-upload-section" className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 font-sans">
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-emerald-300 transition-colors cursor-pointer bg-gray-50/50">
                <Camera className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-[10px] font-bold text-[#071e27] uppercase tracking-wider">Take photo</span>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-emerald-300 transition-colors cursor-pointer bg-gray-50/50">
                <Video className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-[10px] font-bold text-[#071e27] uppercase tracking-wider">Upload Video</span>
              </div>
            </div>
          </div>

          {/* AI generated Tips panel if active */}
          {aiTags.length > 0 && (
            <div id="ai-tags-display-row" className="flex flex-wrap gap-1.5 p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100 animate-slide-up">
              <span className="text-xs font-bold text-[#0d631b] font-sans mr-2">Suggested tags:</span>
              {aiTags.map((t, idx) => (
                <span key={idx} className="bg-white text-emerald-800 text-[10px] px-2 py-0.5 rounded-full border border-emerald-200 font-mono font-bold">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Donation Tips Info card matching Screen 3 precisely */}
          <div id="donation-tips-info-card" className="bg-[#e6f6ff] p-4 rounded-3xl border border-blue-50 flex items-start gap-3">
            <div className="p-1 px-1.5 rounded-full bg-blue-100 text-blue-800 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-[13px] font-bold text-[#002204] font-sans">Donation Tips</h5>
              <p className="text-[11.5px] text-gray-600 mt-1 leading-relaxed font-sans">
                {aiTip || 'Items listed with clear photos and accurate conditions are 4x more likely to be claimed within 24 hours.'}
              </p>
            </div>
          </div>

          {/* Large bottom Post Button */}
          <button
            id="post-donation-submit-btn"
            type="submit"
            className="w-full bg-[#0d631b] hover:bg-[#1b6d24] text-white py-4 px-6 rounded-2xl font-bold font-sans text-sm shadow-md transition-all duration-200 active:scale-98"
          >
            Post Donation
          </button>
        </form>
      </div>
    </div>
  );
}
