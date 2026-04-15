import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const HOUSES_TABLE_ID = process.env.VITE_APPWRITE_HOUSES_TABLE_ID;

async function listHouses() {
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

  const databases = new Databases(client);

  try {
    const response = await databases.listDocuments(DATABASE_ID, HOUSES_TABLE_ID);
    console.log(JSON.stringify(response.documents, null, 2));
  } catch (error) {
    console.error("Error listing houses:", error);
  }
}

listHouses();
