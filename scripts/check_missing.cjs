const fs = require('fs');
const content = fs.readFileSync('a:/SPORTSBU/ink-cobalt-bid/selected_players.csv', 'utf8');
const lines = content.split('\n').filter(l => l.trim());

console.log("Players WITHOUT a Google Drive link:\n");
let count = 0;

for (let i = 1; i < lines.length; i++) {
  const parts = [];
  let cur = '', inQ = false;
  for (const ch of lines[i]) {
    if (ch === '"') { inQ = !inQ; continue; }
    if (ch === ',' && !inQ) { parts.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  parts.push(cur.trim());

  const name = parts[0];
  const photo = parts[5] || '';
  const sport = (parts[6] || '').replace(/\.$/, '');

  if (!photo.includes('drive.google.com') && !photo.includes('photos.app.goo.gl')) {
    count++;
    console.log(`${count}. ${name} (${sport}) → Photo: ${photo || 'NONE'}`);
  }
}
console.log(`\nTotal: ${count} players without Drive links`);
