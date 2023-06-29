import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { auth, app } from './firebaseConfig.js';

    //Initialize firebase
    const analytics = getAnalytics(app);
    const provider = new GoogleAuthProvider();
    
    let isLoggedIn = false;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            isLoggedIn = true;
        } else {
            isLoggedIn = false;
        }
    });


    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('로그인 성공');
            window.location.href = '../index.html'; 
        } else {
            console.log('로그인 실패');
        }
    });


    // 일반 로그인
    document.querySelector('.login-form').addEventListener('submit', (event) => {
        event.preventDefault();

        const emailLogin = document.getElementById('email-login').value
        const passwordLogin = document.getElementById('password-login').value
    
        signInWithEmailAndPassword(auth, emailLogin, passwordLogin)
            .then((userCredential) => {
                console.log(userCredential)
                // Signed in 
                const user = userCredential.user;
                window.location.href = '../index.html';
                // ...
            })
            .catch((error) => {
                if (error.code === 'auth/user-not-found') {
                    alert('해당 계정을 찾을 수 없습니다. 회원가입 페이지로 이동합니다.');
                    // 회원가입 페이지로 리다이렉트
                    window.location.href = './signup.html';
                } else {
                    alert('비밀번호가 틀립니다. 다시 시도해 주세요.');
                    console.log('로그인 실패', error);
                    console.log('Error Code:', error.code);
                    console.log('Error Message:', error.message);
                }
            });
    });

    // 구글 로그인
    document.getElementById('btn-social-login').addEventListener('click', (event) => {
        event.preventDefault();
        console.log('google login clicked');

        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                console.log(result);
                window.location.href = '../index.html';

                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log(error);
                // ...
            });
    })
    console.log('welcome to koita');
    console.log(app);
