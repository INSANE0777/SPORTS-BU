# Player Photo Update Guide

## Summary
✅ **91 players matched with photos from public folder**
❌ **12 players without matching photos**

All photos are now in the `public` folder and ready to be displayed.

## How to Update Appwrite Database

You need to update the `photo` field for each player in your Appwrite database. Here are several methods:

### Method 1: Using Appwrite Console (Easiest)

1. Go to your Appwrite Console
2. Navigate to your Database → Players Collection
3. For each player listed below, update their `photo` field with the corresponding path

### Method 2: Using Appwrite SDK in Browser Console

Open your browser's Developer Console on your website and run:

```javascript
// You'll need to authenticate first if not already logged in
// Then run this script to update photos in batches

const updates = [
  { name: "Aryan Jaiswal", photo: "/Aryan Jaiswal.jpg" },
  { name: "Krish Mishra", photo: "/Krish Mishra.jpg" },
  { name: "Dhruv Prajapati", photo: "/Dhruv Prajapati.jpeg" },
  // ... (see full list below)
];

// Update function
async function updatePhotos() {
  for (const update of updates) {
    const player = players.find(p => p.name === update.name);
    if (player) {
      await databases.updateDocument(
        DATABASE_ID,
        PLAYERS_TABLE_ID,
        player.$id,
        { photo: update.photo }
      );
      console.log(`Updated: ${update.name}`);
    }
  }
}

// Run it
updatePhotos();
```

### Method 3: Using the update_player_photos.js Script

1. Make sure you have Node.js and the Appwrite SDK installed:
   ```bash
   npm install node-appwrite
   ```

2. Set your environment variables:
   ```bash
   export VITE_APPWRITE_ENDPOINT="your_endpoint"
   export VITE_APPWRITE_PROJECT_ID="your_project_id"
   export APPWRITE_API_KEY="your_api_key"
   export VITE_APPWRITE_DATABASE_ID="your_database_id"
   export VITE_APPWRITE_PLAYERS_TABLE_ID="players"
   ```

3. Run the update script:
   ```bash
   node update_player_photos.js
   ```

## Complete Photo Mappings (91 Players)

### A
- Aryan Jaiswal → `/Aryan Jaiswal.jpg`
- Aarsh Kamboj → `/Aarsh Kamboj.jpg`
- Adhya Gupta → `/Adhya Gupta.jpg`
- Aditya Rai → `/Aditya Rai.jpg`
- Aditya Mittal → `/Aditya Mittal.jpg`
- Aditya kumar → `/Aditya kumar.jpg`
- Aditya Kumar → `/Aditya kumar.jpg`
- Aditya Siwach → `/Aditya Siwach.jpg`
- Agrima Jain → `/Agrima Jain.jpg`
- Akash Sharma → `/Akash Sharma.jpg`
- Aman Singh → `/Aman Singh.jpg`
- Aarya giri → `/Aarya giri.jpg`
- Aakarshi Nigam → `/Aakarshi Nigam.jpeg`
- anubhav → `/anubhav.HEIC`
- Angil → `/Angil.jpg`
- Anshul → `/Anshul.jpg`
- Ananya Barath → `/Ananya Barath.jpg`
- Ananya Saxena → `/Ananya Saxena.jpg`
- Anushka Singh → `/Anushka Singh.png`
- Anmol Upadhyay(vc) → `/Anmol Upadhyay(vc).jpeg`
- Ankur Singh Chauhan → `/Ankur Singh Chauhan.jpg`
- Ashima → `/Ashima.jpg`
- Ashutosh → `/Ashutosh.jpg`

### B
- Bhanu Pratap → `/Bhanu Pratap.JPG`
- Bhumik → `/Bhumika Garg.jpg`
- Bhumika Garg → `/Bhumika Garg.jpg`

### C
- chirag jain → `/chirag jain.jpg`

### D
- Daksh → `/Daksh.jpg`
- Dhruv Prajapati → `/Dhruv Prajapati.jpeg`
- Dhruv agarwal → `/Dhruv agarwal.jpg`
- Dhruv Agarwal → `/Dhruv agarwal.jpg`
- Dhruv → `/Dhruv agarwal.jpg`
- Divyanshi → `/Divyanshi.jpg`

### G
- Gaurav Tiwari → `/Gaurav Tiwari.jpg`

### H
- Harsh Chandel → `/Harsh Chandel.jpg`
- Harshit Singh Chauhan → `/Harshit Singh Chauhan.jpg`
- Harshit Agarwal → `/Harshit Agarwal.jpg`

