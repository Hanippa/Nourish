// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { browserLocalPersistence , setPersistence , Persistence, browserSessionPersistence , inMemoryPersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyCG1wsI-x320RXDKkppkfjyYY7Oi9MjmY4",

  authDomain: "nourish-self.firebaseapp.com",

  databaseURL: "https://nourish-self-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "nourish-self",

  storageBucket: "nourish-self.appspot.com",

  messagingSenderId: "890009830241",

  appId: "1:890009830241:web:02187c694cf193ac62bb20",

  measurementId: "G-X86T2MHNK3"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

// setPersistence(auth, browserLocalPersistence)
//   .then(() => {
//     console.log('Session persistence enabled.');
//   })
//   .catch((error) => {
//     console.log('Error enabling session persistence:', error);
//   });
export {auth};