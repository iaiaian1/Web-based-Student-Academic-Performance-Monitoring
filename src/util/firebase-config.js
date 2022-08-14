import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//Env them
const firebaseConfig = {
    apiKey: `${process.env.REACT_APP_API_KEY}`,
    authDomain: `${process.env.REACT_APP_AUTHDOMAIN}`,
    projectId: `${process.env.REACT_APP_PROJECTID}`,
    storageBucket: `${process.env.REACT_APP_STORAGEBUCKET}`,
    messagingSenderId: `${process.env.REACT_APP_SENDERID}`,
    appId: `${process.env.REACT_APP_APPID}`,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)