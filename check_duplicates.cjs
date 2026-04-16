
const { Client, Databases, Query } = require('node-appwrite');

const ENDPOINT = "https://fra.cloud.appwrite.io/v1"; 
const PROJECT_ID = "68fc96990022ec19614a";
const API_KEY = "standard_8cf607b562facd0bc8d11ffdeb7b10d62db55115103e3a9b5dafef0fd16679b092f1dc6b819de9f5e9e94915e8684ecd8cdf4e2e41ce2ddeef2ef45d145dc68b7bb055ee41f46e4ef99953320f654aea9b60279d5d84628f6cce343758d949feb2a8ee4bf6bf2d9f413f79db702ce1f0a0ae141c8fa75b22b3e85a55532c89e2";

const DB_ID = "68fc96c0000e08dcfce2";
const PLAYERS_ID = "players";

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function checkDuplicates() {
    try {
        console.log("Fetching all players to check for duplicates...");
        let allPlayers = [];
        let offset = 0;
        while (true) {
            const response = await databases.listDocuments(
                DB_ID,
                PLAYERS_ID,
                [
                    Query.limit(100),
                    Query.offset(offset)
                ]
            );
            const docs = response.documents;
            if (docs.length === 0) break;
            allPlayers = allPlayers.concat(docs);
            offset += docs.length;
        }

        console.log(`Total players found: ${allPlayers.length}`);

        const idMap = new Map();
        const duplicates = [];

        for (const player of allPlayers) {
            const id = (player.uniqueId || player.name || '').toLowerCase().trim();
            if (idMap.has(id)) {
                duplicates.push({
                    original: idMap.get(id),
                    duplicate: player
                });
            } else {
                idMap.set(id, player);
            }
        }

        if (duplicates.length > 0) {
            console.log("\n⚠️ DUPLICATE PLAYERS FOUND:");
            duplicates.forEach((dup, index) => {
                console.log(`${index + 1}. ID/Name: "${dup.original.uniqueId || dup.original.name}"`);
                console.log(`   - First instance: ${dup.original.$id}`);
                console.log(`   - Second instance: ${dup.duplicate.$id}`);
                console.log('-------------------');
            });
            console.log(`Total duplicates found: ${duplicates.length}`);
        } else {
            console.log("\n✅ No duplicate players found by UniqueID or Name.");
        }

    } catch (err) {
        console.error("Error checking duplicates:", err);
    }
}

checkDuplicates();
