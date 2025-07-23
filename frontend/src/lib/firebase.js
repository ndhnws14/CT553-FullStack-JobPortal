import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBGU5VRtcYkl1-2IzfQ9SEGsdWrl09Rf_s",
    authDomain: "geekjobs-9caad.firebaseapp.com",
    projectId: "geekjobs-9caad",
    storageBucket: "geekjobs-9caad.appspot.com",
    messagingSenderId: "933128831470",
    appId: "1:933128831470:web:1d14c36850c530e2ddceff",
    measurementId: "G-T2MQ4WBSGM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
    prompt: 'select_account'
});

export { auth, provider, signInWithPopup };