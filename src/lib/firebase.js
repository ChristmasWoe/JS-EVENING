// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPcyR5aJl-odugczgI6FqPXrtKzY9AAM0",
  authDomain: "js-evening-1c766.firebaseapp.com",
  projectId: "js-evening-1c766",
  storageBucket: "js-evening-1c766.appspot.com",
  messagingSenderId: "889017525693",
  appId: "1:889017525693:web:92504d3effcdfb1b6bded4",
  measurementId: "G-QN54GCNJX1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {app}