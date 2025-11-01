import { Models } from 'appwrite';

export type PlayerDocument = Models.Document & {
  name: string;
  uniqueId: string;
  course: string;
  photo: string;
  rating: number;
  sport: string;
  basePrice: number;
  specialSkills?: string[];
  isSold: boolean;
  sellingPrice?: number;
  houseId?: string;
};

export type HouseDocument = Models.Document & {
  name: string;
  color: string;
  balance: number;
  logo: string;
};

export type AuctionStateDocument = Models.Document & {
  currentPlayerId: string | null;
  currentBid: number | null;
  winningHouseId: string | null;
  isAuctionActive: boolean;
  statusMessage: string | null;
};