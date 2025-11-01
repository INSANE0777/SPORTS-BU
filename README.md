# Sports Auction Platform

A real-time sports player auction system built with React, TypeScript, and Appwrite. Features live bidding, house competition, and an elegant auction experience for managing player acquisitions.

## 🎯 Features

### Core Functionality
- **Real-time Live Auctions** - Live bidding with instant updates across all views
- **Multi-House Competition** - Multiple houses compete to acquire players
- **Admin Control Panel** - Complete auction management system
- **Player Scheduling** - Intelligent scheduling with elite players (rating 9+) appearing after every 6-7 normal players
- **Balance Management** - Automatic balance deduction when players are sold
- **Sold Animations** - Celebratory animations when players are acquired

### Views
- **Broadcast View** - Public display for live auction viewing
- **House View** - House-specific dashboard with balance and bidding interface
- **Admin View** - Complete auction control with player management

### Special Features
- **Elite Player Highlighting** - Players with rating 9+ get special golden treatment
- **Real-time Updates** - All views update instantly via Appwrite Realtime
- **Responsive Design** - Modern UI with advanced animations and transitions
- **House-specific Login** - Users automatically redirected to their house view

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Appwrite (Database, Authentication, Realtime, Functions)
- **Routing**: React Router DOM
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Animations**: GSAP, Framer Motion (via tailwindcss-animate)
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Appwrite account and project
- Appwrite API Key with required permissions

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ink-cobalt-bid
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://your-endpoint.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_PROJECT_NAME=Sports Bu
VITE_APPWRITE_DATABASE_ID=your_database_id

# Table IDs
VITE_APPWRITE_PLAYERS_TABLE_ID=players
VITE_APPWRITE_HOUSES_TABLE_ID=houses
VITE_APPWRITE_AUCTION_STATE_TABLE_ID=auctionState

# Document IDs
VITE_APPWRITE_AUCTION_STATE_DOC_ID=live

# Function IDs
VITE_APPWRITE_SOLD_PLAYER_FUNCTION_ID=your_function_id
VITE_APPWRITE_HANDLE_BID_FUNCTION_ID=your_function_id
VITE_APPWRITE_AUCTION_HANDLER_FUNCTION_ID=your_function_id

# API Key (Note: This is used in Appwrite Functions, not frontend)
APPWRITE_API_KEY=your_api_key
```

### 4. Appwrite Setup

#### Database Schema

**Players Table** (`players`):
- `name` (String)
- `uniqueId` (String) - Enrollment number
- `course` (String)
- `photo` (String)
- `rating` (Integer)
- `sport` (String)
- `basePrice` (Integer)
- `specialSkills` (String[], optional)
- `isSold` (Boolean)
- `sellingPrice` (String, optional)
- `houseId` (String, optional)

**Houses Table** (`houses`):
- `name` (String)
- `color` (String)
- `balance` (Integer)

**Auction State Table** (`auctionState`):
- `currentPlayerId` (String)
- `currentBid` (Integer)
- `winningHouseId` (String)
- `isAuctionActive` (Boolean)
- `statusMessage` (String, max 30 characters)

#### Appwrite Functions

**sold Function** (`src/functions/sold/index.js`):
- Handles player sale and balance deduction
- Environment variables required:
  - `VITE_APPWRITE_ENDPOINT`
  - `VITE_APPWRITE_PROJECT_ID`
  - `VITE_APPWRITE_DATABASE_ID`
  - `VITE_APPWRITE_PLAYERS_TABLE_ID`
  - `VITE_APPWRITE_HOUSES_TABLE_ID`
  - `APPWRITE_API_KEY`

Deploy using Appwrite CLI:
```bash
cd src/functions/sold
appwrite functions create-deployment --function-id=YOUR_FUNCTION_ID --entrypoint="index.js" --code="." --activate=true
```

#### User Preferences Setup

Store house association in user preferences:
- `role`: "admin" | "house" | "viewer"
- `houseId`: House ID (for house role users)

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── PlayerCard.tsx   # Player display card with elite player highlighting
│   └── ui/              # shadcn/ui components
├── config/              # Configuration files
│   └── appwrite.ts      # Appwrite configuration
├── context/             # React contexts
│   └── AuthContext.jsx  # Authentication context with house routing
├── functions/           # Appwrite serverless functions
│   └── sold/            # Sold player function
├── hooks/               # Custom React hooks
│   └── useAuctionRealtime.ts  # Real-time auction data hook
├── lib/                 # Library configurations
│   └── appwrite.ts      # Appwrite client setup
├── pages/               # Page components
│   ├── Admin.tsx         # Admin control panel
│   ├── BroadcastView.tsx # Public broadcast view
│   ├── HouseView.tsx     # House-specific view
│   ├── Landing.tsx       # Landing page
│   └── Login.jsx         # Login page
├── types/               # TypeScript type definitions
│   └── appwrite.d.ts    # Appwrite document types
└── main.tsx             # Application entry point
```

## 🎮 Usage

### Admin Panel

1. Login with admin credentials
2. **Start Auction**: Begin auction with first unsold player
3. **Place Bids**: Use quick buttons (+100, +250, +500) or manual bid entry
4. **Sold**: Mark player as sold (triggers balance deduction)
5. **Skip Player**: Skip to next unsold player
6. **Pause/Resume**: Control auction flow
7. **Reset Auction**: Reset auction state for new session

### House View

1. Login with house credentials (automatically routes to house view)
2. View current player being auctioned
3. Monitor balance in real-time
4. See winning status when leading bid
5. View spotlight players (top-rated upcoming players)

### Broadcast View

1. Public view showing live auction
2. Displays current player, bid, and leading house
3. Shows all house balances
4. Displays sold animation when player is acquired

## 🎨 Design Features

- **Color Palette**: Custom auction theme (ink, paper, cobalt, pink-eraser)
- **Elite Players**: Golden highlighting for players with rating 9+
- **Advanced Animations**: Smooth transitions, hover effects, and micro-interactions
- **Depth & Shadows**: Multi-level shadow system for visual hierarchy
- **Responsive**: Works seamlessly on desktop and mobile

## 🔐 Authentication

- Email/Password authentication via Appwrite
- House-specific routing based on user preferences
- Role-based access (admin, house, viewer)
- Automatic session management

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Appwrite Hosting

1. Build the project
2. Upload `dist/` folder to Appwrite Hosting
3. Configure environment variables in Appwrite Console

## 📝 Environment Variables for Functions

When deploying Appwrite functions, ensure these environment variables are set:

```
VITE_APPWRITE_ENDPOINT
VITE_APPWRITE_PROJECT_ID
VITE_APPWRITE_DATABASE_ID
VITE_APPWRITE_PLAYERS_TABLE_ID
VITE_APPWRITE_HOUSES_TABLE_ID
APPWRITE_API_KEY
```

## 🐛 Troubleshooting

### "Missing required environment variables"
- Ensure all environment variables are set in `.env` file
- Check Appwrite Console for function environment variables

### "Session active" error on login
- The app automatically handles session cleanup
- If issues persist, clear browser cookies

### Real-time updates not working
- Verify Appwrite Realtime is enabled for your database
- Check network connectivity
- Ensure proper permissions are set

### Balance not decreasing
- Verify `sold` function is deployed and active
- Check function logs in Appwrite Console
- Ensure function environment variables are set correctly

## 📄 License

This project is private and proprietary.

## 👥 Contributing

This is a private project. Please contact the project maintainers for contribution guidelines.

---

Built with ❤️ for Sports Auction Management

