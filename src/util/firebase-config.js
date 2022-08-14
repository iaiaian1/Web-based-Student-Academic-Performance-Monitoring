import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//Env them
const firebaseConfig = {
    // apiKey: "AIzaSyASuMNl6KTWEVFsdI2EmC6tgkDd3K-_ucY",
    // authDomain: "capstone-dbb18.firebaseapp.com",
    // projectId: "capstone-dbb18",
    // storageBucket: "capstone-dbb18.appspot.com",
    // messagingSenderId: "424937670724",
    // appId: "1:424937670724:web:1702e1a346bdda24355411"
    apiKey: `${process.env.REACT_APP_API_KEY}`,
    authDomain: `${process.env.REACT_APP_AUTHDOMAIN}`,
    projectId: `${process.env.REACT_APP_PROJECTID}`,
    storageBucket: `${process.env.REACT_APP_STORAGEBUCKET}`,
    messagingSenderId: `${process.env.REACT_APP_SENDERID}`,
    appId: `${process.env.REACT_APP_APPID}`,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)