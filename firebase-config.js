// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: "AIzaSyBSh_IzssX8riS5cKLavUr_bmCOiCzA15E",
  authDomain: "clinic-management-system-af32c.firebaseapp.com",
  projectId: "clinic-management-system-af32c",
  storageBucket: "clinic-management-system-af32c.firebasestorage.app",
  messagingSenderId: "1090324901147",
  appId: "1:1090324901147:web:4ca862cf23acfeb2d537be"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
