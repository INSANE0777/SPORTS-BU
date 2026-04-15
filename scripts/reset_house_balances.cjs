const { Client, Databases } = require('node-appwrite');

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("68fc96990022ec19614a")
  .setKey("standard_8cf607b562facd0bc8d11ffdeb7b10d62db55115103e3a9b5dafef0fd16679b092f1dc6b819de9f5e9e94915e8684ecd8cdf4e2e41ce2ddeef2ef45d145dc68b7bb055ee41f46e4ef99953320f654aea9b60279d5d84628f6cce343758d949feb2a8ee4bf6bf2d9f413f79db702ce1f0a0ae141c8fa75b22b3e85a55532c89e2");

const databases = new Databases(client);
const DB_ID = "68fc96c0000e08dcfce2";
const COL_ID = "houses";
const STARTING_BALANCE = 50000;

async function run() {
  console.log("Starting house balance reset...");
  
  const res = await databases.listDocuments(DB_ID, COL_ID);
  console.log(`Found ${res.documents.length} houses.`);

  for (const house of res.documents) {
    console.log(`Resetting ${house.name} (${house.$id}) back to ${STARTING_BALANCE}...`);
    await databases.updateDocument(DB_ID, COL_ID, house.$id, {
      balance: STARTING_BALANCE
    });
  }

  console.log("\nHouse reset complete!");
}

run().catch(console.error);
