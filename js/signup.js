
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
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
                    // Show an error message if the email is already in use
                    alert('이미 사용중인 이메일입니다.');
                } else {
                    console.log('error', error);
                    console.log('Error Code:', error.code);
                    console.log('Error Message:', error.message);
                }
            });
    });

    console.log('welcome to koita');
    console.log(app);
