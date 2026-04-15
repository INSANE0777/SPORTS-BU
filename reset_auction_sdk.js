import { Client, Databases, Query } from 'appwrite';

const client = new Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68fc96990022ec19614a');

const databases = new Databases(client);

async function reset() {
    console.log("Fetching players in chunks using Appwrite SDK...");
    let allPlayers = [];
    let offset = 0;
    while (true) {
        const response = await databases.listDocuments(
            '68fc96c0000e08dcfce2',
            'players',
            [
               Query.limit(25),
               Query.offset(offset)
            ]
        );
        const docs = response.documents;
        if(docs.length === 0) break;
        allPlayers = allPlayers.concat(docs);
        offset += docs.length;
    }
    
    console.log(`Fetched ${allPlayers.length} total players.`);
    
    let resetCount = 0;
    for (const p of allPlayers) {
        if (p.isSold) {
            console.log(`Resetting: ${p.name}`);
            await databases.updateDocument(
                '68fc96c0000e08dcfce2',
                'players',
                p.$id,
                { isSold: false, sellingPrice: 0, houseId: "" }
            );
            resetCount++;
        }
    }
    console.log(`Successfully reset ${resetCount} players!`);

    // Reset houses
    const hr = await databases.listDocuments('68fc96c0000e08dcfce2', 'houses');
    for (const h of hr.documents) {
        await databases.updateDocument('68fc96c0000e08dcfce2', 'houses', h.$id, { balance: 100000000 });
        console.log(`Reset house balance for: ${h.name}`);
    }

    // Reset auctionState
    try {
        await databases.updateDocument('68fc96c0000e08dcfce2', 'auctionState', 'live', {
            currentPlayerId: null,
            currentBid: 0,
            winningHouseId: null,
            isAuctionActive: false,
            statusMessage: 'WAITING'
        });
        console.log("Reset auctionState to WAITING.");
    } catch(e) {}
}

reset();
