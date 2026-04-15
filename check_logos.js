
const config = {
  endpoint: 'https://fra.cloud.appwrite.io/v1',
  projectId: '68fc96990022ec19614a',
  databaseId: '68fc96c0000e08dcfce2',
  housesTableId: 'houses',
  apiKey: "standard_8cf607b562facd0bc8d11ffdeb7b10d62db55115103e3a9b5dafef0fd16679b092f1dc6b819de9f5e9e94915e8684ecd8cdf4e2e41ce2ddeef2ef45d145dc68b7bb055ee41f46e4ef99953320f654aea9b60279d5d84628f6cce343758d949feb2a8ee4bf6bf2d9f413f79db702ce1f0a0ae141c8fa75b22b3e85a55532c89e2"
};

async function checkLogos() {
  const url = `${config.endpoint}/databases/${config.databaseId}/collections/${config.housesTableId}/documents`;
  
  const response = await fetch(url, {
    headers: {
      'X-Appwrite-Project': config.projectId,
      'X-Appwrite-Key': config.apiKey,
    }
  });

  if (!response.ok) {
    console.error('Failed to fetch:', await response.text());
    return;
  }

  const data = await response.json();
  console.log('Houses and their logos:');
  data.documents.forEach(h => {
    console.log(`- ${h.name}: ${h.logo}`);
  });
}

checkLogos();
