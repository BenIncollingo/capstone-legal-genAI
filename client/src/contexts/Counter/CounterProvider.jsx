//this file creates a context for tracking document upload statistics
//it stores the total number of uploads and a list of recently uploaded files

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import {
  doc,
  onSnapshot,
  increment,
  arrayUnion,
  arrayRemove,
  setDoc
} from 'firebase/firestore';

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
      await setDoc(
        statsRef,
        {
          total: increment(1),
          recentFiles: arrayUnion(fileName),
        },
        { merge: true }
      );

      console.log("Firestore updated!");
    } catch (error) {
      console.error("Update failed: ", error);
    }
  };

  // Function to call after a successful delete
  const removeUpload = async (fileName) => {
    console.log("removeUpload was called with:", fileName);
    const statsRef = doc(db, 'stats', 'global_counter');

    try {
      await setDoc(
        statsRef,
        {
          total: increment(-1),
          recentFiles: arrayRemove(fileName),
        },
        { merge: true }
      );

      console.log("Firestore delete update successful!");
    } catch (error) {
      console.error("Delete update failed: ", error);
    }
  };

  return (
    <CounterContext.Provider value={{ stats, recordUpload, removeUpload }}>
      {children}
    </CounterContext.Provider>
  );
};

export const useCounter = () => useContext(CounterContext);