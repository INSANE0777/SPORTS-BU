// Player photo mappings - all students included
const PLAYER_PHOTOS: Record<string, string> = {
  // Existing mapped players
  "Aryan Jaiswal": "/Aryan Jaiswal.jpg",
  "Krish Mishra": "/Krish Mishra.jpg",
  "Dhruv Prajapati": "/Dhruv Prajapati.jpeg",
  "Shubham Mishra": "/Shubham Mishra.jpg",
  "Aarsh Kamboj": "/Aarsh Kamboj.jpg",
  "Gaurav Tiwari": "/Gaurav Tiwari.jpg",
  "Ankur Singh Chauhan": "/Ankur Singh Chauhan.jpg",
  "Ishaan Sharma": "/Ishaan Sharma.png",
  "Harshit Singh Chauhan": "/Harshit Singh Chauhan.jpg",
  "Sundaram Sinha": "/Sundaram Sinha.jpg",
  "Prashansa Chauhan": "/Prashansa Chauhan.png",
  "Adhya Gupta": "/Adhya Gupta.jpg",
  "Suraj": "/suraj malik.jpg",
  "Daksh": "/Daksh.jpg",
  "Anshul": "/Anshul.jpg",
  "Bhumik": "/bhumik.jpg",
  "Vasu": "/Vasu.jpg",
  "Kush": "/Kush Narwal.jpg",
  "Bhanu Pratap": "/Bhanu Pratap.JPG",
  "Vansh Sehrawat": "/Vansh Sehrawat.jpeg",
  "Vineet": "/Vineet.jpg",
  "Ashutosh": "/Ashutosh.jpg",
  "Aditya Rai": "/Aditya Rai.jpg",
  "Aditya Mittal": "/Aditya Mittal.jpg",
  "Mayank Sah": "/Mayank Sah.jpg",
  "Nikunj Panwar": "/Nikunj Panwar.jpg",
  "Rudra Pratap": "/Rudra Pratap.jpg",
  "Yatharth Tyagi": "/Yatharth Tyagi.HEIC",
  "Kunal": "/Kunal.jpg",
  "Harsh Chandel": "/Harsh Chandel.jpg",
  "Surya Pratap Singh Rathod": "/Surya Pratap Singh Rathod.jpg",
  "Aditya kumar": "/Aditya kumar.jpg",
  "Kunsh kakkar": "/KUNSH.jpg",
  "Dhruv agarwal": "/Dhruv agarwal.jpg",
  "Ryann singh": "/Ryann singh.jpg",
  "Sarman raj": "/Sarman raj.jpg",
  "Lakshay kumar": "/Lakshay kumar.jpg",
  "Prarthana Rana": "/Prarthana Rana.jpg",
  "Stuti Agarwal": "/Stuti Agarwal.jpg",
  "Neeyati Shukla": "/Neeyati Shukla.jpg",
  "Divyanshi": "/Divyanshi.jpg",
  "Angil": "/Angil.jpg",
  "Tanvi Singhla": "/Tanvi Singh.jpg",
  "Palakpreet Kaur": "/Palakpreet Kaur.jpg",
  "Vandita Goel": "/Vandita Goel.jpg",
  "Lavanya": "/Lavanya.jpg",
  "Ashima": "/Ashima.jpg",
  "Rashi Rajput": "/Rashi.jpg",
  "Uddhav Parihar": "/Uddhav Parihar.jpg",
  "Aman Singh": "/Aman Singh.jpg",
  "Ananya Barath": "/Ananya Barath.jpg",
  "Kashvi Garg": "/Kashvi Garg.jpg",
  "Saumya Sharma": "/Saumya Sharma.jpg",
  "Myra tyagi": "/Myra tyagi.jpg",
  "Sanvi ahuja": "/Sanvi ahuja.jpg",
  "Mishika daver": "/Mishika daver.jpg",
  "Mahek advani": "/Mahek advani.jpg",
  "Nishit Nama": "/Nishit Nama.jpg",
  "Harshit Agarwal": "/Harshit Agarwal.jpg",
  "Navya Loshali": "/Navya Loshali.jpg",
  "Agrima Jain": "/Agrima Jain.jpg",
  "Tanvi Singh": "/Tanvi Singh.jpg",
  "Aarya giri": "/Aarya giri.jpg",
  "Nehum Baid": "/Nehum Baid.jpg",
  "Sriraam Rajendran": "/Sriraam Rajendran.jpg",
  "Nakul Kansal": "/nakul.jpg",
  "Aditya Kumar": "/Aditya kumar.jpg",
  "Ryann Singh": "/Ryann singh.jpg",
  "Dhruv Agarwal": "/Dhruv agarwal.jpg",
  "Sudarshan Yadav": "/Sudarshan Yadav.jpg",
  "Akash Sharma": "/Akash Sharma.jpg",
  "Dhruv": "/Dhruv agarwal.jpg",
  "Pranay Wadhwa": "/Pranay Wadhwa.jpg",
  "Lavish Solanki": "/Lavish Solanki.jpg",
  "Navam Upadhyay": "/Navam Upadhyay.jpg",
  "Krish Jhinkwan": "/Krish Jhinkwan.jpg",
  "Ananya Saxena": "/Ananya Saxena.jpg",
  "Bhumika Garg": "/Bhumika Garg.jpg",
  "Anmol Upadhyay(vc)": "/Anmol Upadhyay(vc).jpeg",
  "Ridhi Garg": "/Ridhi Garg.jpeg",
  "Sania Tyagi": "/Sania Tyagi.jpeg",
  "Anushka Singh": "/Anushka Singh.png",
  "Aakarshi Nigam": "/Aakarshi Nigam.jpeg",
  "anubhav": "/anubhav.jpg",
  "jatin solanki": "/jatin solanki.jpg",
  "vansh mathur": "/vansh mathur.jpg",
  "chirag jain": "/chirag jain.jpg",
  "nimish jain": "/nimish jain.jpg",
  "Sehej Joshi": "/Sehej Joshi.jpg",
  "Aditya Siwach": "/Aditya Siwach.jpg",
  "Aasu Tomar": "/Aasu.jpg",

  // Newly added missing students with mixed extensions (.jpg / .HEIC)
  "Ashmit Punia": "/Ashmit Punia.png",
  "Akshat Khandelwal": "/Akshat.jpg",
  "Soham Aich": "/Soham.jpg",
  "Dev soni": "/Dev Soni.jpg",
  "Harshit dhaundiyal": "/Harshit Dhaundiyal .jpg",
  "Shourya": "/Shourya.jpg",
  "Anmol Upadhyay": "/Anmol Upadhyay(vc).jpeg",
  "shivansh": "/shivansh.jpg",
  "Utkarsh raj": "/Uttkarsh.jpg",
  "Abhinav Baisoya": "/Abhinav.jpg",
  "Rudraksh Chaudhary": "/Rudraksh.jpg",
  "Priyanshu Chauhan": "/Priyanshu.jpg",
  "Karthek G": "/Karthek G.jpg",
  "anshul gaur": "/anshul gaur.jpg",
  
};



/**
 * Get the local photo path for a player by name
 * @param playerName The player's name
 * @returns Local photo path or undefined if not found
 */
export function getPlayerPhoto(playerName: string): string | undefined {
  return PLAYER_PHOTOS[playerName];
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

