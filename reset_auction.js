
const ENDPOINT = "https://fra.cloud.appwrite.io/v1"; 
const PROJECT_ID = "68fc96990022ec19614a";
const API_KEY = "standard_8cf607b562facd0bc8d11ffdeb7b10d62db55115103e3a9b5dafef0fd16679b092f1dc6b819de9f5e9e94915e8684ecd8cdf4e2e41ce2ddeef2ef45d145dc68b7bb055ee41f46e4ef99953320f654aea9b60279d5d84628f6cce343758d949feb2a8ee4bf6bf2d9f413f79db702ce1f0a0ae141c8fa75b22b3e85a55532c89e2";

const DB_ID = "68fc96c0000e08dcfce2";
const PLAYERS_ID = "players";
const HOUSES_ID = "houses";
const AUCTION_STATE_ID = "auctionState";

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function resetAuction() {
  const headers = {
    'X-Appwrite-Project': PROJECT_ID,
    'X-Appwrite-Key': API_KEY,
    'Content-Type': 'application/json'
  };

  try {
    // 1. Fetch all players
    console.log("Fetching players...");
    // Appwrite queries require properly encoded arrays.
    console.log("Fetching players in chunks...");
    let allPlayers = [];
    let offset = 0;
    while(true) {
        const url = `${ENDPOINT}/databases/${DB_ID}/collections/${PLAYERS_ID}/documents?queries[]=${encodeURIComponent('limit(100)')}&queries[]=${encodeURIComponent(`offset(${offset})`)}`;
        const res = await fetch(url, { headers });
        const data = await res.json();
        
        if (!res.ok) {
          console.error("Error fetching players:", data);
          break;
        }

        const batch = data.documents || [];
        if(batch.length === 0) break;
        allPlayers = allPlayers.concat(batch);
        offset += batch.length;
        console.log(`Fetched ${allPlayers.length} players so far...`);
    }
    const players = allPlayers;
    console.log(`Fetched ${players.length} total players.`);

    // Update all sold players
    let resetCount = 0;
    for (const player of players) {
      if (player.isSold) {
        console.log(`Resetting player: ${player.name} (${player.$id})`);
        
        const updatePayload = {
            data: {
                isSold: false,
                sellingPrice: null,
                houseId: null
            }
        };

        const updateRes = await fetch(`${ENDPOINT}/databases/${DB_ID}/collections/${PLAYERS_ID}/documents/${player.$id}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(updatePayload)
        });

        if(!updateRes.ok) {
            console.error(`Failed to reset ${player.name}:`, await updateRes.text());
        } else {
            resetCount++;
        }
        await sleep(100); // slight rate limit protection
      }
    }
    console.log(`Successfully reset ${resetCount} players to unsold.`);

    // 2. Fetch houses and reset balances to 100,000,000
    console.log("Fetching houses...");
    const houseRes = await fetch(`${ENDPOINT}/databases/${DB_ID}/collections/${HOUSES_ID}/documents`, { headers });
    const houseData = await houseRes.json();
    for (const house of houseData.documents || []) {
        console.log(`Resetting balance for house: ${house.name}`);
        const updateRes = await fetch(`${ENDPOINT}/databases/${DB_ID}/collections/${HOUSES_ID}/documents/${house.$id}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ data: { balance: 30000 } })
        });
    }

    // 3. Reset auction state
    console.log("Resetting auction state...");
    const stateRes = await fetch(`${ENDPOINT}/databases/${DB_ID}/collections/${AUCTION_STATE_ID}/documents/live`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ 
            data: { 
                currentPlayerId: null, 
                currentBid: 0, 
                winningHouseId: null, 
                isAuctionActive: false,
                statusMessage: 'WAITING'
            } 
        })
    });
    
    if (stateRes.ok) {
        console.log("Auction state reset to WAITING.");
    }

    console.log("Database reset complete!");

  } catch (err) {
    console.error("Error resetting database:", err);
  }
}

resetAuction();
