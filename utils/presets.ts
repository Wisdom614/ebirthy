import { SceneConfig, ThemeDefinition, ThemeId } from '../types/scene';

export const THEME_DEFINITIONS: Record<ThemeId, ThemeDefinition> = {
  gold: {
    id: 'gold',
    name: 'Warm Linen & Ochre',
    description: 'Natural architectural linen paper, rich ochre amber, and deep charcoal ink.',
    backgroundClass: 'bg-[#f7f4ed] grid-bg text-[#1c1917]',
    cardClass: 'bg-[#ffffff] border-2 border-[#1c1917] text-[#1c1917] shadow-[4px_4px_0px_#1c1917]',
    accentClass: 'from-amber-400 to-amber-500',
    textGlow: 'none',
    defaultPrimary: '#f59e0b',
    defaultSecondary: '#1c1917',
    defaultMusic: 'orchestral',
    particlesColor: ['#f59e0b', '#d97706', '#1c1917', '#dc2626', '#2563eb']
  },
  neon: {
    id: 'neon',
    name: 'Bauhaus Vermillion',
    description: 'Cream stone surface with high-contrast vermillion red and international cobalt.',
    backgroundClass: 'bg-[#fbf8f3] grid-bg text-[#1c1917]',
    cardClass: 'bg-[#ffffff] border-2 border-[#1c1917] text-[#1c1917] shadow-[4px_4px_0px_#1c1917]',
    accentClass: 'from-red-600 to-blue-600',
    textGlow: 'none',
    defaultPrimary: '#dc2626',
    defaultSecondary: '#2563eb',
    defaultMusic: 'synthwave',
    particlesColor: ['#dc2626', '#2563eb', '#f59e0b', '#1c1917', '#ffffff']
  },
  pastel: {
    id: 'pastel',
    name: 'Sandstone & Sage',
    description: 'Tactile warm sandstone, natural forest sage, and raw terracotta accents.',
    backgroundClass: 'bg-[#f4efe6] grid-bg text-[#1c1917]',
    cardClass: 'bg-[#ffffff] border-2 border-[#1c1917] text-[#1c1917] shadow-[4px_4px_0px_#1c1917]',
    accentClass: 'from-emerald-600 to-stone-800',
    textGlow: 'none',
    defaultPrimary: '#15803d',
    defaultSecondary: '#ea580c',
    defaultMusic: 'chill-lofi',
    particlesColor: ['#15803d', '#ea580c', '#f59e0b', '#1c1917', '#f4efe6']
  },
  fireworks: {
    id: 'fireworks',
    name: 'Swiss Cobalt International',
    description: 'Clean architectural titanium paper with vibrant Swiss cobalt and signal orange.',
    backgroundClass: 'bg-[#f8fafc] grid-bg text-[#1c1917]',
    cardClass: 'bg-[#ffffff] border-2 border-[#1c1917] text-[#1c1917] shadow-[4px_4px_0px_#1c1917]',
    accentClass: 'from-blue-600 to-amber-500',
    textGlow: 'none',
    defaultPrimary: '#1d4ed8',
    defaultSecondary: '#ea580c',
    defaultMusic: 'festive',
    particlesColor: ['#1d4ed8', '#ea580c', '#f59e0b', '#1c1917', '#ffffff']
  },
  retro: {
    id: 'retro',
    name: 'Architectural Stone & Gold',
    description: 'Structured tactile stone paper, rich amber gold, and high-contrast charcoal ink.',
    backgroundClass: 'bg-[#eeeae0] grid-bg text-[#1c1917]',
    cardClass: 'bg-[#ffffff] border-2 border-[#1c1917] text-[#1c1917] shadow-[4px_4px_0px_#1c1917]',
    accentClass: 'from-amber-400 to-yellow-500',
    textGlow: 'none',
    defaultPrimary: '#f59e0b',
    defaultSecondary: '#1c1917',
    defaultMusic: 'festive',
    particlesColor: ['#f59e0b', '#d97706', '#1c1917', '#dc2626', '#3b82f6']
  }
};

