import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { auth } from './firebaseConfig.js';

export function updateLoginButton() {
    const loginButton = document.getElementById('header-btn-login');
    const signupButton = document.getElementById('header-btn-signup');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // 로그인한 상태
            loginButton.textContent = '로그아웃';
            signupButton.style.visibility = 'hidden';
            signupButton.style.opacity = '0';
            loginButton.style.visibility = 'visible';
            loginButton.style.opacity = '1';
            loginButton.onclick = function() {
                signOut(auth)
                    .then(() => {
                        console.log('로그아웃 성공');
                        window.location.href = '../index.html'; 
                    })
                    .catch((error) => {
                        console.log('로그아웃 실패', error);
                    });
            };
        } else {
            // 로그아웃 상태
            loginButton.textContent = '로그인';
            signupButton.style.visibility = 'visible';
            signupButton.style.opacity = '1';
            loginButton.style.visibility = 'visible';
            loginButton.style.opacity = '1';
            loginButton.onclick = function() {
                window.location.href = './login.html'; 
            };
        }
    });
}
