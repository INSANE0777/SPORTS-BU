const fs = require('fs');
const path = require('path');

const PUBLIC = 'a:/SPORTSBU/ink-cobalt-bid/public';

const mappings = {
  "Myra Tyagi": "/Myra tyagi.jpg",
  "Prashansa Chauhan": "/Prashansa Chauhan.png",
  "Harshit dhankar": "/Harshit dhankar.jpg",
  "Ishant kathait": "/Ishant kathait.jpg",
  "mayank yadav": "/mayank yadav.jpg",
  "arjun nema": "/arjun nema.jpg",
  "savi arora": "/savi arora.jpg",
  "Bhumika garg": "/Bhumika Garg.jpg",
  "Neharika": "/Neharika.jpg",
  "Anushka singh": "/Anushka Singh.png",
  "aakarshi nigam": "/Aakarshi Nigam.jpeg",
  "pragya saraswat": "/pragya saraswat.jpg",
  "kanan seherawat": "/kanan seherawat.jpg",
  "vanshika dhaka": "/vanshika dhaka.jpg",
  "meenal": "/meenal.jpg",
  "pallavi": "/pallavi.jpg",
  "Harshit Singh Chauhan": "/Harshit Singh Chauhan.jpg",
  "kaustubh": "/kaustubh.jpg",
  "shivansh": "/shivansh.JPG",
  "Dabeer": "/Dabeer.jpg",
  "anubhav": "/anubhav.jpg",
  "Aditya": "/Aditya.jpg",
  "Shreedar": "/Shreedar.jpg",
  "Abhinav Baisoya": "/Abhinav Baisoya.jpg",
  "Soham Aich": "/Soham Aich.jpg",
  "Jai Kadian": "/Jai Kadian.jpg",
  "Akshat Khandelwal": "/Akshat Khandelwal.jpg",
  "Ajay Adhikari": "/Ajay Adhikari.jpg",
  "Sarthak Singhal": "/Sarthak Singhal.jpg",
  "Sarvagya Mishra": "/Sarvagya Mishra.jpg",
  "Pranjal": "/Pranjal.jpg",
  "Shlesh": "/Shlesh.jpg",
  "Bhanu": "/Bhanu.jpg",
  "Shubham": "/Shubham.png",
  "Harshit Agarwal": "/Harshit Agarwal.jpg",
  "Shaurya Rastogi": "/Shaurya Rastogi .jpeg",
  "Ashmit Punia": "/ashmit photo.jpeg",
  "Navam Upadhyay": "/Navam Upadhyay.jpg",
  "Aarya Giri": "/Aarya giri.jpg",
  "Sarman Raj": "/Sarman raj.jpg",
  "Mayank Sah": "/Mayank Sah.jpg",
  "Nikunj": "/Nikunj.jpg",
  "Shresth Singh": "/Shresth Singh.JPG",
  "Kunal": "/Kunal.jpg",
  "Harsh Chandel": "/Harsh Chandel.jpg",
  "Prince": "/Prince.jpg",
  "Prarthana Rana": "/Prarthana Rana.jpg",
  "Stuti Agarwal": "/Stuti Agarwal.jpg",
  "Neeyati Shukla": "/Neeyati Shukla.jpg",
  "Divyanshi": "/Divyanshi.jpg",
  "Prashansha": "/Prashansha.jpg",
};

let ok = 0, missing = 0;
for (const [name, filePath] of Object.entries(mappings)) {
  const fullPath = path.join(PUBLIC, filePath.substring(1));
  if (fs.existsSync(fullPath)) {
    ok++;
  } else {
    missing++;
    console.log(`MISSING: ${name} → ${filePath}`);
  }
}
console.log(`\n${ok} found, ${missing} missing out of ${ok + missing} total`);
