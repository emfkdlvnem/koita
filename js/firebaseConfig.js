import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

export const firebaseConfig = {
    // apiKey: "AIzaSyCokCMiB2t_sqo7NMZfSY-duv0WzFoIq88",
    // authDomain: "koita-1c079.firebaseapp.com",
    // projectId: "koita-1c079",
    // storageBucket: "koita-1c079.appspot.com",
    // messagingSenderId: "240009170899",
    // appId: "1:240009170899:web:f9544fdb8a50ee45e56926",
    // measurementId: "G-93MHVB0GZP"

    apiKey: "AIzaSyBfXC9gasc0NI7bFx-BYN52ULFMjU9LLho",
    authDomain: "koita-1c079.firebaseapp.com",
    databaseURL: 'https://koita-1c079-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: "koita-1c079",
    storageBucket: "koita-1c079.appspot.com",
    messagingSenderId: "240009170899",
    appId: "1:240009170899:web:a7184866ddf02275e56926",
    measurementId: "G-NHQ6QB7LNY"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
