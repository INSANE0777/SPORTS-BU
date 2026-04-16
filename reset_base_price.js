import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68fc96990022ec19614a')
    .setKey('standard_8cf607b562facd0bc8d11ffdeb7b10d62db55115103e3a9b5dafef0fd16679b092f1dc6b819de9f5e9e94915e8684ecd8cdf4e2e41ce2ddeef2ef45d145dc68b7bb055ee41f46e4ef99953320f654aea9b60279d5d84628f6cce343758d949feb2a8ee4bf6bf2d9f413f79db702ce1f0a0ae141c8fa75b22b3e85a55532c89e2');

const databases = new Databases(client);

const databaseId = '68fc96c0000e08dcfce2';
const playersCollectionId = 'players';

async function setBasePriceToZero() {
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

        console.log(`Setting basePrice to 0 for ${players.length} players...`);

        for (const player of players) {
            try {
                await databases.updateDocument(databaseId, playersCollectionId, player.$id, {
                    basePrice: 0
                });
                process.stdout.write('.');
            } catch (err) {
                console.error(`\nError updating player ${player.name}:`, err.message);
            }
        }

        console.log('\nAll players basePrice set to 0!');
    } catch (error) {
        console.error('Error:', error);
    }
}

setBasePriceToZero();
