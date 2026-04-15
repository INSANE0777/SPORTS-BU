
const ENDPOINT = "https://fra.cloud.appwrite.io/v1"; 
const PROJECT_ID = "68fc96990022ec19614a";
const API_KEY = "standard_8cf607b562facd0bc8d11ffdeb7b10d62db55115103e3a9b5dafef0fd16679b092f1dc6b819de9f5e9e94915e8684ecd8cdf4e2e41ce2ddeef2ef45d145dc68b7bb055ee41f46e4ef99953320f654aea9b60279d5d84628f6cce343758d949feb2a8ee4bf6bf2d9f413f79db702ce1f0a0ae141c8fa75b22b3e85a55532c89e2";
const DATABASE_ID = "68fc96c0000e08dcfce2";
const HOUSES_TABLE_ID = "houses";

const mapping = {
  "KEEN KICKERS": { color: "#4ADE80", logo: "/pic3.png" }, // Samurai
  "MIGHTY BOLTZ": { color: "#A78BFA", logo: "/pic1.png" }, // Skull
  "SUPER SPADES": { color: "#60A5FA", logo: "/pic2.png" }, // Dragon
  "HEROIC HEARTS": { color: "#F87171", logo: "/pic4.png" }  // Phoenix
};

async function updateBranding() {
  console.log("Fetching houses...");
  const listUrl = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${HOUSES_TABLE_ID}/documents`;
  
  const listResponse = await fetch(listUrl, {
    headers: {
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': API_KEY
    }
  });

  const { documents: houses } = await listResponse.json();
  console.log(`Found ${houses.length} houses.`);

  for (const house of houses) {
    const config = mapping[house.name];
    if (config) {
      console.log(`Updating ${house.name} (${house.$id}) with logo ${config.logo}...`);
      const updateUrl = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${HOUSES_TABLE_ID}/documents/${house.$id}`;
      
      const payload = {
        name: house.name,
        color: config.color,
        logo: config.logo,
        balance: house.balance || 50000
      };

      const response = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'X-Appwrite-Project': PROJECT_ID,
          'X-Appwrite-Key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: payload })
      });

      if (response.ok) {
        console.log(`Successfully updated ${house.name}`);
      } else {
        const errorText = await response.text();
        console.error(`Failed to update ${house.name}: HTTP ${response.status} - ${errorText}`);
      }
    } else {
      console.log(`Skipping unknown house: ${house.name}`);
    }
  }
}

updateBranding();
