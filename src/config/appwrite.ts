const config = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID as string,
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT as string,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID as string,
  playersTableId: import.meta.env.VITE_APPWRITE_PLAYERS_TABLE_ID as string,
  housesTableId: import.meta.env.VITE_APPWRITE_HOUSES_TABLE_ID as string,
  auctionStateTableId: import.meta.env.VITE_APPWRITE_AUCTION_STATE_TABLE_ID as string,
  auctionStateDocId: import.meta.env.VITE_APPWRITE_AUCTION_STATE_DOC_ID as string,
  auctionHandlerFunctionId: import.meta.env.VITE_APPWRITE_AUCTION_HANDLER_FUNCTION_ID as string,
  soldPlayerFunctionId: import.meta.env.VITE_APPWRITE_SOLD_PLAYER_FUNCTION_ID as string,
};

for (const [key, value] of Object.entries(config)) {
  if (!value) throw new Error(`Missing environment variable for Appwrite config: ${key}`);
}

export default config;