
import React from 'react';

export const STEPS = [
  { id: 1, title: 'Gallery Context', percentage: 0 },
  { id: 2, title: 'Product Interest', percentage: 16 },
  { id: 3, title: 'Device Quantities', percentage: 33 },
  { id: 4, title: 'Languages', percentage: 50 },
  { id: 5, title: 'Content Scope', percentage: 66 },
  { id: 6, title: 'Technical Readiness', percentage: 83 },
  { id: 7, title: 'Goals & Commercials', percentage: 100 },
];

export const CURRENCIES: string[] = ['EUR', 'USD', 'GBP', 'EGP', 'AED', 'SAR', 'TRY', 'Custom'];

export const OPTIONS = {
  usage: ['Own gallery', 'Exhibitions/fairs'],
  products: ['AI-only handset', 'NFC-only guide', 'AI + NFC handset'],
  languages: [
    'Arabic', 'English', 'Spanish', 'French', 'German', 
    'Portuguese', 'Russian', 'Italian', 'Polish', 'Ukrainian', 
    'Mandarin Chinese', 'Hindi', 'Urdu', 'Japanese', 'Turkish'
  ],
  points: ['<10', '10-15', '15-20', '20-25', '30+'],
  updates: ['Monthly', '2 months', '3 months', '4 months', '5 months', '6+ months'],
  objectives: [
    'Increase engagement',
    'Increase dwell time',
    'Increase revenue per visitor',
    'Improve accessibility',
    'Modernize brand perception',
    'Replace outdated system'
  ],
  commercials: ['Upfront purchase', 'Leasing', 'Revenue share', 'Not sure']
};
