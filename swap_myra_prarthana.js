import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68fc96990022ec19614a')
    .setKey('standard_8cf607b562facd0bc8d11ffdeb7b10d62db55115103e3a9b5dafef0fd16679b092f1dc6b819de9f5e9e94915e8684ecd8cdf4e2e41ce2ddeef2ef45d145dc68b7bb055ee41f46e4ef99953320f654aea9b60279d5d84628f6cce343758d949feb2a8ee4bf6bf2d9f413f79db702ce1f0a0ae141c8fa75b22b3e85a55532c89e2');

const databases = new Databases(client);

const databaseId = '68fc96c0000e08dcfce2';
const playersCollectionId = 'players';

async function performSwap() {
    try {
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
        
        const myra = players.find(p => p.name.toLowerCase().includes('myra'));
        const prarthana = players.find(p => p.name.toLowerCase().includes('prarthana') || p.name.toLowerCase().includes('rana'));
        
        if (!myra || !prarthana) {
            console.error('Could not find both players in full DB:', !!myra, !!prarthana);
            return;
        }

        console.log(`Found Myra: ID=${myra.$id}, Name="${myra.name}"`);
        console.log(`Found Prarthana: ID=${prarthana.$id}, Name="${prarthana.name}"`);

        // Perform Swap by exchanging all their mutable fields except $id
        const myraData = {
            name: myra.name,
            uniqueId: myra.uniqueId,
            rating: myra.rating,
            sport: myra.sport,
            course: myra.course,
            basePrice: myra.basePrice,
            isSold: myra.isSold,
            sellingPrice: myra.sellingPrice,
            houseId: myra.houseId
        };
        
        const prarthanaData = {
            name: prarthana.name,
            uniqueId: prarthana.uniqueId,
            rating: prarthana.rating,
            sport: prarthana.sport,
            course: prarthana.course,
            basePrice: prarthana.basePrice,
            isSold: prarthana.isSold,
            sellingPrice: prarthana.sellingPrice,
            houseId: prarthana.houseId
        };

        // Put Prarthana's data into Myra's ID document
        await databases.updateDocument(databaseId, playersCollectionId, myra.$id, prarthanaData);
        // Put Myra's data into Prarthana's ID document
        await databases.updateDocument(databaseId, playersCollectionId, prarthana.$id, myraData);

        console.log('--- SWAP COMPLETED SUCCESSFULLY ---');

    } catch (e) {
        console.error(e);
    }
}
performSwap();
