// Define the simple interfaces for our mock data
export interface Player {
  id: string;
  name: string;
  uniqueId: string;
  course: string;
  photo: string;
  rating: number;
  sport: string;
  basePrice: number;
  specialSkills?: string[];
}

export interface House {
  id: string;
  name: string;
  color: string;
  balance: number;
  logo: string;
}

export const houses: House[] = [
  { id: "h1", name: "KEEN KICKERS", color: "#4ADE80", balance: 30000, logo: "/pic1.png" },
  { id: "h2", name: "MIGHTY BOLTZ", color: "#A78BFA", balance: 30000, logo: "/pic2.png" },
  { id: "h3", name: "SUPER SPADES", color: "#22D3EE", balance: 30000, logo: "/pic3.png" },
  { id: "h4", name: "HEROIC HEARTS", color: "#F87171", balance: 30000, logo: "/pic4.png" },
];

export const players: Player[] = [
  {
    id: "p1", name: "Uday Shekhar", uniqueId: "m24bbau0337", course: "B.Tech CSE",
    photo: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&h=400&fit=crop",
    rating: 8.5, sport: "Cricket", basePrice: 1000,
    specialSkills: ["All-rounder", "Power Hitter", "Spin Bowling"],
  },
  {
    id: "p2", name: "Arjun Patel", uniqueId: "m24bbau0421", course: "B.Tech CSE",
    photo: "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=400&h=400&fit=crop",
    rating: 9.2, sport: "Cricket", basePrice: 1500,
    specialSkills: ["Fast Bowler", "Death Overs Specialist"],
  },
  {
    id: "p3", name: "Rohan Sharma", uniqueId: "m24bbau0298", course: "BBA",
    photo: "https://images.unsplash.com/photo-1546456073-92b9f0a8d413?w=400&h=400&fit=crop",
    rating: 8.8, sport: "Football", basePrice: 1200,
    specialSkills: ["Striker", "Speed", "Headers"],
  },
   {
    id: "p4", name: "Vikram Singh", uniqueId: "m24bbau0512", course: "B.Tech ECE",
    photo: "https://images.unsplash.com/photo-1547347298-4074aef93e98?w=400&h=400&fit=crop",
    rating: 9.5, sport: "Basketball", basePrice: 2000,
    specialSkills: ["Point Guard", "3-Point Shooter"],
  },
];