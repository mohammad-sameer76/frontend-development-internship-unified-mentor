import {
  validateUsername,
  registerUser,
  cleanupUser,
  updateUserChannel,
  setupActiveUsersListener,
  createChannel,
  setupChannelsListener,
  loadMessageHistory,
  setupMessagesListener,
  sendMessageToChannel,
  sendSystemMessage,
  searchChannels,
  get
} from './firebase.js';

// DOM Elements
const loginWrapper = document.querySelector('.login-wrapper');
const chatContainer = document.querySelector('.chat-container');
const loginForm = document.querySelector('.login-wrapper form');
const usernameInput = document.querySelector('.login-wrapper input');
const errorMessage = document.getElementById('errorMessage');
const userAvatar = document.querySelector('.user-avatar');
const userName = document.querySelector('.user-name');
const messageInput = document.querySelector('.message-input');
const sendButton = document.querySelector('.send-button');
const messagesArea = document.querySelector('.messages-area');
const memberCount = document.querySelector('.member-count');
const channelName = document.querySelector('.channel-name');
const roomItemsContainer = document.querySelector('.room-items');
const addButton = document.querySelector('.add-button');
const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.querySelector('.sidebar-toggle');
const searchInput = document.createElement('input');
searchInput.placeholder = 'Search channels...';
searchInput.className = 'channel-search';
document.querySelector('.room-section').prepend(searchInput);

// Channel Creation Modal
const channelModal = document.createElement('div');
channelModal.className = 'channel-modal';
channelModal.innerHTML = `
  <div class="channel-modal-content">
    <h2>Create New Channel</h2>
    <input type="text" class="channel-modal-input" placeholder="Channel name">
    <div class="channel-error"></div>
    <div class="channel-modal-buttons">
      <button class="channel-modal-btn cancel">Cancel</button>
      <button class="channel-modal-btn create">Create</button>
    </div>
  </div>
`;
document.body.appendChild(channelModal);

const modalInput = document.querySelector('.channel-modal-input');
const modalError = document.querySelector('.channel-error');
const modalCancel = document.querySelector('.channel-modal-btn.cancel');
const modalCreate = document.querySelector('.channel-modal-btn.create');

// App State
let currentUser = null;
let currentChannel = 'general';
let channels = {};
let activeUsers = {};
let notificationPermission = false;
let isSearching = false;

// Initialize App
function init() {
  chatContainer.style.display = 'none';
  loginWrapper.style.display = 'flex';

  // Event Listeners
  toggleBtn.addEventListener('click', () => sidebar.classList.toggle('show'));

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    errorMessage.textContent = '';
    if (username) await handleLogin(username);
  });

  sendButton.addEventListener('click', sendMessage);
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  addButton.addEventListener('click', showChannelModal);
  modalCancel.addEventListener('click', closeChannelModal);
  modalCreate.addEventListener('click', createNewChannel);
  modalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') modalCreate.click();
  });

  searchInput.addEventListener('input', async (e) => {
    const searchTerm = e.target.value.trim();
    if (searchTerm) {
      isSearching = true;
      const results = await searchChannels(searchTerm);
      updateChannelList(results, true);
    } else {
      isSearching = false;
      setupChannelsListener(updateChannelList);
    }
  });

  window.addEventListener('beforeunload', async () => {
    if (currentUser) await cleanupUser(currentUser.name);
  });

  // Initialize channels
  setupChannelsListener(updateChannelList);
}

// Login Handler
async function handleLogin(username) {
  try {
    const isAvailable = await validateUsername(username);
    if (!isAvailable) {
      errorMessage.textContent = "Username is already taken. Please choose another.";
      return;
    }

    const registrationSuccess = await registerUser(username);
    if (!registrationSuccess) {
      errorMessage.textContent = "Error registering user. Please try again.";
      return;
    }

    currentUser = {
      name: username,
      initial: username.charAt(0).toUpperCase(),
      joinedAt: new Date()
    };

    // Request notification permission
    notificationPermission = Notification.permission === 'granted';
    if (!notificationPermission) {
      notificationPermission = await Notification.requestPermission() === 'granted';
    }

    // Update UI
    userAvatar.textContent = currentUser.initial;
    userName.textContent = currentUser.name;
    loginWrapper.style.display = 'none';
    chatContainer.style.display = 'flex';

    // Setup listeners
    setupActiveUsersListener(handleActiveUsersUpdate);
    await switchChannel(currentChannel, true);

  } catch (error) {
    console.error("Login error:", error);
    errorMessage.textContent = "An error occurred during login. Please try again.";
  }
}

