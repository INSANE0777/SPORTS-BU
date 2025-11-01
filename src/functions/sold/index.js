const { Client, Databases, Query } = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  try {
    // Log environment variables for debugging
    log('Environment check:');
    log(`VITE_APPWRITE_ENDPOINT: ${process.env.VITE_APPWRITE_ENDPOINT ? 'Set' : 'Missing'}`);
    log(`VITE_APPWRITE_PROJECT_ID: ${process.env.VITE_APPWRITE_PROJECT_ID ? 'Set' : 'Missing'}`);
    log(`APPWRITE_API_KEY: ${process.env.APPWRITE_API_KEY ? 'Set' : 'Missing'}`);
    log(`VITE_APPWRITE_DATABASE_ID: ${process.env.VITE_APPWRITE_DATABASE_ID ? 'Set' : 'Missing'}`);
    log(`VITE_APPWRITE_PLAYERS_TABLE_ID: ${process.env.VITE_APPWRITE_PLAYERS_TABLE_ID ? 'Set' : 'Missing'}`);
    log(`VITE_APPWRITE_HOUSES_TABLE_ID: ${process.env.VITE_APPWRITE_HOUSES_TABLE_ID ? 'Set' : 'Missing'}`);
    
    const client = new Client()
      .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
      .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);
      
    const database = new Databases(client);
    
    // Get environment variables
    const DB_ID = process.env.VITE_APPWRITE_DATABASE_ID;
    const PLAYERS_TABLE_ID = process.env.VITE_APPWRITE_PLAYERS_TABLE_ID;
    const HOUSES_TABLE_ID = process.env.VITE_APPWRITE_HOUSES_TABLE_ID;
    
    if (!DB_ID || !PLAYERS_TABLE_ID || !HOUSES_TABLE_ID) {
      throw new Error('Missing required environment variables');
    }

    // Log request details for debugging
    log(`Request body: ${req.body}`);
    log(`Request bodyRaw: ${req.bodyRaw}`);
    log(`Request payload: ${req.payload}`);
    
    // Try different payload sources
    let payloadString = req.body || req.bodyRaw || req.payload;
    
    if (!payloadString) {
      throw new Error("No payload received from request");
    }
    
    log(`Using payload: ${payloadString}`);
    const { playerUniqueId, houseId, price } = JSON.parse(payloadString);
    log(`Parsed data - Player: ${playerUniqueId}, House: ${houseId}, Price: ${price}`);
    
    if (!playerUniqueId || !houseId || !price) throw new Error("Missing required data.");

    // Get the player
    const playerResponse = await database.listDocuments(DB_ID, PLAYERS_TABLE_ID, [Query.equal('uniqueId', playerUniqueId)]);
    if (playerResponse.total === 0) throw new Error(`Player not found.`);
    
    const playerDocument = playerResponse.documents[0];
    if (playerDocument.isSold) throw new Error("This player has already been sold.");
    
    // Get the house
    const house = await database.getDocument(DB_ID, HOUSES_TABLE_ID, houseId);
    if (!house) throw new Error("House not found.");
    
    // Check if house has enough balance
    if (house.balance < price) throw new Error("House has insufficient balance.");
    
    // Calculate new balance
    const newBalance = house.balance - price;
    
    // Update player as sold (convert price to string as Appwrite expects)
    await database.updateDocument(DB_ID, PLAYERS_TABLE_ID, playerDocument.$id, {
      isSold: true,
      sellingPrice: price.toString(),
      houseId: houseId
    });
    
    // Deduct balance from house
    await database.updateDocument(DB_ID, HOUSES_TABLE_ID, houseId, {
      balance: newBalance
    });

    log(`Player ${playerDocument.name} sold to ${house.name} for ₹${price}. New balance: ₹${newBalance}`);
    return res.json({ success: true, message: 'Player sold and balance deducted successfully.' });
  } catch (e) {
    error(`Error in sold function: ${e.message}`);
    error(`Stack trace: ${e.stack}`);
    return res.json({ success: false, error: e.message }, 500);
  }
};