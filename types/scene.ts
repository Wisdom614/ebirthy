export type ThemeId = 'gold' | 'neon' | 'pastel' | 'fireworks' | 'retro';

export type FontStyle = 'playful' | 'elegant' | 'modern' | 'handwritten';

export interface PhotoMemory {
  id: string;
  url: string;
  caption: string;
  rotation?: number;
}

export interface GiftContent {
  title: string;
  message: string;
  photoUrl?: string;
  voucherCode?: string;
}

export interface SceneConfig {
  id?: string;
  recipientName: string;
  senderName: string;
  relationship: string;
  age?: number;
  headline: string;
  wishes: string;
  letterText: string;
  fontStyle: FontStyle;
  theme: ThemeId;
  primaryColor: string;
  secondaryColor: string;
  
  // Interactive Elements
  balloonCount: number;
  balloonColors: string[];
  enableBalloons: boolean;
  
  candleCount: number;
  enableCake: boolean;
  cakeFlavor: 'chocolate' | 'strawberry' | 'vanilla' | 'rainbow';
  
  enableGift: boolean;
  giftContent: GiftContent;
  
  enablePhotoReel: boolean;
  photos: PhotoMemory[];
  
  enableGuestbook?: boolean;
  
  // Audio & Atmosphere
  musicTrack: 'festive' | 'chill-lofi' | 'orchestral' | 'synthwave' | 'acoustic' | 'none';
  enableConfettiCannon: boolean;
  enableFireworks: boolean;
  autoPlayCelebration: boolean;
}

export type GuestbookStamp = 'celebrate' | 'fire' | 'heart' | 'star' | 'zap' | 'cake';

export interface GuestbookEntry {
  id: string;
  scene_slug: string;
  sender_name: string;
  message: string;
  stamp: GuestbookStamp;
  created_at: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  backgroundClass: string;
  cardClass: string;
  accentClass: string;
  textGlow: string;
  defaultPrimary: string;
  defaultSecondary: string;
  defaultMusic: SceneConfig['musicTrack'];
  particlesColor: string[];
}
