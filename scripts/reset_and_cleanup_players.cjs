const { Client, Databases, Query } = require('node-appwrite');

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("68fc96990022ec19614a")
  .setKey("standard_8cf607b562facd0bc8d11ffdeb7b10d62db55115103e3a9b5dafef0fd16679b092f1dc6b819de9f5e9e94915e8684ecd8cdf4e2e41ce2ddeef2ef45d145dc68b7bb055ee41f46e4ef99953320f654aea9b60279d5d84628f6cce343758d949feb2a8ee4bf6bf2d9f413f79db702ce1f0a0ae141c8fa75b22b3e85a55532c89e2");

const databases = new Databases(client);
const DB_ID = "68fc96c0000e08dcfce2";
const COL_ID = "players";

async function run() {
  console.log("Starting player reset and duplicate cleanup...");
  
  let offset = 0;
  let allPlayers = [];
  
  // Step 1: Fetch all players
  while (true) {
    const res = await databases.listDocuments(DB_ID, COL_ID, [Query.limit(100), Query.offset(offset)]);
    if (res.documents.length === 0) break;
    allPlayers = allPlayers.concat(res.documents);
    offset += res.documents.length;
  }
  
  console.log(`Fetched ${allPlayers.length} players.`);

  const seenNames = new Set();
  let resetCount = 0;
  let deleteCount = 0;

  for (const player of allPlayers) {
    // Check for duplicates (standardizing name for comparison)
    const normalizedName = player.name.trim();
    
    if (normalizedName === "Myra Tyagi") {
      if (seenNames.has(normalizedName)) {
        console.log(`Deleting duplicate Myra Tyagi: ${player.$id} (Sport: ${player.sport})`);
        await databases.deleteDocument(DB_ID, COL_ID, player.$id);
        deleteCount++;
        continue;
      } else {
        seenNames.add(normalizedName);
        // We'll update this one to "Multi-sport" or just keep it as is
        await databases.updateDocument(DB_ID, COL_ID, player.$id, {
            sport: "Athletics / Pickleball / Tennis"
        });
      }
    }

    // Step 2: Reset to unsold
    if (player.isSold || player.sellingPrice !== "0" || player.houseId !== "") {
      await databases.updateDocument(DB_ID, COL_ID, player.$id, {
        isSold: false,
        sellingPrice: "0",
        houseId: ""
      });
      resetCount++;
    }
  }

  console.log(`\nCleanup Complete!`);
  console.log(`Reset ${resetCount} players to unsold.`);
  console.log(`Deleted ${deleteCount} duplicate entries.`);
}

run().catch(console.error);
