import { Client, Databases } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68fc96990022ec19614a')
    .setKey('standard_8cf607b562facd0bc8d11ffdeb7b10d62db55115103e3a9b5dafef0fd16679b092f1dc6b819de9f5e9e94915e8684ecd8cdf4e2e41ce2ddeef2ef45d145dc68b7bb055ee41f46e4ef99953320f654aea9b60279d5d84628f6cce343758d949feb2a8ee4bf6bf2d9f413f79db702ce1f0a0ae141c8fa75b22b3e85a55532c89e2');

const databases = new Databases(client);

const databaseId = '68fc96c0000e08dcfce2';
const housesCollectionId = 'houses';

async function checkHouses() {
    try {
        const response = await databases.listDocuments(databaseId, housesCollectionId);
        console.log('--- HOUSES DATA ---');
        response.documents.forEach(doc => {
            console.log(`ID: ${doc.$id}`);
            console.log(`Name: ${doc.name}`);
            console.log(`Color: ${doc.color}`);
            console.log(`Logo: ${doc.logo}`);
            console.log('---');
        });
    } catch (error) {
        console.error('Error fetching houses:', error);
    }
}

checkHouses();
