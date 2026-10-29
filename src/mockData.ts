/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NGO, DonationItem, ChatSession } from './types';

export const INITIAL_NGOS: NGO[] = [
  {
    id: 'hope-shelter',
    name: 'Hope Shelter',
    description: 'Empowering individuals experiencing housing transitions and coordinating winter apparel drives.',
    type: 'Homelessness & Warmth',
    distance: 0.5,
    verified: true,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ_5VR-pKFq69D69BvM7fHJ8OMxClGateq2mo0DWUhLUNO9C2N09YVZPNc9AKTcqI0UQFhbLvvB8I8JN9uMaaiUH8LFzR48VrKwUDdg-o4W9T663usojKzmU-4uvRGStrVrrppOdlMTJZKFng1blDWaRLzuPLaP3mVR65kqbVNQXfj5JA0j8So2zeYwf9wCw_ovfteH8IBljxnn-DUNJFVfWecgMWtHG3AazWHfYD66hhc1SftMCCp-kN9Jm-zsUfjfVi4DRXQdgc',
    followed: true,
    location: { x: 35, y: 40, address: 'San Francisco, CA' },
    contactPerson: 'Sarah Jenkins',
  },
  {
    id: 'harbor-foundation',
    name: 'Harbor Foundation',
    description: 'Providing crisis shelter, secure rehabilitation resources, and local housing navigation guides.',
    type: 'Homelessness',
    distance: 0.8,
    verified: true,
    logo: 'anchor', // Semantic visual indicator processed programmatically
    followed: false,
    location: { x: 65, y: 25, address: 'Bay St, San Francisco, CA' },
    contactPerson: 'Marcos Diaz',
  },
  {
    id: 'green-steps',
    name: 'Green Steps Community',
    description: 'Upcycling and structural distribution of reusable resources, books, and green learning.',
    type: 'Sustainability',
    distance: 1.2,
    verified: true,
    logo: 'footprints',
    followed: false,
    location: { x: 75, y: 70, address: 'Mission District, San Francisco, CA' },
    contactPerson: 'Evelyn Cho',
  },
  {
    id: 'oak-valley',
    name: 'Oak Valley Kitchen',
    description: 'Supplying fresh hot meals, direct pantry boxes, and locally sourced organic ingredients.',
    type: 'Food Security',
    distance: 2.5,
    verified: true,
    logo: 'utensils',
    followed: false,
    location: { x: 20, y: 65, address: 'Oak Valley, San Francisco, CA' },
    contactPerson: 'Robert Miller',
  },
];

export const INITIAL_TRENDING_NEEDS: DonationItem[] = [
  {
    id: 'need-1',
    title: 'Food at St. Mary\'s Shelter',
    description: 'Collecting high-quality vegetables, shelf-stable canned protein, and rice bags to nourish families at St. Mary\'s Shelter.',
    category: 'Food',
    condition: 'New',
    quantity: 500,
    logisticPreference: 'Drop-off',
    meetingPoint: 'St. Mary\'s Hall, San Francisco',
    status: 'available',
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600'],
    priority: 'High',
    targetAmount: '500 lbs',
    collectedAmount: '320 lbs',
    ngoId: 'hope-shelter',
    createdAt: '2026-06-18T10:00:00Z',
  },
  {
    id: 'need-2',
    title: 'Books for City Youth Center',
    description: 'Empowering children with educational fiction and STEM manuals. We are seeking clean, gently-used youth literature.',
    category: 'Books',
    condition: 'Used',
    quantity: 100,
    logisticPreference: 'Drop-off',
    meetingPoint: 'City Youth Center Library, SF',
    status: 'available',
    images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600'],
    priority: 'Normal',
    targetAmount: '100 books',
    collectedAmount: '45 books',
    ngoId: 'green-steps',
    createdAt: '2026-06-18T11:30:00Z',
  },
];

export const INITIAL_CHATS: ChatSession[] = [
  {
    id: 'hope-shelter',
    ngoName: 'Hope Shelter',
    ngoLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ_5VR-pKFq69D69BvM7fHJ8OMxClGateq2mo0DWUhLUNO9C2N09YVZPNc9AKTcqI0UQFhbLvvB8I8JN9uMaaiUH8LFzR48VrKwUDdg-o4W9T663usojKzmU-4uvRGStrVrrppOdlMTJZKFng1blDWaRLzuPLaP3mVR65kqbVNQXfj5JA0j8So2zeYwf9wCw_ovfteH8IBljxnn-DUNJFVfWecgMWtHG3AazWHfYD66hhc1SftMCCp-kN9Jm-zsUfjfVi4DRXQdgc',
    online: true,
    lastMessageTime: '10:50 AM',
    messages: [
      {
        id: 'msg-1',
        sender: 'ngo',
        text: 'Hi Sarah! We received your inquiry about the donation. We would be happy to accept the winter coats for our local drive.',
        timestamp: '10:42 AM',
        type: 'text',
      },
      {
        id: 'msg-2',
        sender: 'user',
        text: 'That\'s great! I have 5 heavy-duty coats in excellent condition. Here\'s what they look like.',
        timestamp: '10:45 AM',
        type: 'text',
      },
      {
        id: 'msg-3',
        sender: 'user',
        text: 'Sent items photo evidence',
        timestamp: '10:46 AM',
        type: 'image',
        mediaUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCbSi35C3m5P8OhiYptMX8N9HVdskZZVPeBEHYnD3oOxKT77dOUFkjEeOjqbtLEW0n2Mt6j7-Ey_IjPHWoqWNoHyQyHXNxxld3I00Mt9pBFsS-XJuWwIINbv2Vt4VmvkXpw8cG6rQ3ekRM6S9Bj_IeU7XljEYEYVMp53ZQvUevTzJTqafAwsrK8Wo7SmI_dcupH0TN631jNmqvt8JN5VPDv-Je1aNyjlTZpcr3E_9bXmOmrjQhgGZ3eXsDDngCTf85uf2od1c_yn4',
        mediaLabel: '5 Items • Winter Essentials',
      },
      {
        id: 'msg-4',
        sender: 'ngo',
        text: 'Those look perfect! Where can we schedule the pickup? Or would you prefer to drop them off at our collection center?',
        timestamp: '10:48 AM',
        type: 'text',
      },
      {
        id: 'msg-5',
        sender: 'user',
        text: 'Shared location: Home Pickup',
        timestamp: '10:50 AM',
        type: 'location',
        mediaUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH7H4euTrMsrmINYbHuvaQ3FfMly5Zp8IFG_TP9tF27NbvYNJgUVtSyXjDxOnnLYjNsKeTxXjK1FAifVe4KuusDxVVdd-i-AiBJFKvl9JjL0WGVFg7-ZpkPWGCR7yHkzhpZ7XPnaQ0-yARfKLC5DfDr3T_CB2jfMS5-VsKbiCZmXzMdeztkiJoUWaCwWDdV2WJf03KgAT_YITX-k9gNoJGZsmrECANBeTQL0aleivCUln5OYIe9xTX6vmc97g_ls0E4iUvuM8l08I',
        mediaLabel: '123 Charity Lane, Seattle, WA 98101',
      },
    ],
  },
];
