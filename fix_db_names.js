import { Client, Databases } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68fc96990022ec19614a')
    .setKey('standard_8cf607b562facd0bc8d11ffdeb7b10d62db55115103e3a9b5dafef0fd16679b092f1dc6b819de9f5e9e94915e8684ecd8cdf4e2e41ce2ddeef2ef45d145dc68b7bb055ee41f46e4ef99953320f654aea9b60279d5d84628f6cce343758d949feb2a8ee4bf6bf2d9f413f79db702ce1f0a0ae141c8fa75b22b3e85a55532c89e2');

const databases = new Databases(client);

const databaseId = '68fc96c0000e08dcfce2';
const playersCollectionId = 'players';

async function fixKananMeenalNames() {
    try {
        // Fix Kanan (ID from previous list)
        await databases.updateDocument(databaseId, playersCollectionId, '69d01aff002c4c8202f8', {
            name: "Kanan Sehrawat"
        });
        console.log('Fixed Kanan spelling to "Kanan Sehrawat"');

        // Fix Meenal (ID from previous list)
        await databases.updateDocument(databaseId, playersCollectionId, '69d01b01000cadb56891', {
            name: "Meenal Singh"
        });
        console.log('Fixed Meenal to full name "Meenal Singh"');

    } catch (e) {
        console.error(e);
    }
}

fixKananMeenalNames();
