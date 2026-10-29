/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'donor' | 'receiver' | 'volunteer';

export interface NGO {
  id: string;
  name: string;
  description: string;
  type: string;
  distance: number;
  verified: boolean;
  logo: string;
  followed: boolean;
  location: { x: number; y: number; address: string };
  contactPerson: string;
}

export interface DonationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: 'New' | 'Used';
  quantity: number;
  logisticPreference: 'Pickup' | 'Drop-off';
  meetingPoint: string;
  status: 'available' | 'claimed' | 'completed';
  images: string[];
  priority: 'Normal' | 'High';
  targetAmount?: string;
  collectedAmount?: string;
  donorId?: string;
  ngoId?: string;
  createdAt: string;
}

export type MediaPayloadType = 'text' | 'image' | 'location';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ngo';
  text: string;
  timestamp: string; // e.g. "10:42 AM"
  type: MediaPayloadType;
  mediaUrl?: string;
  mediaLabel?: string;
}

export interface ChatSession {
  id: string; // NGO id of the recipient
  ngoName: string;
  ngoLogo: string;
  online: boolean;
  lastMessageTime: string;
  messages: ChatMessage[];
}
