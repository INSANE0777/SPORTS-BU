
import { Client, Databases } from 'appwrite';

const ENDPOINT = "https://fra.cloud.appwrite.io/v1"; 
const PROJECT_ID = "68fc96 project_id_placeholder"; 
const API_KEY = "key_placeholder"; // I'll use the real ones

const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("68fc96990022ec19614a")
    .setKey("standard_8cf607b562facd0bc8d11ffdeb7b10d62db55115103e3a9b5dafef0fd16679b092f1dc6b819de9f5e9e94915e8684ecd8cdf4e2e41ce2ddeef2ef45d145dc68b7bb055ee41f46e4ef99953320f654aea9b60279d5d84628f6cce343758d949feb2a8ee4bf6bf2d9f413f79db702ce1f0a0ae141c8fa75b22b3e85a55532c89e2");

const databases = new Databases(client);

const DATABASE_ID = "68fc96c0000e08dcfce2";
const HOUSES_TABLE_ID = "houses";

const mapping = {
  "KEEN KICKERS": { color: "#4ADE80", logo: "/pic3.png" }, // Samurai
  "MIGHTY BOLTZ": { color: "#A78BFA", logo: "/pic1.png" }, // Skull
  "SUPER SPADES": { color: "#60A5FA", logo: "/pic2.png" }, // Dragon
  "HEROIC HEARTS": { color: "#F87171", logo: "/pic4.png" }  // Phoenix
};

async function updateBranding() {
  try {
    console.log("Fetching houses...");
    const response = await databases.listDocuments(DATABASE_ID, HOUSES_TABLE_ID);
    const houses = response.documents;
    console.log(`Found ${houses.length} houses.`);

    for (const house of houses) {
      const config = mapping[house.name];
      if (config) {
        console.log(`Updating ${house.name} with logo ${config.logo}...`);
        await databases.updateDocument(DATABASE_ID, HOUSES_TABLE_ID, house.$id, {
          logo: config.logo,
          color: config.color
        });
        console.log(`Successfully updated ${house.name}`);
      }
    }
  } catch (error) {
    console.error("Critical error during update:", error);
  }
}

updateBranding();
