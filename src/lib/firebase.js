// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/compat/app';
import { getAuth, createUserWithEmailAndPassword,GoogleAuthProvider,signInWithPopup,sendPasswordResetEmail,signOut,signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc,addDoc,getDocs,getFirestore,query,where } from "firebase/firestore"; 
// import firebase from "firebase";
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
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth,googleProvider);
    const user = res.user;
    const q = await getDocs(query(collection(db,"users"),where("uid", "==", user.uid)))
      
    if (q.docs.length === 0) {
      await addDoc(collection(db,"users"), 
      {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      })
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const signInWithEmailAndPasswordFunc = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth,email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  export const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth,email, password);
      const user = res.user;
      await addDoc(collection(db,"users"),{
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  export const sendPasswordResetEmailFunc = async (email) => {
    try {
      await sendPasswordResetEmail(auth,email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  export const logout = () => {
    signOut(auth);
  };

export {app,auth,db}