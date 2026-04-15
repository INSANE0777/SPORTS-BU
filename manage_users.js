
const ENDPOINT = "https://fra.cloud.appwrite.io/v1"; 
const PROJECT_ID = "68fc96990022ec19614a";
const API_KEY = "standard_8cf607b562facd0bc8d11ffdeb7b10d62db55115103e3a9b5dafef0fd16679b092f1dc6b819de9f5e9e94915e8684ecd8cdf4e2e41ce2ddeef2ef45d145dc68b7bb055ee41f46e4ef99953320f654aea9b60279d5d84628f6cce343758d949feb2a8ee4bf6bf2d9f413f79db702ce1f0a0ae141c8fa75b22b3e85a55532c89e2";

async function manageUsers() {
  const headers = {
    'X-Appwrite-Project': PROJECT_ID,
    'X-Appwrite-Key': API_KEY,
    'Content-Type': 'application/json'
  };

  try {
    // 1. Fetch all users
    console.log("Fetching all users...");
    const res = await fetch(`${ENDPOINT}/users`, { headers });
    const data = await res.json();
    console.log(`Found ${data.total} users.`);

    // 2. Fetch houses
    const DATABASE_ID = "68fc96c0000e08dcfce2";
    const HOUSES_TABLE_ID = "houses";
    const houseRes = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${HOUSES_TABLE_ID}/documents`, { headers });
    const houseData = await houseRes.json();
    const houses = houseData.documents;
    console.log(`Found ${houses.length} active houses.`);

    // We don't want to delete admin users. So we look at user.prefs or just delete by email pattern
    for (const user of data.users) {
      if (user.email === 'admin@sportsbu.com' || user.email.includes('admin')) {
        console.log(`Skipping admin user: ${user.email}`);
        continue;
      }
      console.log(`Deleting old user: ${user.email} (${user.$id})`);
      await fetch(`${ENDPOINT}/users/${user.$id}`, { method: 'DELETE', headers });
    }

    // 3. Create new users for the 4 houses
    for (const house of houses) {
      const shortName = house.name.split(' ')[0].toLowerCase();
      const email = `${shortName}@sportsbu.com`;
      const password = house.name.replace(/\s+/g, '').toLowerCase() + "123";
      
      console.log(`Creating user for ${house.name}... Email: ${email}, Password: ${password}`);
      const userId = "unique()";
      
      const createRes = await fetch(`${ENDPOINT}/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userId: shortName, // Using shortName as ID for simplicity
          email: email,
          password: password,
          name: house.name,
        })
      });
      
      if (!createRes.ok) {
        // ID might be too short or invalid, retry with unique
        console.log(`Failed to create with simple ID, retrying with unique()...`);
        const retryRes = await fetch(`${ENDPOINT}/users`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              userId: `house_${shortName}`, 
              email: email,
              password: password,
              name: house.name,
            })
        });
        const createdUser = await retryRes.json();
        
        if(retryRes.ok) {
            console.log(`Update prefs for ${createdUser.$id} with houseId: ${house.$id}`);
            await fetch(`${ENDPOINT}/users/${createdUser.$id}/prefs`, {
              method: 'PATCH',
              headers,
              body: JSON.stringify({ prefs: { role: 'house', houseId: house.$id } })
            });
        } else {
            console.error("Error creating user", await retryRes.text());
        }
      } else {
        const createdUser = await createRes.json();
        console.log(`Update prefs for ${createdUser.$id} with houseId: ${house.$id}`);
        const prefRes = await fetch(`${ENDPOINT}/users/${createdUser.$id}/prefs`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ prefs: { role: 'house', houseId: house.$id } })
        });
        if(!prefRes.ok) console.error("Pref error:", await prefRes.text());
      }
    }
    
    console.log("Done updating users!");
  } catch (err) {
    console.error("Error managing users:", err);
  }
}

manageUsers();
