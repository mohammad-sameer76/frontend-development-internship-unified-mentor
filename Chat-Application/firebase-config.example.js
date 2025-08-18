const getFirebaseConfig = () => {
  return {
    apiKey: "YOUR_API_KEY_HERE",                      // Replace with actual API key
    authDomain: "your-project-id.firebaseapp.com",    // Replace with your auth domain
    databaseURL: "https://your-project-id.firebasedatabase.app", // Your database URL
    projectId: "your-project-id",                     // Your Firebase project ID
    storageBucket: "your-project-id.appspot.com",     // Your storage bucket
    messagingSenderId: "123456789012",                // Your sender ID
    appId: "1:123456789012:web:abcdef1234567890",     // Your app ID
    measurementId: "G-ABCDEF1234"                     // Your analytics ID (optional)
  };
};

export { getFirebaseConfig };