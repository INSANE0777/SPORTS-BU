import { Client, Databases, Query } from 'node-appwrite';
import { readFileSync } from 'fs';

// Photo mappings - these would come from your photo_mappings.txt or similar
const photoMappings = {
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
  "Prashansa Chauhan": "/Prashansa Chauhan.pdf",
  "Adhya Gupta": "/Adhya Gupta.jpg",
  "Suraj": "/Suraj.jpg",
  "Daksh": "/Daksh.jpg",
  "Anshul": "/Anshul.jpg",
  "Bhumik": "/Bhumika Garg.jpg",
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
  "Rashi  Rajput": "/Rashi  Rajput.jpg",
  "Uddhav Parihar": "/Uddhav Parihar.jpg",
  "Aman Singh": "/Aman Singh.jpg",
  "Ananya Barath": "/Ananya Barath.jpg",
  "Kashvi Garg": "/Kashvi Garg.jpg",
  "Saumya Sharma": "/Saumya Sharma.jpg",
  "Myra tyagi": "/Myra tyagi.jpg",
  "Sanvi ahuja": "/Sanvi ahuja.jpg",
  "Mishika daver": "/Mishika daver.HEIC",
  "Mahek advani": "/Mahek advani.jpg",
  "Nishit Nama": "/Nishit Nama.jpg",
  "Harshit Agarwal": "/Harshit Agarwal.jpg",
  "Navya Loshali": "/Navya Loshali.jpg",
  "Agrima Jain": "/Agrima Jain.jpg",
  "Tanvi Singh": "/Tanvi Singh.jpg",
  "Aarya giri": "/Aarya giri.jpg",
  "Nehum Baid": "/Nehum Baid.heif",
  "Sriraam Rajendran": "/Sriraam Rajendran.jpg",
  "Nakul Kansal": "/Nakul Kansal.HEIC",
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
  "anubhav": "/anubhav.HEIC",
  "jatin solanki": "/jatin solanki.jpg",
  "vansh mathur": "/vansh mathur.jpg",
  "chirag jain": "/chirag jain.jpg",
  "nimish jain": "/nimish jain.jpg",
  "Sehej Joshi": "/Sehej Joshi.HEIC",
  "Aditya Siwach": "/Aditya Siwach.jpg"
};

// Get config from environment variables
const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const PLAYERS_TABLE_ID = process.env.VITE_APPWRITE_PLAYERS_TABLE_ID;

if (!ENDPOINT || !PROJECT_ID || !API_KEY || !DATABASE_ID || !PLAYERS_TABLE_ID) {
  console.error("Missing required environment variables");
  process.exit(1);
}

async function updatePlayerPhotos() {
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

  const databases = new Databases(client);

  console.log("Fetching all players from Appwrite...");
  
  // Fetch all players
  const players = [];
  let offset = 0;
  const limit = 100;

  try {
    while (true) {
      const response = await databases.listDocuments(DATABASE_ID, PLAYERS_TABLE_ID, [
        Query.limit(limit),
        Query.offset(offset)
      ]);

      players.push(...response.documents);

      if (response.documents.length < limit) {
        break;
      }

      offset += limit;
    }

    console.log(`Found ${players.length} players in database`);

    // Update players with matching photos
    let updated = 0;
    let notFound = 0;
    let errors = 0;

    for (const [name, photoPath] of Object.entries(photoMappings)) {
      // Find player by name (case-insensitive)
      const player = players.find(p => 
        p.name.toLowerCase() === name.toLowerCase()
      );

      if (player) {
        try {
          await databases.updateDocument(
            DATABASE_ID,
            PLAYERS_TABLE_ID,
            player.$id,
            { photo: photoPath }
          );
          console.log(`✓ Updated: ${name} -> ${photoPath}`);
          updated++;
        } catch (error) {
          console.error(`✗ Error updating ${name}:`, error.message);
          errors++;
        }
      } else {
        console.log(`✗ Not found: ${name}`);
        notFound++;
      }
    }

    console.log("\n" + "=".repeat(80));
    console.log("SUMMARY");
    console.log("=".repeat(80));
    console.log(`Updated: ${updated}`);
    console.log(`Not found: ${notFound}`);
    console.log(`Errors: ${errors}`);
    console.log(`Total mappings: ${Object.keys(photoMappings).length}`);

  } catch (error) {
    console.error("Error fetching players:", error);
    process.exit(1);
  }
}

// Run the update
updatePlayerPhotos();

