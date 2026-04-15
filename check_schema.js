const ENDPOINT = "https://fra.cloud.appwrite.io/v1";
const PROJECT_ID = "68fc96990022ec19614a";
const API_KEY = "standard_8cf607b562facd0bc8d11ffdeb7b10d62db55115103e3a9b5dafef0fd16679b092f1dc6b819de9f5e9e94915e8684ecd8cdf4e2e41ce2ddeef2ef45d145dc68b7bb055ee41f46e4ef99953320f654aea9b60279d5d84628f6cce343758d949feb2a8ee4bf6bf2d9f413f79db702ce1f0a0ae141c8fa75b22b3e85a55532c89e2";
const DATABASE_ID = "68fc96c0000e08dcfce2";
const HOUSES_TABLE_ID = "houses";

async function checkSchema() {
  const url = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${HOUSES_TABLE_ID}`;
  const response = await fetch(url, {
    headers: {
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': API_KEY,
    }
  });

  if (!response.ok) {
    console.error(`Error: ${response.status}`, await response.text());
  } else {
    const data = await response.json();
    console.log(JSON.stringify(data.attributes, null, 2));
  }
}

checkSchema();
