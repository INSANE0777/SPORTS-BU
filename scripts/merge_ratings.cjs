const fs = require('fs');
const path = require('path');

const dir = 'a:/SPORTSBU/ink-cobalt-bid';
const output = 'a:/SPORTSBU/ink-cobalt-bid/all_players_merged.csv';

const files = fs.readdirSync(dir).filter(f => f.toLowerCase().includes('.csv') && !f.includes('merged') && !f.includes('update'));

const allData = [];
// Headers: Name, Enrollment, Course, Phone, Rating, Photo/Link, Sport
const standardHeaders = ['Name', 'Enrollment ID', 'Course', 'Phone Number', 'Rating', 'Photo URL', 'Sport'];

files.forEach(file => {
    let sport = file.replace('.csv', '');
    if (sport.toLowerCase().startsWith('ratings - ')) {
        sport = sport.substring(10);
    }
    
    console.log(`Processing: ${file} as Sport: ${sport}`);
    
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    let headerIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        const lowerLine = lines[i].toLowerCase();
        if (lowerLine.startsWith('name') && lowerLine.includes('rating')) {
            headerIndex = i;
            break;
        }
    }
    
    if (headerIndex === -1) {
        console.warn(`Could not find header in ${file}`);
        return;
    }
    
    for (let i = headerIndex + 1; i < lines.length; i++) {
        const line = lines[i];
        const parts = line.split(',');
        
        // Skip essentially empty lines
        if (parts.length < 2 || (parts[0] === '' && parts[1] === '')) continue;
        
        const row = [];
        // Map common columns by index (assuming they follow the seen pattern)
        // 0: Name
        // 1: Enrollment
        // 2: Course
        // 3: Phone
        // 4: Rating
        // 5: Photo Link
        for (let j = 0; j < 6; j++) {
            row.push(parts[j] ? parts[j].trim() : "");
        }
        row.push(sport);
        allData.push(row);
    }
});

const csvContent = [
    standardHeaders.join(','),
    ...allData.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
].join('\n');

fs.writeFileSync(output, csvContent);
console.log(`Successfully merged ${allData.length} players from ${files.length} files into ${output}`);
