import { useState, useEffect, useCallback } from 'react'; 
import { databases, client } from '../lib/appwrite';
import appwriteConfig from '@/config/appwrite';
import { PlayerDocument, HouseDocument, AuctionStateDocument } from '@/types/appwrite';
import { Query } from 'appwrite';

export const useAuctionRealtime = () => {
  const [players, setPlayers] = useState<PlayerDocument[]>([]);
  const [houses, setHouses] = useState<HouseDocument[]>([]);
  const [auctionState, setAuctionState] = useState<AuctionStateDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

 
  const fetchAllData = useCallback(async () => {
    try {
      const [playersRes, housesRes, auctionStateRes] = await Promise.all([
        databases.listDocuments<PlayerDocument>(
          appwriteConfig.databaseId, 
          appwriteConfig.playersTableId,
          [Query.limit(500)] // Fetch up to 500 players
        ),
        databases.listDocuments<HouseDocument>(
          appwriteConfig.databaseId, 
          appwriteConfig.housesTableId,
          [Query.limit(50)] // Fetch up to 50 houses
        ),
        databases.getDocument<AuctionStateDocument>(appwriteConfig.databaseId, appwriteConfig.auctionStateTableId, appwriteConfig.auctionStateDocId)
      ]);
      setPlayers(playersRes.documents);
      setHouses(housesRes.documents);
      setAuctionState(auctionStateRes);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      // Use a functional update to avoid needing 'isLoading' as a dependency
      setIsLoading(currentLoadingState => {
        if (currentLoadingState) return false;
        return currentLoadingState;
      });
    }
  }, []); // useCallback also has a dependency array, which should be empty here.

  useEffect(() => {
    // 3. The main effect now focuses only on fetching and subscribing.
    
    // Fetch initial data
    fetchAllData();

    // The subscription now calls the stable `fetchAllData` function from useCallback
    const unsubscribe = client.subscribe('documents', () => {
      console.log('Realtime event received! Refetching all data...');
      fetchAllData();
    });

    return () => {
      unsubscribe();
    };
  }, 
 
  [fetchAllData]);
  
  return { players, houses, auctionState, isLoading };
};