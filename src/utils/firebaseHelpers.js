import { db } from '../firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';

// User Profile Operations
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...profileData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Video Operations
export const uploadVideo = async (userId, videoData) => {
  const videosRef = collection(db, 'videos');
  return await addDoc(videosRef, {
    ...videoData,
    userId,
    createdAt: serverTimestamp(),
  });
};

export const getVideos = async (limit = 15) => {
  const videosRef = collection(db, 'videos');
  const q = query(videosRef);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Match Operations
export const createMatch = async (user1Id, user2Id) => {
  const matchesRef = collection(db, 'matches');
  return await addDoc(matchesRef, {
    user1Id,
    user2Id,
    createdAt: serverTimestamp(),
    status: 'pending', // pending, accepted, rejected
  });
};

export const getUserMatches = async (userId) => {
  const matchesRef = collection(db, 'matches');
  const q = query(
    matchesRef,
    where('status', '==', 'accepted'),
    where('user1Id', '==', userId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Search Operations
export const searchUsers = async (searchQuery) => {
  const usersRef = collection(db, 'users');
  const q = query(
    usersRef,
    where('displayName', '>=', searchQuery),
    where('displayName', '<=', searchQuery + '\uf8ff')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Track new investment
export const trackInvestment = async (userId, videoData) => {
  try {
    // Add investment to user's profile
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      investments: arrayUnion({
        companyName: videoData.creator,
        title: videoData.title,
        amount: 0, // This would be updated when actual investment is made
        date: new Date().toISOString(),
        status: 'interested',
        videoId: videoData.id
      })
    });

    // Add to investments collection
    await addDoc(collection(db, 'investments'), {
      userId,
      videoId: videoData.id,
      companyName: videoData.creator,
      title: videoData.title,
      status: 'interested',
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error tracking investment:', error);
    throw error;
  }
};

// Get user's investments
export const getUserInvestments = async (userId) => {
  try {
    const investmentsQuery = query(
      collection(db, 'investments'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(investmentsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user investments:', error);
    throw error;
  }
};

// Update investment status
export const updateInvestmentStatus = async (investmentId, status) => {
  try {
    await updateDoc(doc(db, 'investments', investmentId), {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating investment status:', error);
    throw error;
  }
}; 