### I
- Ishaan Sharma → `/Ishaan Sharma.png`

### J
- jatin solanki → `/jatin solanki.jpg`

### K
- Kashvi Garg → `/Kashvi Garg.jpg`
- Krish Mishra → `/Krish Mishra.jpg`
- Krish Jhinkwan → `/Krish Jhinkwan.jpg`
- Kunal → `/Kunal.jpg`
- Kunsh kakkar → `/KUNSH.jpg`
- Kush → `/Kush Narwal.jpg`

### L
- Lakshay kumar → `/Lakshay kumar.jpg`
- Lavanya → `/Lavanya.jpg`
- Lavish Solanki → `/Lavish Solanki.jpg`

### M
- Mahek advani → `/Mahek advani.jpg`
- Mayank Sah → `/Mayank Sah.jpg`
- Mishika daver → `/Mishika daver.HEIC`
- Myra tyagi → `/Myra tyagi.jpg`

### N
- Navya Loshali → `/Navya Loshali.jpg`
- Navam Upadhyay → `/Navam Upadhyay.jpg`
- Nakul Kansal → `/Nakul Kansal.HEIC`
- Nehum Baid → `/Nehum Baid.heif`
- Neeyati Shukla → `/Neeyati Shukla.jpg`
- Nikunj Panwar → `/Nikunj Panwar.jpg`
- Nishit Nama → `/Nishit Nama.jpg`
- nimish jain → `/nimish jain.jpg`

### P
- Palakpreet Kaur → `/Palakpreet Kaur.jpg`
- Prarthana Rana → `/Prarthana Rana.jpg`
- Prashansa Chauhan → `/Prashansa Chauhan.pdf`
- Pranay Wadhwa → `/Pranay Wadhwa.jpg`

### R
- Rashi  Rajput → `/Rashi  Rajput.jpg`
- Ridhi Garg → `/Ridhi Garg.jpeg`
- Rudra Pratap → `/Rudra Pratap.jpg`
- Ryann singh → `/Ryann singh.jpg`
- Ryann Singh → `/Ryann singh.jpg`

### S
- Sania Tyagi → `/Sania Tyagi.jpeg`
- Sanvi ahuja → `/Sanvi ahuja.jpg`
- Sarman raj → `/Sarman raj.jpg`
- Saumya Sharma → `/Saumya Sharma.jpg`
- Sehej Joshi → `/Sehej Joshi.HEIC`
- Shubham Mishra → `/Shubham Mishra.jpg`
- Sriraam Rajendran → `/Sriraam Rajendran.jpg`
- Stuti Agarwal → `/Stuti Agarwal.jpg`
- Sudarshan Yadav → `/Sudarshan Yadav.jpg`
- Sundaram Sinha → `/Sundaram Sinha.jpg`
- Suraj → `/Suraj.jpg`
- Surya Pratap Singh Rathod → `/Surya Pratap Singh Rathod.jpg`

### T
- Tanvi Singhla → `/Tanvi Singh.jpg`
- Tanvi Singh → `/Tanvi Singh.jpg`

### U
- Uddhav Parihar → `/Uddhav Parihar.jpg`

### V
- vansh mathur → `/vansh mathur.jpg`
- Vansh Sehrawat → `/Vansh Sehrawat.jpeg`
- Vandita Goel → `/Vandita Goel.jpg`
- Vasu → `/Vasu.jpg`
- Vineet → `/Vineet.jpg`

### Y
- Yatharth Tyagi → `/Yatharth Tyagi.HEIC`

## Players Without Photos (12)

These players don't have matching photos yet:
- Dev soni
- Harshit dhaundiyal
- Ashmit Punia
- Abhinav Baisoya
- Akshat Khandelwal
- Soham Aich
- Priyanshu Chauhan
- Rudraksh Chaudhary
- Shourya
- shivansh
- Utkarsh raj
- Karthek G

**Note:** You may need to manually add photos for these players or verify their names in the Excel file.

## Verification

After updating the database:

1. Go to your Admin panel
2. Check that player photos are displaying correctly
3. Verify that the photo URLs point to `/filename.jpg` format
4. Test on different views (Admin, House, Broadcast)

## Important Notes

- All photos are served from the `/public` folder
- Photo paths should start with `/` (e.g., `/Aryan Jaiswal.jpg`)
- Vite automatically serves files from the `public` folder at the root path
- The photos are already optimized and ready to use
- Some players share photos (e.g., multiple "Aditya Kumar" entries share the same photo)

