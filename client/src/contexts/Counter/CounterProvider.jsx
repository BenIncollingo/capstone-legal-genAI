// CounterContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { doc, onSnapshot, updateDoc, increment, arrayUnion, setDoc } from 'firebase/firestore';

const CounterContext = createContext();

export const CounterProvider = ({ children }) => {
  const [stats, setStats] = useState({ total: 0, recentFiles: [] });

  useEffect(() => {
    // Reference to your specific "metadata" document
    const statsRef = doc(db, 'stats', 'global_counter');

    // Real-time listener: updates 'stats' state whenever DB changes
    const unsubscribe = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        setStats(docSnap.data());
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Function to call after a successful external API upload
  const recordUpload = async (fileName) => {
    console.log("recordUpload was called with:", fileName); 
    const statsRef = doc(db, 'stats', 'global_counter');
    
    try {
      // setDoc with merge: true creates the doc if it doesn't exist 
      // OR updates it if it does.
      await setDoc(statsRef, {
        total: increment(1),
        recentFiles: arrayUnion(fileName)
      }, { merge: true });
      
      console.log("Firestore updated!");
    } catch (error) {
      console.error("Update failed: ", error);
    }
  };

  return (
    <CounterContext.Provider value={{ stats, recordUpload }}>
      {children}
    </CounterContext.Provider>
  );
};

export const useCounter = () => useContext(CounterContext);
