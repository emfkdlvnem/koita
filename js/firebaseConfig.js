import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { doc, setDoc, arrayUnion, arrayRemove, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// export const firebaseConfig = {
//     apiKey: "AIzaSyBfXC9gasc0NI7bFx-BYN52ULFMjU9LLho",
//     authDomain: "koita-1c079.firebaseapp.com",
//     databaseURL: 'https://koita-1c079-default-rtdb.asia-southeast1.firebasedatabase.app',
//     projectId: "koita-1c079",
//     storageBucket: "koita-1c079.appspot.com",
//     messagingSenderId: "240009170899",
//     appId: "1:240009170899:web:a7184866ddf02275e56926",
//     measurementId: "G-NHQ6QB7LNY"
// };

// export const app = initializeApp(firebaseConfig);
// export const auth = getAuth();
// export const db = getFirestore(app);


// // 장바구니에 아이템 추가
// export async function addToCart(uid, productId) {
//     const userRef = doc(db, 'users', uid);
//     await setDoc(userRef, {
//         cart: arrayUnion(productId)
//     }, { merge: true });
// }

// // 장바구니에서 아이템 제거
// export async function removeFromCart(uid, productId) {
//     const userRef = doc(db, 'users', uid);
//     await setDoc(userRef, {
//         cart: arrayRemove(productId)
//     }, { merge: true });
// }

// // 위시리스트에 아이템 추가
// export async function addToWishlist(uid, productId) {
//     const userRef = doc(db, 'users', uid);
//     await setDoc(userRef, {
//         wishlist: arrayUnion(productId)
//     }, { merge: true });
// }

// // 위시리스트에서 아이템 제거
// export async function removeFromWishlist(uid, productId) {
//     const userRef = doc(db, 'users', uid);
//     await setDoc(userRef, {
//         wishlist: arrayRemove(productId)
//     }, { merge: true });
// }

// // 사용자의 장바구니와 위시리스트를 가져옴
// export async function getUserData(uid) {
//     const userRef = doc(db, 'users', uid);
//     const docSnap = await getDoc(userRef);

//     if (docSnap.exists()) {
//         return docSnap.data();
//     } else {
//         console.log("No such document!");
//     }
// }