// Channel Management
function updateChannelList(channelsData, isSearchResults = false) {
  roomItemsContainer.innerHTML = '';

  // Always show default channels
  const defaultChannels = ['general', 'random', 'tech-discussion', 'love'];

  // Filter channels to show
  const channelsToShow = {};

  // Add default channels
  defaultChannels.forEach(name => {
    if (channelsData[name]) {
      channelsToShow[name] = channelsData[name];
    } else {
      channelsToShow[name] = { name: name, isDefault: true };
    }
  });

  // When searching, show all matching channels
  if (isSearchResults) {
    Object.entries(channelsData).forEach(([name, channel]) => {
      if (!channelsToShow[name]) {
        channelsToShow[name] = channel;
      }
    });
  }
  // When not searching, only show default and user-created channels
  else if (currentUser) {
    Object.entries(channelsData).forEach(([name, channel]) => {
      if (!defaultChannels.includes(name) && channel.createdBy === currentUser.name) {
        channelsToShow[name] = channel;
      }
    });
  }

  // Create channel elements
  Object.entries(channelsToShow).forEach(([channelName, channel]) => {
    const channelElement = document.createElement('div');
    channelElement.className = `room-item ${channelName === currentChannel ? 'active' : ''}`;

    channelElement.innerHTML = `
      <span class="room-icon">#</span>
      <span class="room-name">${channelName}</span>
      ${channel.createdBy ? `<span class="channel-creator">Created by ${channel.createdBy}</span>` : ''}
    `;

    channelElement.addEventListener('click', () => {
      switchChannel(channelName);
    });

    roomItemsContainer.appendChild(channelElement);
  });
}

async function createNewChannel() {
  const channelName = modalInput.value.trim();

  if (!channelName) {
    showError("Channel name cannot be empty");
    return;
  }

  if (channelName.length > 20) {
    showError("Channel name too long (max 20 chars)");
    return;
  }

  const cleanName = channelName.toLowerCase().replace(/\s+/g, '-');

  if (channels[cleanName]) {
    showError("Channel already exists");
    return;
  }

  try {
    await createChannel(cleanName, currentUser.name);
    closeChannelModal();
    await switchChannel(cleanName);
  } catch (error) {
    showError("Failed to create channel");
    console.error(error);
  }
}

// User Presence
function handleActiveUsersUpdate(users) {
  activeUsers = users;
  updateMemberCount();
}

function updateMemberCount() {
  if (!currentChannel) return;

  const members = Object.entries(activeUsers)
    .filter(([_, user]) => user.activeChannel === currentChannel)
    .map(([username]) => username);

  memberCount.textContent = `${members.length} member${members.length !== 1 ? 's' : ''}`;
}

// Message Handling
async function switchChannel(channelName, forceLoad = false) {
  if (!forceLoad && currentChannel === channelName) return;

  const previousChannel = currentChannel;
  currentChannel = channelName;

  // Update UI
  document.querySelectorAll('.room-item').forEach(item => {
    const itemChannel = item.querySelector('.room-name').textContent;
    item.classList.toggle('active', itemChannel === channelName);
  });

  document.querySelector('.channel-name').textContent = channelName;
  updateMemberCount();

  // Update message input placeholder
  messageInput.placeholder = `Message #${channelName}`;

  // Clear and load messages
  messagesArea.innerHTML = '';
  const history = await loadMessageHistory(channelName);
  history.forEach(message => addMessageToUI(message));

  // Notify channel changes
  if (currentUser) {
  // Always update the active channel in database
  await updateUserChannel(currentUser.name, channelName);
  
  // Only send notifications if actually switching channels (not on first load/refresh)
  if (previousChannel && previousChannel !== channelName) {
    await sendSystemMessage(previousChannel, `${currentUser.name} left the channel`);
    await sendSystemMessage(channelName, `${currentUser.name} joined the channel`);
  }
}

  // Setup real-time listener
  setupMessagesListener(channelName, (message) => {
    // Skip if already in history
    if (history.some(m => m.timestamp === message.timestamp)) return;

    addMessageToUI(message);

    // Show notification if not in current channel
    if (notificationPermission && currentChannel !== channelName) {
      new Notification(`New message in #${channelName}`, {
        body: `${message.author}: ${message.text}`,
        icon: 'https://your-app-icon.png'
      });
    }
  });

  messagesArea.scrollTop = messagesArea.scrollHeight;
}





async function sendMessage() {
  const messageText = messageInput.value.trim();
  if (!messageText || !currentUser) return;

  const message = {
    author: currentUser.name,
    initial: currentUser.initial,
    text: messageText
  };

  await sendMessageToChannel(currentChannel, message);
  messageInput.value = '';
}

function addMessageToUI(message) {
  const messageElement = document.createElement('div');

  if (message.type === 'system') {
    messageElement.className = 'join-message';
    messageElement.textContent = message.text;
  } else {
    messageElement.className = 'message';
    const timeString = formatTime(new Date(message.timestamp));

    messageElement.innerHTML = `
      <div class="message-avatar">${message.initial}</div>
      <div class="message-content">
        <div class="message-header">
          <span class="message-author">${message.author}</span>
          <span class="message-time">${timeString}</span>
        </div>
        <div class="message-text">${message.text}</div>
      </div>
    `;
  }

  messagesArea.appendChild(messageElement);
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Helper Functions
function showError(message) {
  modalError.textContent = message;
  modalError.style.display = 'block';
}

function closeChannelModal() {
  channelModal.classList.remove('active');
}

function showChannelModal() {
  if (!currentUser) {
    alert("Please login first!");
    return;
  }
  channelModal.classList.add('active');
  modalInput.value = '';
  modalError.style.display = 'none';
  modalInput.focus();
}

function formatTime(date) {
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  let dateString = diffDays === 0 ? 'Today' :
    diffDays === 1 ? 'Yesterday' :
      `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${dateString} at ${hours}:${minutes} ${ampm}`;
}

// Start the app
document.addEventListener('DOMContentLoaded', init);