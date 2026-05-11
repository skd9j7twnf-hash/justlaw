export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'client' | 'lawyer';
  photoURL?: string;
  verified?: boolean;
  specialty?: string;
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  pricePerConsultation?: number;
  description?: string;
  rating?: number;
  reviewCount?: number;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastTimestamp?: any;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: any;
}

export interface Review {
  id: string;
  lawyerId: string;
  clientId: string;
  rating: number;
  comment: string;
  timestamp: any;
}

export interface VerificationRequest {
  id: string;
  lawyerId: string;
  licenseNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  collegeName: string;
  timestamp: any;
}

export type AppView = 'onboarding' | 'home' | 'lawyer-profile' | 'chat' | 'checkout' | 'success' | 'map-view' | 'admin-panel' | 'lawyer-settings';
