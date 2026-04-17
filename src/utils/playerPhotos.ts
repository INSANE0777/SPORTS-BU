// Player photo mappings for the 53 selected auction players
// Maps player name (as stored in DB) → image path in /public
const PLAYER_PHOTOS: Record<string, string> = {
  // Athletics girls
  "Myra Tyagi": "/Myra new.jpeg",
  "Prashansa Chauhan": "/Prashansa Chauhan.png",

  // Badminton boys
  "Harshit dhankar": "/Harshit dhankar.jpg",
  "Ishant kathait": "/Ishant kathait.jpg",
  "mayank yadav": "/mayank yadav.jpg",
  "arjun nema": "/arjun nema.jpg",
  "savi arora": "/savi arora.jpg",

  // Badminton girls
  "Bhumika garg": "/Bhumika Garg.jpg",
  "Neharika": "/Neharika.jpg",

  // Basketball girls
  // Basketball girls
// Basketball girls (FIXED)
"Anushka singh": "/Anushka Singh.jpeg",
"aakarshi nigam": "/Aakarshi new.jpeg",
"Pragya Saraswat": "/Pragya Saraswat.jpeg",
"Kanan Sehrawat": "/Kanan Sehrawat.jpeg", // FIXED spelling
"Vanshika Dhaka": "/Vanshika Dhaka.jpeg",
"Meenal Singh": "/Meenal.jpeg", // FIXED full name
  
  // Chess
  "Harshit Singh Chauhan": "/Harshit Singh Chauhan.jpg",

  // Cricket
  "kaustubh": "/kaustubh.jpg",
  "shivansh": "/shivansh.jpg",
  "Dabeer": "/Dabeer.jpg",
  "anubhav": "/anubhav.jpg",
  "Aditya": "/Aditya.jpg",

  // Football
  "Shreedar": "/Shreedar.jpg",
  "Abhinav Baisoya": "/Abhinav Baisoya.jpg",
  "Soham Aich": "/Soham Aich.jpg",
  "Jai Kadian": "/Jai Kadian.jpg",
  "Akshat Khandelwal": "/Akshat Khandelwal.jpg",
  "Ajay Adhikari": "/Ajay Adhikari.jpg",
  "Sarthak Singhal": "/Sarthak Singhal.jpg",
  "Sarvagya Mishra": "/Sarvagya Mishra.jpg",

  // Kabaddi
  "Pranjal": "/Pranjal.jpg",
  "Shlesh": "/Shlesh.jpg",
  "Bhanu": "/Bhanu.jpg",
  "Shubham": "/Shubham.png",

  // Pickleball girls (Myra Tyagi already mapped above)

  // Pool and snooker
  "Harshit Agarwal": "/Harshit Agarwal.jpg",

  // Squash
  "Shaurya Rastogi": "/Shaurya Rastogi .jpeg",

  // Swimming
  "Ashmit Punia": "/ashmit photo.jpeg",

  // Table tennis boys
  "Navam Upadhyay": "/Navam Upadhyay.jpg",

  // Table tennis girls
  "Aarya Giri": "/Aarya giri.jpg",

  // Tennis boys
  "Sarman Raj": "/Sarman raj.jpg",

  // Tennis girls (Myra Tyagi already mapped above)

  // Volleyball boys
  "Mayank Sah": "/Mayank Sah.jpg",
  "Nikunj": "/Nikunj.jpg",
  "Shresth Singh": "/Shresth Singh.JPG",
  "Kunal": "/Kunal.jpg",
  "Harsh Chandel": "/Harsh Chandel.jpg",
  "Prince": "/Prince.jpg",

  // Volleyball girls
  "Prarthana Rana": "/Prarthana Rana.jpg",
  "Stuti Agarwal": "/Stuti Agarwal.jpg",
  "Neeyati Shukla": "/Neeyati Shukla.jpg",
  "Divyanshi": "/Divyanshi.jpg",
  "Prashansha": "/Prashansha.jpg",
};


/**
 * Get the local photo path for a player by name
 * @param playerName The player's name
 * @returns Local photo path or undefined if not found
 */
export function getPlayerPhoto(playerName: string): string | undefined {
  // Try exact match first
  if (PLAYER_PHOTOS[playerName]) return PLAYER_PHOTOS[playerName];
  
  // Try case-insensitive match
  const lowerName = playerName.toLowerCase();
  for (const [key, value] of Object.entries(PLAYER_PHOTOS)) {
    if (key.toLowerCase() === lowerName) return value;
  }
  
  return undefined;
}

/**
 * Normalize a photo URL - returns local photo if available, otherwise returns the provided URL
 * @param playerName The player's name
 * @param photoUrl The photo URL from database (if any)
 * @returns The photo URL to use
 */
export function normalizePlayerPhoto(playerName: string, photoUrl?: string): string {
  // Try to get local photo first
  const localPhoto = getPlayerPhoto(playerName);
  
  // Use local photo if available, otherwise use the provided URL, or fallback to placeholder
  return localPhoto || photoUrl || "/placeholder.svg";
}
