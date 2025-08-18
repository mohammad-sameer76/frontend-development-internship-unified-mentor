import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { 
  getAuth, 
  signInAnonymously 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { 
  getDatabase, 
  ref, 
  set, 
  onDisconnect, 
  onValue, 
  remove, 
  push, 
  onChildAdded, 
  serverTimestamp,
  get,
  query,
  limitToLast
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

import { getFirebaseConfig } from './firebase-config.js';
const firebaseConfig = getFirebaseConfig();


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Track active users and channels
const activeUsersRef = ref(db, 'activeUsers');
const channelsRef = ref(db, 'channels');

// User Management
async function validateUsername(username) {
  const usernameRef = ref(db, `activeUsers/${username}`);
  const snapshot = await get(usernameRef);
  return !snapshot.exists();
}

async function registerUser(username) {
  try {
    const userCredential = await signInAnonymously(auth);
    const userRef = ref(db, `activeUsers/${username}`);
    await set(userRef, {
      userId: userCredential.user.uid,
      timestamp: serverTimestamp(),
      activeChannel: 'general'
    });
    onDisconnect(userRef).remove();
    return true;
  } catch (error) {
    console.error("Error registering user:", error);
    return false;
  }
}

async function updateUserChannel(username, channelName) {
  const userRef = ref(db, `activeUsers/${username}/activeChannel`);
  await set(userRef, channelName);
}

async function cleanupUser(username) {
  try {
    const userRef = ref(db, `activeUsers/${username}`);
    await remove(userRef);
  } catch (error) {
    console.error("Error cleaning up user:", error);
  }
}

// Channel Management
async function createChannel(channelName, creator) {
  const channelRef = ref(db, `channels/${channelName}`);
  await set(channelRef, {
    name: channelName,
    createdAt: serverTimestamp(),
    createdBy: creator,
    members: { [creator]: true }
  });
  return channelRef;
}

function setupChannelsListener(callback) {
  onValue(channelsRef, (snapshot) => {
    callback(snapshot.val() || {});
  });
}

// Message Management
async function loadMessageHistory(channelName, limit = 50) {
  const messagesRef = ref(db, `channels/${channelName}/messages`);
  const snapshot = await get(query(messagesRef, limitToLast(limit)));
  return snapshot.exists() ? Object.values(snapshot.val()) : [];
}

function setupMessagesListener(channelName, callback) {
  const messagesRef = ref(db, `channels/${channelName}/messages`);
  onChildAdded(messagesRef, (snapshot) => {
    callback(snapshot.val());
  });
}

async function sendMessageToChannel(channelName, message) {
  try {
    const messagesRef = ref(db, `channels/${channelName}/messages`);
    await push(messagesRef, {
      ...message,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

async function sendSystemMessage(channelName, text) {
  try {
    const messagesRef = ref(db, `channels/${channelName}/messages`);
    await push(messagesRef, {
      type: 'system',
      text: text,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error sending system message:", error);
  }
}

// User Presence
function setupActiveUsersListener(callback) {
  onValue(activeUsersRef, (snapshot) => {
    callback(snapshot.val() || {});
  });
}

// Search and Membership Functions
async function searchChannels(searchTerm) {
  try {
    const snapshot = await get(channelsRef);
    
    if (!snapshot.exists()) return {};
    
    const results = {};
    snapshot.forEach((childSnapshot) => {
      const channelName = childSnapshot.key;
      const channelData = childSnapshot.val();
      if (channelName.includes(searchTerm.toLowerCase())) {
        results[channelName] = channelData;
      }
    });
    return results;
  } catch (error) {
    console.error("Search error:", error);
    return {};
  }
}

async function joinChannel(username, channelName) {
  const userRef = ref(db, `channels/${channelName}/members/${username}`);
  await set(userRef, true);
}

async function leaveChannel(username, channelName) {
  const userRef = ref(db, `channels/${channelName}/members/${username}`);
  await remove(userRef);
}

function getChannelMembers(channelName) {
  return ref(db, `channels/${channelName}/members`);
}

export {
  // User Functions
  validateUsername,
  registerUser,
  cleanupUser,
  updateUserChannel,
  setupActiveUsersListener,
  
  // Channel Functions
  createChannel,
  setupChannelsListener,
  searchChannels,
  joinChannel,
  leaveChannel,
  getChannelMembers,
  
  // Message Functions
  loadMessageHistory,
  setupMessagesListener,
  sendMessageToChannel,
  sendSystemMessage,
  
  // Database functions
  get
};