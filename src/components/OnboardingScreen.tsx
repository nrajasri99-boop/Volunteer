/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Handshake, ShieldAlert, ChevronRight, UserPlus } from 'lucide-react';
import { UserRole } from '../types';

interface OnboardingScreenProps {
  onSelectRole: (role: UserRole) => void;
  onLogin: () => void;
}

export default function OnboardingScreen({ onSelectRole, onLogin }: OnboardingScreenProps) {
  return (
    <div id="onboarding-root" className="min-h-screen bg-[#f3faff] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Upper Brand Info */}
      <div id="onboarding-brand-header" className="flex flex-col items-center text-center pt-8">
        <div id="onboarding-logo-wrapper" className="flex items-center justify-center bg-[#0d631b] p-3 rounded-2xl shadow-lg mb-4 hover:scale-105 transition-transform">
          <Heart className="w-8 h-8 text-white fill-white" />
        </div>
        <h1 id="onboarding-brand-name" className="text-3xl font-bold font-sans tracking-tight text-[#071e27] flex items-center gap-1">
          Heart Hands
        </h1>
        <p id="onboarding-brand-subtitle" className="mt-2 text-[#40493d] font-sans text-sm tracking-wide font-medium">
          Connecting Kindness to Needs
        </p>
      </div>

      {/* Main Choice Panels */}
      <div id="onboarding-selection-container" className="max-w-md w-full mx-auto space-y-6 my-auto pt-6">
        {/* Donor Card */}
        <button
          id="onboarding-role-donor"
          onClick={() => onSelectRole('donor')}
          className="group w-full text-left bg-[#ffffff] p-6 rounded-2xl border border-gray-100 hover:border-green-150 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 opacity-5 group-hover:scale-110 transition-transform origin-top-right text-[#0d631b]">
            <Heart className="w-24 h-24" />
          </div>
          
          <div className="flex items-start gap-4">
            <div id="donor-icon" className="p-3 bg-green-50 text-[#0d631b] rounded-xl group-hover:bg-[#0d631b] group-hover:text-white transition-colors duration-300">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div className="flex-1">
              <h3 id="donor-title" className="text-lg font-bold text-[#071e27] font-sans">
                I want to Donate
              </h3>
              <p id="donor-description" className="mt-1 text-sm text-[#40493d] font-sans leading-relaxed">
                Share your extra food, clothing, or resources with neighbors in need.
              </p>
              <div id="donor-action" className="mt-4 flex items-center gap-1 text-[#0d631b] text-xs font-bold leading-none">
                Start giving
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </button>

        {/* Assistance Card */}
        <button
          id="onboarding-role-receiver"
          onClick={() => onSelectRole('receiver')}
          className="group w-full text-left bg-[#ffffff] p-6 rounded-2xl border border-gray-100 hover:border-blue-150 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 opacity-5 group-hover:scale-110 transition-transform origin-top-right text-blue-600">
            <Handshake className="w-24 h-24" />
          </div>

          <div className="flex items-start gap-4 font-sans">
            <div id="assist-icon" className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <Handshake className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 id="assist-title" className="text-lg font-bold text-[#071e27] font-sans">
                I need Assistance
              </h3>
              <p id="assist-description" className="mt-1 text-sm text-[#40493d] font-sans leading-relaxed">
                Request essential items or support from your local community safely.
              </p>
              <div id="assist-action" className="mt-4 flex items-center gap-1 text-blue-600 text-xs font-bold leading-none">
                Request help
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </button>

        {/* Volunteer Card */}
        <button
          id="onboarding-role-volunteer"
          onClick={() => onSelectRole('volunteer')}
          className="group w-full text-left bg-[#ffffff] p-6 rounded-2xl border border-gray-100 hover:border-amber-150 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
        >
          {/* Simulated vehicle/delivery tracking wheel context */}
          <div className="absolute right-0 top-0 opacity-5 group-hover:scale-110 transition-transform origin-top-right text-amber-600">
            <UserPlus className="w-24 h-24" />
          </div>

          <div className="flex items-start gap-4">
            <div id="volunteer-icon" className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
              <span className="material-symbols-outlined font-bold text-2xl leading-none">stars</span>
            </div>
            <div className="flex-1">
              <h3 id="volunteer-title" className="text-lg font-bold text-[#071e27] font-sans">
                I want to Volunteer
              </h3>
              <p id="volunteer-description" className="mt-1 text-sm text-[#40493d] font-sans leading-relaxed">
                Help transport items or offer your time to bridge the gap in your area.
              </p>
              <div id="volunteer-action" className="mt-4 flex items-center gap-1 text-amber-700 text-xs font-bold leading-none">
                Join as volunteer
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Already user login */}
      <div id="onboarding-footer" className="mt-8 text-center text-sm font-sans text-gray-500">
        Already have an account?{' '}
        <button
          id="onboarding-login-btn"
          onClick={onLogin}
          className="font-bold text-[#0d631b] hover:underline cursor-pointer active:scale-95 transition-transform"
        >
          Log in
        </button>
      </div>
    </div>
  );
}
