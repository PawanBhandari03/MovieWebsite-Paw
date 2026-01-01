import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBkqaPIkUkZlxVzMbaONYpBsUZvnUCMOyo",
    authDomain: "paw-movies.firebaseapp.com",
    projectId: "paw-movies",
    storageBucket: "paw-movies.firebasestorage.app",
    messagingSenderId: "755962327662",
    appId: "1:755962327662:web:34ee09180cdeaecd72ec7f",
    measurementId: "G-3QPS3PB458"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
