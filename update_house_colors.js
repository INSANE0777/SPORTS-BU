import { Client, Databases } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68fc96990022ec19614a')
    .setKey('standard_8cf607b562facd0bc8d11ffdeb7b10d62db55115103e3a9b5dafef0fd16679b092f1dc6b819de9f5e9e94915e8684ecd8cdf4e2e41ce2ddeef2ef45d145dc68b7bb055ee41f46e4ef99953320f654aea9b60279d5d84628f6cce343758d949feb2a8ee4bf6bf2d9f413f79db702ce1f0a0ae141c8fa75b22b3e85a55532c89e2');

const databases = new Databases(client);

const databaseId = '68fc96c0000e08dcfce2';
const housesCollectionId = 'houses';

async function updateHouseColors() {
    const updates = [
        { id: '68ffa7a4001ae9e266f9', name: 'KEEN KICKERS', color: '#22C55E' }, // Vibrant Green
        { id: '68ffa94f000e9e21cd92', name: 'MIGHTY BOLTZ', color: '#EAB308' }, // Vibrant Yellow/Gold
        { id: '690652a27beff6535c29', name: 'SUPER SPADES', color: '#3B82F6' }, // Vibrant Blue
        { id: '690652a27bf6fa83727f', name: 'HEROIC HEARTS', color: '#EF4444' }  // Vibrant Red
    ];

    for (const update of updates) {
        try {
            await databases.updateDocument(databaseId, housesCollectionId, update.id, {
                color: update.color
            });
            console.log(`Updated ${update.name} with color ${update.color}`);
        } catch (error) {
            console.error(`Error updating ${update.name}:`, error);
        }
    }
}

updateHouseColors();
