
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, fetchSignInMethodsForEmail } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { auth, app } from './firebaseConfig.js';

//Initialize firebase
const analytics = getAnalytics(app);

// 가입 성공 시 축하 팝업 뜨게 하기
const signupPopup = document.querySelector('.popup-signup');
signupPopup.style.display = 'none';

// 일반 회원가입
document.getElementById('btn-signup').addEventListener('click', (event) => {
    event.preventDefault()
    const emailSignup = document.getElementById('email-signup').value
    const passwordSignup = document.getElementById('password-signup').value
    
    const passwordValidation = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    
    if (!passwordValidation.test(passwordSignup)) {
        alert("비밀번호는 최소 6자 이상이어야 하며, 숫자와 알파벳을 각각 하나 이상 포함해야 합니다.");
        return;
    }
    createUserWithEmailAndPassword(auth, emailSignup, passwordSignup)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
            signupPopup.style.display = 'block';

            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
            
            console.log(userCredential)
        })
        .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                alert('이미 사용중인 이메일입니다.');
            } else {
                console.log('error', error);
                console.log('Error Code:', error.code);
                console.log('Error Message:', error.message);
            }
        });
});

// Google로 회원가입
document.getElementById('btn-google-signup').addEventListener('click', (event) => {
    event.preventDefault()

    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;

            fetchSignInMethodsForEmail(auth, user.email)
                .then((signInMethods) => {
                    if (signInMethods.length > 0) {
                        alert('이미 가입된 아이디입니다.');
                    } else {
                        signupPopup.style.display = 'block';

                        setTimeout(() => {
                            window.location.href = '../index.html';
                        }, 2000);
                    }
                });
            
            console.log(result)
        }).catch((error) => {
            console.log('error', error);
            console.log('Error Code:', error.code);
            console.log('Error Message:', error.message);
        });
});

console.log('welcome to koita');
console.log(app);
