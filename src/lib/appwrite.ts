import { Client, Account, Databases, Functions } from 'appwrite';
import appwriteConfig from '@/config/appwrite';

export const client = new Client();
client.setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);

export const account = new Account(client); 
export const databases = new Databases(client);
export const functions = new Functions(client);