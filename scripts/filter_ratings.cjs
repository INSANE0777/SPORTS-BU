const fs = require('fs');
const lines = fs.readFileSync('a:/SPORTSBU/ink-cobalt-bid/all_players_merged.csv', 'utf8').split('\n');
const header = lines[0];
const filtered = lines.slice(1).filter(l => {
  if (!l.trim()) return false;
  const parts = l.split(',');
  const rating = parseFloat(parts[4].replace(/"/g, ''));
  return !isNaN(rating) && rating >= 6.5;
});
const out = [header, ...filtered].join('\n');
fs.writeFileSync('a:/SPORTSBU/ink-cobalt-bid/selected_players.csv', out);
console.log(`Filtered: ${filtered.length} players with rating >= 6.5 (from ${lines.length - 1} total)`);