export const DEFAULT_SCENE: SceneConfig = {
  recipientName: 'Alex',
  senderName: 'Your Best Friend',
  relationship: 'Best Friend',
  age: 24,
  headline: 'ANOTHER YEAR OF BEING ABSOLUTELY LEGENDARY',
  wishes: 'May your year ahead be packed with bold moves, unstoppable laughter, huge milestones, and pure excellence.',
  letterText: "Happy Birthday! ✦\n\nI wanted to take a moment to celebrate the incredible human being you are. Thank you for always bringing so much energy, focus, and genuine kindness everywhere you go.\n\nMake a big wish today—this year is going to be your greatest chapter yet.",
  fontStyle: 'modern',
  theme: 'gold',
  primaryColor: '#f59e0b',
  secondaryColor: '#1c1917',
  
  balloonCount: 8,
  balloonColors: ['#f59e0b', '#ea580c', '#2563eb', '#15803d', '#1c1917'],
  enableBalloons: true,
  
  candleCount: 3,
  enableCake: true,
  cakeFlavor: 'chocolate',
  
  enableGift: true,
  giftContent: {
    title: 'SPECIAL BIRTHDAY REVEAL · PRIZE 01',
    message: 'Surprise! You have unlocked 1 Free Birthday Dinner & Unlimited Good Vibes!',
    voucherCode: 'BDAY-VIP-2026'
  },
  
  enablePhotoReel: true,
  photos: [
    {
      id: 'photo-1',
      url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80',
      caption: 'ARCHIVE ITEM 01 · Celebrating good times',
      rotation: 0
    },
    {
      id: 'photo-2',
      url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
      caption: 'ARCHIVE ITEM 02 · Memories that shine bright',
      rotation: 0
    },
    {
      id: 'photo-3',
      url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80',
      caption: 'ARCHIVE ITEM 03 · To many sweet years ahead',
      rotation: 0
    }
  ],
  
  musicTrack: 'orchestral',
  enableConfettiCannon: true,
  enableFireworks: true,
  autoPlayCelebration: true,
  enableGuestbook: true,
  enableTimeLock: false,
  unlockDateTime: '',
  voiceNoteUrl: '',
  voiceNoteDuration: 0
};

export const PRESET_TEMPLATES: Record<string, { name: string; tag: string; iconName: 'scroll' | 'compass' | 'leaf' | 'zap'; config: SceneConfig }> = {
  'warm-linen': {
    name: 'Warm Linen & Ochre',
    tag: 'EDITION 01',
    iconName: 'scroll',
    config: {
      ...DEFAULT_SCENE,
      recipientName: 'Alex',
      relationship: 'Best Friend',
      theme: 'gold',
      headline: 'LEVELING UP TODAY · MILESTONE UNLOCKED',
      wishes: 'To my favorite partner-in-crime: may your day be as bold, memorable, and unforgettable as our best stories!',
      letterText: "Happy Birthday buddy!\n\nFrom all the crazy adventures to the non-stop laughs, life is 1000x more fun with you around. Let's make this year another legendary milestone.",
      musicTrack: 'orchestral',
      cakeFlavor: 'chocolate',
      balloonCount: 8
    }
  },
  'bauhaus-vermillion': {
    name: 'Bauhaus Vermillion',
    tag: 'EDITION 02',
    iconName: 'compass',
    config: {
      ...DEFAULT_SCENE,
      recipientName: 'Sam',
      relationship: 'Partner',
      theme: 'neon',
      headline: 'HAPPY BIRTHDAY TO MY ENTIRE WORLD',
      wishes: 'Every day with you is a gift, but today is the most special of all. Thank you for bringing endless warmth and depth to everything.',
      letterText: "My love,\n\nOn your special day, I just want to remind you how deeply you are loved and cherished. You bring so much light and joy into my life.\n\nHere's to celebrating you today and always.",
      musicTrack: 'synthwave',
      cakeFlavor: 'strawberry',
      balloonColors: ['#dc2626', '#2563eb', '#f59e0b', '#1c1917', '#ffffff'],
      balloonCount: 8
    }
  },
  'sandstone-sage': {
    name: 'Sandstone & Sage',
    tag: 'EDITION 03',
    iconName: 'leaf',
    config: {
      ...DEFAULT_SCENE,
      recipientName: 'Chloe',
      relationship: 'Sister',
      theme: 'pastel',
      headline: 'CELEBRATING ANOTHER REMARKABLE CHAPTER',
      wishes: 'Sending you the warmest birthday wishes wrapped in elegance, clarity, and bold ambitions.',
      letterText: "Dearest Chloe,\n\nMay your birthday be filled with joyful surprises and unforgettable moments with the people you cherish most.\n\nKeep shining bright.",
      musicTrack: 'chill-lofi',
      cakeFlavor: 'vanilla',
      balloonCount: 8
    }
  },
  'swiss-cobalt': {
    name: 'Swiss Cobalt',
    tag: 'EDITION 04',
    iconName: 'zap',
    config: {
      ...DEFAULT_SCENE,
      recipientName: 'David',
      relationship: 'Brother',
      theme: 'fireworks',
      headline: 'LIGHT UP THE SKIES · BIG DAY AHEAD',
      wishes: 'Aim for the highest peaks this year. Wishing you relentless drive, health, and limitless triumph.',
      letterText: "Happy Birthday David!\n\nAnother lap around the sun and you keep setting the bar higher. Keep dreaming big, working hard, and enjoying the ride.",
      musicTrack: 'festive',
      cakeFlavor: 'chocolate',
      balloonCount: 8
    }
  }
};
