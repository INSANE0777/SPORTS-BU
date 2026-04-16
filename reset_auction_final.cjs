
const { Client, Databases, Query } = require('node-appwrite');

const ENDPOINT = "https://fra.cloud.appwrite.io/v1"; 
const PROJECT_ID = "68fc96990022ec19614a";
const API_KEY = "standard_8cf607b562facd0bc8d11ffdeb7b10d62db55115103e3a9b5dafef0fd16679b092f1dc6b819de9f5e9e94915e8684ecd8cdf4e2e41ce2ddeef2ef45d145dc68b7bb055ee41f46e4ef99953320f654aea9b60279d5d84628f6cce343758d949feb2a8ee4bf6bf2d9f413f79db702ce1f0a0ae141c8fa75b22b3e85a55532c89e2";

const DB_ID = "68fc96c0000e08dcfce2";
const PLAYERS_ID = "players";
const HOUSES_ID = "houses";
const AUCTION_STATE_ID = "auctionState";

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function resetAuction() {
    try {
        console.log("Fetching players...");
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
            console.log(`Fetched ${allPlayers.length} players...`);
        }

        console.log(`Processing ${allPlayers.length} players...`);
        let resetCount = 0;
        for (const player of allPlayers) {
            if (player.isSold) {
                process.stdout.write(`Resetting player: ${player.name} \r`);
                await databases.updateDocument(
                    DB_ID,
                    PLAYERS_ID,
                    player.$id,
                    {
                        isSold: false,
                        sellingPrice: "0",
                        houseId: ""
                    }
                );
                resetCount++;
            }
        }
        console.log(`\nSuccessfully reset ${resetCount} players to unsold.`);

        console.log("Resetting house balances...");
        const houseDocs = await databases.listDocuments(DB_ID, HOUSES_ID);
        for (const house of houseDocs.documents) {
            console.log(`Resetting balance for: ${house.name}`);
            await databases.updateDocument(
                DB_ID,
                HOUSES_ID,
                house.$id,
                { balance: 30000 }
            );
        }

        console.log("Resetting auction state...");
        try {
            await databases.updateDocument(
                DB_ID,
                AUCTION_STATE_ID,
                'live',
                {
                    currentPlayerId: allPlayers[0]?.$id || "",
                    currentBid: allPlayers[0]?.basePrice || 0,
                    winningHouseId: "",
                    isAuctionActive: false,
                    statusMessage: 'WAITING'
                }
            );
            console.log("Auction state reset to WAITING.");
        } catch (e) {
            console.warn("Could not reset auction state document 'live':", e.message);
        }

        console.log("Database reset complete!");
    } catch (err) {
        console.error("Error during reset:", err);
    }
}

resetAuction();
