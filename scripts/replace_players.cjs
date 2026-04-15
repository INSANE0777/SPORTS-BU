const { Client, Databases, Query, ID } = require('node-appwrite');
const fs = require('fs');

const ENDPOINT = "https://fra.cloud.appwrite.io/v1";
const PROJECT_ID = "68fc96990022ec19614a";
const API_KEY = "standard_8cf607b562facd0bc8d11ffdeb7b10d62db55115103e3a9b5dafef0fd16679b092f1dc6b819de9f5e9e94915e8684ecd8cdf4e2e41ce2ddeef2ef45d145dc68b7bb055ee41f46e4ef99953320f654aea9b60279d5d84628f6cce343758d949feb2a8ee4bf6bf2d9f413f79db702ce1f0a0ae141c8fa75b22b3e85a55532c89e2";
const DATABASE_ID = "68fc96c0000e08dcfce2";
const PLAYERS_COLLECTION = "players";

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

// Actual DB schema (from listAttributes):
// name: string (required, max 500)
// uniqueId: string (required, max 100)
// rating: double (required, min 1, max 100)
// basePrice: integer (required, min 100, max 25000)
// isSold: boolean (optional, default false)
// sellingPrice: string (optional, max 1000)
// houseId: string (optional, max 100)
// sport: string (required, max 50)
// course: string (required, max 50)
// NOTE: No "photo" field exists in DB!

function parseCSV(content) {
  const lines = content.split('\n').filter(l => l.trim());
  const players = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = [];
    let current = '';
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { parts.push(current.trim()); current = ''; continue; }
      current += ch;
    }
    parts.push(current.trim());
    
    if (parts.length < 7) continue;
    
    const name = parts[0].trim();
    const uniqueId = parts[1].trim();
    const course = parts[2].trim();
    const rating = parseFloat(parts[4].trim()) || 0;
    const sport = parts[6].trim().replace(/\.$/, '');
    
    if (!name) continue;
    
    players.push({ name, uniqueId, course, rating, sport });
  }
  return players;
}

async function run() {
  // STEP 1: Delete all existing players (they were already deleted, but let's make sure)
  console.log("=== STEP 1: Deleting remaining players ===");
  let deleted = 0;
  let hasMore = true;
  
  while (hasMore) {
    const response = await databases.listDocuments(DATABASE_ID, PLAYERS_COLLECTION, [
      Query.limit(100)
    ]);
    
    if (response.documents.length === 0) {
      hasMore = false;
      break;
    }
    
    for (const doc of response.documents) {
      await databases.deleteDocument(DATABASE_ID, PLAYERS_COLLECTION, doc.$id);
      deleted++;
    }
  }
  console.log(`Deleted ${deleted} remaining players.`);
  
  // STEP 2: Parse CSV and add new players
  console.log("\n=== STEP 2: Adding new players from selected_players.csv ===");
  const csvContent = fs.readFileSync('a:/SPORTSBU/ink-cobalt-bid/selected_players.csv', 'utf8');
  const players = parseCSV(csvContent);
  console.log(`Parsed ${players.length} players from CSV.`);
  
  let added = 0;
  let errors = 0;
  
  for (const player of players) {
    try {
      // basePrice: integer, min 100, max 25000
      let basePrice = 500; // default
      if (player.rating >= 9) basePrice = 2000;
      else if (player.rating >= 8) basePrice = 1000;
      else if (player.rating >= 7) basePrice = 700;
      else if (player.rating >= 6.5) basePrice = 500;
      
      // course max 50 chars
      const course = player.course.substring(0, 50);
      // sport max 50 chars
      const sport = player.sport.substring(0, 50);
      // uniqueId max 100 chars
      const uniqueId = player.uniqueId.substring(0, 100) || "N/A";
      
      await databases.createDocument(DATABASE_ID, PLAYERS_COLLECTION, ID.unique(), {
        name: player.name,
        uniqueId: uniqueId,
        course: course || "N/A",
        rating: player.rating,
        sport: sport,
        basePrice: basePrice,
        isSold: false,
        sellingPrice: "0",
        houseId: ""
      });
      
      added++;
      console.log(`[${added}/${players.length}] Added: ${player.name} (${sport}, Rating: ${player.rating}, Base: ${basePrice})`);
    } catch (err) {
      errors++;
      console.error(`ERROR adding ${player.name}: ${err.message}`);
    }
  }
  
  console.log(`\n=== DONE ===`);
  console.log(`Added: ${added} | Errors: ${errors} | Total in CSV: ${players.length}`);
}

run().catch(err => console.error("Fatal error:", err));
