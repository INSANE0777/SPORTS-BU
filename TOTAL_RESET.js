import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68fc96990022ec19614a')
    .setKey('standard_8cf607b562facd0bc8d11ffdeb7b10d62db55115103e3a9b5dafef0fd16679b092f1dc6b819de9f5e9e94915e8684ecd8cdf4e2e41ce2ddeef2ef45d145dc68b7bb055ee41f46e4ef99953320f654aea9b60279d5d84628f6cce343758d949feb2a8ee4bf6bf2d9f413f79db702ce1f0a0ae141c8fa75b22b3e85a55532c89e2');

const databases = new Databases(client);

const databaseId = '68fc96c0000e08dcfce2';
const playersCollectionId = 'players';
const housesCollectionId = 'houses';
const auctionStateCollectionId = 'auctionState';
const auctionStateDocId = 'live';

async function resetAll() {
    try {
        console.log('--- STARTING TOTAL RESET ---');

        // 1. Reset Houses
        const houses = await databases.listDocuments(databaseId, housesCollectionId);
        console.log(`Resetting ${houses.total} houses to 30,000...`);
        for (const house of houses.documents) {
            await databases.updateDocument(databaseId, housesCollectionId, house.$id, {
                balance: 30000
            });
        }

        // 2. Reset Players
        let players = [];
        let offset = 0;
        const limit = 100;
        while (true) {
            const response = await databases.listDocuments(databaseId, playersCollectionId, [
                Query.limit(limit),
                Query.offset(offset)
            ]);
            players = players.concat(response.documents);
            if (response.documents.length < limit) break;
            offset += limit;
        }

        console.log(`Resetting ${players.length} players to unsold...`);
        for (const player of players) {
            await databases.updateDocument(databaseId, playersCollectionId, player.$id, {
                isSold: false,
                sellingPrice: "0",
                houseId: ""
            });
        }

        // 3. Reset Live Auction State
        await databases.updateDocument(databaseId, auctionStateCollectionId, auctionStateDocId, {
            currentBid: 0,
            winningHouseId: "",
            currentPlayerId: "",
            isAuctionActive: false,
            statusMessage: "AWAITING"
        });

        console.log('--- RESET COMPLETE! SYSTEMS READY ---');
    } catch (error) {
        console.error('CRITICAL ERROR DURING RESET:', error.message);
    }
}

resetAll();
