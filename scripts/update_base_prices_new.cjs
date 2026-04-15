const { Client, Databases, Query } = require('node-appwrite');

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("68fc96990022ec19614a")
  .setKey("standard_8cf607b562facd0bc8d11ffdeb7b10d62db55115103e3a9b5dafef0fd16679b092f1dc6b819de9f5e9e94915e8684ecd8cdf4e2e41ce2ddeef2ef45d145dc68b7bb055ee41f46e4ef99953320f654aea9b60279d5d84628f6cce343758d949feb2a8ee4bf6bf2d9f413f79db702ce1f0a0ae141c8fa75b22b3e85a55532c89e2");

const databases = new Databases(client);
const DB_ID = "68fc96c0000e08dcfce2";
const COL_ID = "players";

async function run() {
  console.log("Updating base prices: Elite (9+) = 500, Others = 100...");
  
  let offset = 0;
  let allPlayers = [];
  
  while (true) {
    const res = await databases.listDocuments(DB_ID, COL_ID, [Query.limit(100), Query.offset(offset)]);
    if (res.documents.length === 0) break;
    allPlayers = allPlayers.concat(res.documents);
    offset += res.documents.length;
  }
  
  console.log(`Fetched ${allPlayers.length} players.`);

  let count = 0;
  for (const player of allPlayers) {
    const rating = parseFloat(player.rating);
    const newBasePrice = rating >= 9 ? 500 : 100;
    
    if (player.basePrice !== newBasePrice) {
      await databases.updateDocument(DB_ID, COL_ID, player.$id, {
        basePrice: newBasePrice
      });
      count++;
    }
  }

  console.log(`\nUpdated base prices for ${count} players.`);
}

run().catch(console.error);
