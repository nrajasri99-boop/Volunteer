/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, Award, ShieldCheck, Heart, Trash, HelpCircle, ChevronRight, Sparkles, RefreshCw, Zap, Clock } from 'lucide-react';
import { UserRole } from '../types';

interface ProfileScreenProps {
  role: UserRole;
  onRoleChange: (newRole: UserRole) => void;
  donationCount: number;
}

export default function ProfileScreen({ role, onRoleChange, donationCount }: ProfileScreenProps) {
  
  // Custom badges based on acts of giving
  const donorBadges = [
    { title: 'Kind Heart', desc: 'First local donation published', icon: '❤️' },
    { title: 'Generous Neighbor', desc: 'Gave winter coats packages', icon: '🧥' },
    { title: 'Local Sustenance', desc: 'Sponsered food drives', icon: '🥦' },
  ];

  return (
    <div id="profile-screen-root" className="pb-24 animate-fade-in max-w-xl mx-auto px-4 pt-4">
      {/* Upper header section */}
      <h2 id="profile-header-title" className="text-3xl font-extrabold text-[#071e27] font-sans">My Account</h2>
      <p className="text-xs text-gray-500 font-sans mt-1">Configure your local role status, check philanthropic accomplishments, and verify achievements.</p>

      {/* Avatar Card */}
      <div id="profile-avatar-card" className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm mt-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-20 h-20 rounded-full border-4 border-emerald-500 overflow-hidden shadow-md shrink-0">
          <img 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
            alt="Sarah J" 
          />
        </div>
        <div className="text-center sm:text-left flex-grow">
          <div className="flex items-center justify-center sm:justify-start gap-1.5">
            <h3 id="profile-user-name" className="text-xl font-bold font-sans text-[#071e27]">Sarah Jenkins</h3>
            <ShieldCheck className="w-5 h-5 text-emerald-500 fill-emerald-50" />
          </div>
          <p className="text-xs text-gray-400 font-sans">Active Donor • Member since Jan 2026</p>
          <div id="profile-role-badge" className="mt-2.5 inline-flex items-center gap-1 bg-[#cbffc2]/40 text-[#0d631b] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full font-mono">
            {role === 'donor' && '❤️ Local Donor'}
            {role === 'receiver' && '🤝 Receiving Assistance'}
            {role === 'volunteer' && '⚡ Logistics Volunteer'}
          </div>
        </div>
      </div>

      {/* Dynamic Role Switcher Control */}
      <div id="profile-role-switcher" className="bg-white rounded-3xl border border-gray-150 p-5 mt-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#071e27] font-sans">Switch Portal View</h4>
          <RefreshCw className="w-4 h-4 text-gray-400" />
        </div>
        <p className="text-xs text-gray-550 leading-relaxed">
          Toggling changes focus from Donor lists to active Volunteer coordinations or requested Assistance inquiries.
        </p>
        <div className="grid grid-cols-3 gap-2 pt-1 font-sans">
          <button
            id="switch-donor"
            onClick={() => onRoleChange('donor')}
            className={`py-2 px-1 text-center font-bold text-[11px] rounded-xl border transition-all cursor-pointer ${
              role === 'donor' 
                ? 'bg-emerald-50 text-[#0d631b] border-[#0d631b] shadow-sm' 
                : 'bg-white text-gray-600 border-gray-150 hover:bg-gray-50'
            }`}
          >
            Donor
          </button>
          <button
            id="switch-receiver"
            onClick={() => onRoleChange('receiver')}
            className={`py-2 px-1 text-center font-bold text-[11px] rounded-xl border transition-all cursor-pointer ${
              role === 'receiver' 
                ? 'bg-blue-50 text-blue-800 border-blue-500 shadow-sm' 
                : 'bg-white text-gray-600 border-gray-150 hover:bg-gray-50'
            }`}
          >
            Receiver
          </button>
          <button
            id="switch-volunteer"
            onClick={() => onRoleChange('volunteer')}
            className={`py-2 px-1 text-center font-bold text-[11px] rounded-xl border transition-all cursor-pointer ${
              role === 'volunteer' 
                ? 'bg-amber-50 text-amber-800 border-amber-500 shadow-sm' 
                : 'bg-white text-gray-600 border-gray-150 hover:bg-gray-50'
            }`}
          >
            Volunteer
          </button>
        </div>
      </div>

      {/* Philanthropic impact statistics section */}
      <h4 id="impact-stats-header" className="text-sm font-bold uppercase tracking-wider text-gray-400 mt-6 mb-3 font-sans">My Impact Statistics</h4>
      
      {role === 'donor' && (
        <div id="donor-stats-grid" className="grid grid-cols-2 gap-4 font-sans max-w-md">
          <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
            <span className="text-xs text-gray-500">Items Listed & Donated</span>
            <span className="text-3xl font-extrabold text-[#071e27] mt-1">{donationCount}</span>
            <span className="text-[10px] text-emerald-600 mt-2 flex items-center gap-0.5 font-bold">● Active community donor</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
            <span className="text-xs text-gray-500 font-sans">Coordinated Drops</span>
            <span className="text-3xl font-extrabold text-[#071e27] font-sans mt-1">3</span>
            <span className="text-[10px] text-gray-500 mt-2 font-mono">1 pending handover</span>
          </div>
        </div>
      )}

      {role === 'volunteer' && (
        <div id="volunteer-stats-grid" className="grid grid-cols-2 gap-4 tracking-normal">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between font-sans">
            <span className="text-xs text-gray-500">Active Deliveries Completed</span>
            <span className="text-3xl font-extrabold text-[#071e27] mt-1">8 Runs</span>
            <span className="text-[10px] text-amber-600 mt-2 font-bold font-mono">✦ Golden Logistics Badge</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between font-sans">
            <span className="text-xs text-gray-500">Coordinating Hours</span>
            <span className="text-3xl font-extrabold text-[#071e27] mt-1">14.5 Hrs</span>
            <span className="text-[10px] text-gray-400 mt-2 font-mono">Seattle & SF areas combined</span>
          </div>
        </div>
      )}

      {role === 'receiver' && (
        <div id="receiver-stats-grid" className="grid grid-cols-2 gap-4 tracking-wide font-sans">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <span className="text-xs text-slate-500">Active Inquiries Published</span>
            <span className="text-3xl font-extrabold text-[#071e27] mt-1">1 Request</span>
            <span className="text-[10px] text-rose-600 mt-2 font-bold animate-pulse">● Safe verification active</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <span className="text-xs text-gray-500 text-slate-500">Matched Support Units</span>
            <span className="text-3xl font-extrabold text-[#071e27] mt-1">0 Got</span>
            <span className="text-[10px] text-gray-400 mt-2 font-mono">Connecting local volunteers</span>
          </div>
        </div>
      )}

      {/* Achievement Unlocks matching Design spec styling */}
      <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mt-6 mb-3 font-sans">Badges & Unlocks</h4>
      <div id="badges-container" className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-sm divide-y divide-gray-100 font-sans">
        {donorBadges.map((badge, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between hover:bg-[#f3faff]/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#cbffc2]/30 flex items-center justify-center text-lg shadow-inner shrink-0">
                {badge.icon}
              </div>
              <div>
                <h5 className="text-sm font-bold text-[#071e27]">{badge.title}</h5>
                <p className="text-xs text-gray-500 mt-0.5">{badge.desc}</p>
              </div>
            </div>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
        ))}
      </div>

    </div>
  );
}
