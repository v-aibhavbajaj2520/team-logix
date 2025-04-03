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
  arrayUnion,
  setDoc,
  orderBy,
  Timestamp,
  increment
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

// Get user's wallet balance
export const getUserWallet = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data().walletBalance || 0 : 0;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw error;
  }
};

// Update wallet balance
export const updateWalletBalance = async (userId, amount, type = 'add') => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const currentBalance = userDoc.data().walletBalance || 0;
    const newBalance = type === 'add' 
      ? currentBalance + amount 
      : currentBalance - amount;

    if (newBalance < 0) {
      throw new Error('Insufficient balance');
    }

    await updateDoc(userRef, {
      walletBalance: newBalance
    });

    return newBalance;
  } catch (error) {
    console.error('Error updating wallet balance:', error);
    throw error;
  }
};

// Track a new investment
export const trackInvestment = async (userId, investmentData) => {
  try {
    const { amount, videoId, title, creator, domain } = investmentData;
    const timestamp = Timestamp.now();

    // Check wallet balance
    const walletBalance = await getUserWallet(userId);
    if (walletBalance < amount) {
      throw new Error('Insufficient wallet balance');
    }

    // Deduct from wallet
    await updateWalletBalance(userId, amount, 'subtract');

    // Add to investments collection
    const investmentRef = doc(collection(db, 'investments'));
    await setDoc(investmentRef, {
      userId,
      videoId,
      amount: Number(amount),
      title,
      creator,
      domain,
      timestamp,
      status: 'Active'
    });

    // Update user's investment stats
    const userStatsRef = doc(db, 'userStats', userId);
    const userStatsDoc = await getDoc(userStatsRef);

    if (userStatsDoc.exists()) {
      await updateDoc(userStatsRef, {
        totalInvested: increment(Number(amount)),
        activeInvestments: increment(1),
        domains: arrayUnion(domain)
      });
    } else {
      await setDoc(userStatsRef, {
        totalInvested: Number(amount),
        activeInvestments: 1,
        domains: [domain],
        returns: 0,
        portfolioGrowth: 0
      });
    }

    // Update domain statistics
    const domainStatsRef = doc(db, 'domainStats', domain);
    const domainStatsDoc = await getDoc(domainStatsRef);

    if (domainStatsDoc.exists()) {
      await updateDoc(domainStatsRef, {
        totalInvestment: increment(Number(amount)),
        numberOfInvestments: increment(1)
      });
    } else {
      await setDoc(domainStatsRef, {
        totalInvestment: Number(amount),
        numberOfInvestments: 1
      });
    }

    return investmentRef.id;
  } catch (error) {
    console.error('Error tracking investment:', error);
    throw error;
  }
};

// Get user's investment statistics
export const getUserStats = async (userId) => {
  try {
    const userStatsRef = doc(db, 'userStats', userId);
    const userStatsDoc = await getDoc(userStatsRef);

    if (!userStatsDoc.exists()) {
      return {
        totalInvested: 0,
        activeInvestments: 0,
        returns: 0,
        portfolioGrowth: 0,
        domains: []
      };
    }

    return userStatsDoc.data();
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
};

// Get user's investments with monthly data
export const getUserInvestmentHistory = async (userId) => {
  try {
    const investmentsRef = collection(db, 'investments');
    const q = query(
      investmentsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const investments = [];
    const monthlyData = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      investments.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp.toDate()
      });

      // Aggregate monthly data
      const month = data.timestamp.toDate().toLocaleString('default', { month: 'short' });
      if (!monthlyData[month]) {
        monthlyData[month] = {
          investments: 0,
          returns: 0
        };
      }
      monthlyData[month].investments += data.amount;
      // Calculate returns (this is a placeholder - you'll need real return data)
      monthlyData[month].returns += data.amount * 0.1;
    });

    return {
      investments,
      monthlyData: Object.entries(monthlyData).map(([month, data]) => ({
        month,
        investments: data.investments,
        returns: data.returns
      }))
    };
  } catch (error) {
    console.error('Error getting investment history:', error);
    throw error;
  }
};

// Get trending domains
export const getTrendingDomains = async () => {
  try {
    const domainStatsRef = collection(db, 'domainStats');
    const querySnapshot = await getDocs(domainStatsRef);
    const domains = [];

    querySnapshot.forEach((doc) => {
      domains.push({
        name: doc.id,
        ...doc.data()
      });
    });

    // Sort by total investment and calculate growth
    return domains
      .sort((a, b) => b.totalInvestment - a.totalInvestment)
      .slice(0, 5)
      .map(domain => ({
        name: domain.name,
        growth: `+${((domain.totalInvestment / 1000000) * 100).toFixed(1)}%`,
        description: `${domain.numberOfInvestments} investments made in this domain`
      }));
  } catch (error) {
    console.error('Error getting trending domains:', error);
    throw error;
  }
};

// Get portfolio distribution
export const getPortfolioDistribution = async (userId) => {
  try {
    const investmentsRef = collection(db, 'investments');
    const q = query(investmentsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const distribution = {};
    let total = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!distribution[data.domain]) {
        distribution[data.domain] = 0;
      }
      distribution[data.domain] += data.amount;
      total += data.amount;
    });

    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value: Math.round((value / total) * 100)
    }));
  } catch (error) {
    console.error('Error getting portfolio distribution:', error);
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

// Add wallet transaction
export const addWalletTransaction = async (userId, amount, type, description) => {
  try {
    // First get current balance
    const currentBalance = await getUserWallet(userId);
    
    // Calculate new balance
    const newBalance = type === 'deposit' 
      ? currentBalance + amount 
      : currentBalance - amount;

    // Update user's wallet balance
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      walletBalance: newBalance
    });

    // Add transaction record
    const transactionRef = doc(collection(db, 'walletTransactions'));
    await setDoc(transactionRef, {
      userId,
      amount,
      type,
      description,
      timestamp: Timestamp.now(),
      balance: newBalance
    });

    return newBalance;
  } catch (error) {
    console.error('Error adding wallet transaction:', error);
    throw error;
  }
};

// Get wallet transactions
export const getWalletTransactions = async (userId) => {
  try {
    const transactionsRef = collection(db, 'walletTransactions');
    const q = query(
      transactionsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));
  } catch (error) {
    console.error('Error getting wallet transactions:', error);
    throw error;
  }
}; 