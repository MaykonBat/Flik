export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  location: string;
  imageUrl?: string;
  creatorFid: number;
  creatorName?: string;
  creatorAddress?: string;
  attendees: number[]; // Array of FIDs
  category?: string;
  maxAttendees?: number;
  price?: number; // in USDC (optional)
  createdAt: string; // ISO string
}

export interface CreateEventInput {
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  category?: string;
  maxAttendees?: number;
  price?: number;
}

