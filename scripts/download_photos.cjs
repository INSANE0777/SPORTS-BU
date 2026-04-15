const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const CSV_PATH = 'a:/SPORTSBU/ink-cobalt-bid/selected_players.csv';
const OUTPUT_DIR = 'a:/SPORTSBU/ink-cobalt-bid/public';

function parseCSV(content) {
  const lines = content.split('\n').filter(l => l.trim());
  const players = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = [];
    let current = '';
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { parts.push(current.trim()); current = ''; continue; }
      current += ch;
    }
    parts.push(current.trim());
    if (parts.length < 7) continue;
    
    const name = parts[0].trim();
    const photoUrl = parts[5].trim();
    
    if (!name || !photoUrl) continue;
    players.push({ name, photoUrl });
  }
  return players;
}

function extractDriveFileId(url) {
  // https://drive.google.com/file/d/FILE_ID/view?...
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  
  // https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) return openMatch[1];
  
  return null;
}

function followRedirects(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Too many redirects'));
    
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return followRedirects(res.headers.location, maxRedirects - 1).then(resolve).catch(reject);
      }
      
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ data: Buffer.concat(chunks), contentType: res.headers['content-type'] || '', statusCode: res.statusCode }));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function getExtension(contentType) {
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return '.jpg';
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('webp')) return '.webp';
  if (contentType.includes('heic')) return '.heic';
  return '.jpg'; // default
}

async function downloadPlayer(name, photoUrl) {
  // Skip non-drive links and folder links
  if (photoUrl.includes('/drive/folders/')) {
    console.log(`  ⚠ FOLDER link (cannot download): ${name}`);
    return false;
  }
  
  if (photoUrl.includes('photos.app.goo.gl')) {
    console.log(`  ⚠ Google Photos link (cannot download directly): ${name}`);
    return false;
  }
  
  const fileId = extractDriveFileId(photoUrl);
  if (!fileId) {
    console.log(`  ⚠ Not a Drive file link: ${name} → ${photoUrl}`);
    return false;
  }
  
  // Check if file already exists
  const existingFiles = fs.readdirSync(OUTPUT_DIR).filter(f => {
    const baseName = path.parse(f).name.toLowerCase();
    return baseName === name.toLowerCase();
  });
  if (existingFiles.length > 0) {
    console.log(`  ✓ Already exists: ${name} → ${existingFiles[0]}`);
    return true;
  }
  
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  
  try {
    const result = await followRedirects(downloadUrl);
    
    if (result.statusCode !== 200) {
      console.log(`  ✗ HTTP ${result.statusCode} for ${name}`);
      return false;
    }
    
    // Check if we got an HTML page (virus scan warning for large files)
    const dataStr = result.data.toString('utf8', 0, 200);
    if (dataStr.includes('<html') || dataStr.includes('<!DOCTYPE')) {
      // Try confirm download URL
      const confirmMatch = dataStr.match(/confirm=([a-zA-Z0-9_-]+)/);
      if (confirmMatch) {
        const confirmUrl = `https://drive.google.com/uc?export=download&confirm=${confirmMatch[1]}&id=${fileId}`;
        const retryResult = await followRedirects(confirmUrl);
        if (retryResult.statusCode === 200 && !retryResult.data.toString('utf8', 0, 50).includes('<html')) {
          const ext = getExtension(retryResult.contentType);
          const filename = `${name}${ext}`;
          fs.writeFileSync(path.join(OUTPUT_DIR, filename), retryResult.data);
          console.log(`  ✓ Downloaded (confirmed): ${filename} (${(retryResult.data.length / 1024).toFixed(0)}KB)`);
          return true;
        }
      }
      console.log(`  ✗ Got HTML page (likely permission issue): ${name}`);
      return false;
    }
    
    const ext = getExtension(result.contentType);
    const filename = `${name}${ext}`;
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), result.data);
    console.log(`  ✓ Downloaded: ${filename} (${(result.data.length / 1024).toFixed(0)}KB)`);
    return true;
  } catch (err) {
    console.log(`  ✗ Error for ${name}: ${err.message}`);
    return false;
  }
}

async function run() {
  const csvContent = fs.readFileSync(CSV_PATH, 'utf8');
  const players = parseCSV(csvContent);
  
  const driveLinked = players.filter(p => p.photoUrl.includes('drive.google.com') || p.photoUrl.includes('photos.app.goo.gl'));
  console.log(`Found ${driveLinked.length} players with Drive/Photos links.\n`);
  
  let downloaded = 0, skipped = 0, failed = 0;
  
  for (const player of driveLinked) {
    const result = await downloadPlayer(player.name, player.photoUrl);
    if (result) downloaded++;
    else { 
      // Check if it was a skip or fail
      if (player.photoUrl.includes('/drive/folders/') || player.photoUrl.includes('photos.app.goo.gl')) skipped++;
      else failed++;
    }
  }
  
  console.log(`\n=== RESULTS ===`);
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Skipped (folders/photos links): ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total Drive links: ${driveLinked.length}`);
}

run().catch(e => console.error(e));
