
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCokCMiB2t_sqo7NMZfSY-duv0WzFoIq88",
    authDomain: "koita-1c079.firebaseapp.com",
    projectId: "koita-1c079",
    storageBucket: "koita-1c079.appspot.com",
    messagingSenderId: "240009170899",
    appId: "1:240009170899:web:f9544fdb8a50ee45e56926",
    measurementId: "G-93MHVB0GZP"
};

document.addEventListener("DOMContentLoaded", () => {

    //Initialize firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth();
    // 일반 회원가입
    document.getElementById('btn-signup').addEventListener('click', (event) => {
        event.preventDefault()
        const emailSignup = document.getElementById('email-signup').value
        const passwordSignup = document.getElementById('password-signup').value
        
        createUserWithEmailAndPassword(auth, emailSignup, passwordSignup)
            .then((userCredential) => {
                console.log(userCredential)
                // Signed in 
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                
                console.log('error', error);
                console.log('Error Code:', error.code);
                console.log('Error Message:', error.message);
            });
    });

    console.log('welcome to koita');
    console.log(app);
})
