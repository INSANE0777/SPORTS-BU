const { Client, Databases, Query } = require('node-appwrite');

const DB_ID = 'AuctionDB';
const HOUSES_TABLE_ID = 'houses';
const AUCTION_STATE_TABLE_ID = 'auctionState';
const AUCTION_STATE_DOC_ID = 'live';

module.exports = async ({ req, res, log, error }) => {
  const client = new Client().setEndpoint(process.env.APPWRITE_ENDPOINT).setProject(process.env.APPWRITE_PROJECT_ID).setKey(process.env.APPWRITE_API_KEY);
  const database = new Databases(client);

  try {
    const { houseId, bidAmount } = JSON.parse(req.payload);
    if (!houseId || !bidAmount) throw new Error("House ID and bid amount are required.");

    const auctionState = await database.getDocument(DB_ID, AUCTION_STATE_TABLE_ID, AUCTION_STATE_DOC_ID);
    if (!auctionState.isAuctionActive) throw new Error("Auction is not currently active.");
    
    const previousBid = auctionState.currentBid ?? 0;
    if (bidAmount <= previousBid) throw new Error("New bid must be higher than the current bid.");

    // --- REFUND LOGIC ---
    const previousWinningHouseId = auctionState.winningHouseId;
    if (previousWinningHouseId && previousWinningHouseId !== houseId) {
      const previousHouse = await database.getDocument(DB_ID, HOUSES_TABLE_ID, previousWinningHouseId);
      await database.updateDocument(DB_ID, HOUSES_TABLE_ID, previousWinningHouseId, { balance: previousHouse.balance + previousBid });
      log(`Refunded ${previousBid} to ${previousHouse.name}`);
    }
    
    // --- NEW BID LOGIC ---
    const newBiddingHouse = await database.getDocument(DB_ID, HOUSES_TABLE_ID, houseId);
    const balanceBeforeBid = previousWinningHouseId === houseId ? newBiddingHouse.balance + previousBid : newBiddingHouse.balance; 
    if (balanceBeforeBid < bidAmount) throw new Error(`${newBiddingHouse.name} has insufficient funds.`);
    
    const finalBalance = balanceBeforeBid - bidAmount;
    await database.updateDocument(DB_ID, HOUSES_TABLE_ID, houseId, { balance: finalBalance });
    log(`Deducted ${bidAmount} from ${newBiddingHouse.name}`);

    await database.updateDocument(DB_ID, AUCTION_STATE_TABLE_ID, AUCTION_STATE_DOC_ID, {
      currentBid: bidAmount,
      winningHouseId: houseId,
      statusMessage: `Bid from ${newBiddingHouse.name}!`
    });

    return res.json({ success: true, message: 'Bid handled successfully.' });
  } catch (e) {
    error(e.message);
    return res.json({ success: false, error: e.message }, 500);
  }
};