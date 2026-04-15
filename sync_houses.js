
const ENDPOINT = "https://fra.cloud.appwrite.io/v1"; 
const PROJECT_ID = "68fc96990022ec19614a";
const API_KEY = "standard_8cf607b562facd0bc8d11ffdeb7b10d62db55115103e3a9b5dafef0fd16679b092f1dc6b819de9f5e9e94915e8684ecd8cdf4e2e41ce2ddeef2ef45d145dc68b7bb055ee41f46e4ef99953320f654aea9b60279d5d84628f6cce343758d949feb2a8ee4bf6bf2d9f413f79db702ce1f0a0ae141c8fa75b22b3e85a55532c89e2";
const DATABASE_ID = "68fc96c0000e08dcfce2";
const HOUSES_TABLE_ID = "houses";

const finalHouses = [
  {
    $id: "68ffa7a4001ae9e266f9",
    name: "KEEN KICKERS",
    color: "#4ADE80",
    balance: 50000,
    logo: "/pic3.png"
  },
  {
    $id: "68ffa94f000e9e21cd92",
    name: "MIGHTY BOLTZ",
    color: "#A78BFA",
    balance: 50000,
    logo: "/pic1.png"
  },
  {
    $id: "690652a27beff6535c29",
    name: "SUPER SPADES",
    color: "#22D3EE",
    balance: 50000,
    logo: "/pic2.png"
  },
  {
    $id: "690652a27bf6fa83727f",
    name: "HEROIC HEARTS",
    color: "#F87171",
    balance: 50000,
    logo: "/pic4.png"
  }
];

const housesToDelete = [
  "690652a27bf879c425f8", // Earth House
  "690652a27bf9fdd212a2"  // Air House
];

async function sync() {
  // Update houses
  for (const house of finalHouses) {
    const url = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${HOUSES_TABLE_ID}/documents/${house.$id}`;
    const { $id, ...data } = house;
    
    console.log(`Updating house ${house.name} (${$id})...`);
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'X-Appwrite-Project': PROJECT_ID,
          'X-Appwrite-Key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // FIELDS AT TOP LEVEL
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`Failed to update ${house.name}:`, error);
      } else {
        console.log(`Successfully updated ${house.name}`);
      }
    } catch (e) {
      console.error(`Error updating ${house.name}:`, e);
    }
  }

  // Delete redundant houses
  for (const id of housesToDelete) {
    const url = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${HOUSES_TABLE_ID}/documents/${id}`;
    console.log(`Deleting redundant house ${id}...`);
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'X-Appwrite-Project': PROJECT_ID,
          'X-Appwrite-Key': API_KEY
        }
      });

      if (!response.ok) {
        console.error(`Failed to delete ${id}:`, await response.text());
      } else {
        console.log(`Successfully deleted ${id}`);
      }
    } catch (e) {
      console.error(`Error deleting ${id}:`, e);
    }
  }
}

sync();
