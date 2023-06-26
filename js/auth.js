import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { auth } from './firebaseConfig.js';

export function updateLoginButton() {
    const loginButton = document.getElementById('header-btn-login');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // 로그인한 상태
            loginButton.textContent = '로그아웃';
            loginButton.onclick = function() {
                signOut(auth)
                    .then(() => {
                        console.log('로그아웃 성공');
                        window.location.href = '../index.html'; // 로그인 페이지로 리다이렉트
                    })
                    .catch((error) => {
                        console.log('로그아웃 실패', error);
                    });
            };
        } else {
            // 로그아웃 상태
            loginButton.textContent = '로그인';
            loginButton.onclick = function() {
                window.location.href = './login.html'; // 로그인 페이지로 리다이렉트
            };
        }
    });
}
