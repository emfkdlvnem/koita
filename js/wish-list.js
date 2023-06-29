import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getDatabase, ref, onValue, remove } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';
import { app, auth } from './firebaseConfig.js';

window.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userId = user.uid;
            loadWishlist(userId);
        } else {
        }
    });
});

function loadWishlist(userId) {
    const db = getDatabase();
    const wishlistRef = ref(db, `wishlist/${userId}`);

    onValue(wishlistRef, (snapshot) => {
        const wishlist = snapshot.val() || [];
        const wishlistContainer = document.getElementById('wishlist-container');
        const emptyWishlistElement = document.getElementById('empty-wishlist');

        Promise.all([
            fetch('../data/festival.json').then((response) => response.json()),
            fetch('../data/oita.json').then((response) => response.json())
        ])
        .then(([festivalProducts, oitaProducts]) => {
            const products = [...festivalProducts, ...oitaProducts];

            wishlist.forEach((productId) => {
                const product = products.find((p) => p.id === parseInt(productId));
                if (product) {
                    const productElement = createProductElement(product);
                    wishlistContainer.appendChild(productElement);
                }
            });
            if (wishlist.length === 0) {
                const emptyWishlistText = '위시리스트가 비어있습니다.';
                emptyWishlistElement.textContent = emptyWishlistText;
            } else {
                emptyWishlistElement.textContent = '';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
}

function createProductElement(product) {
    const productElement = document.createElement('div');
    productElement.className = 'product';

    const formattedPrice = product.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });

    productElement.innerHTML = `
        <div class="thumb">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="wishlist-detail">
            <h3>${product.title}</h3>
            <span>${formattedPrice}</span>
            <button>찜 취소하기</button>
        </div>
    `;

    const button = productElement.querySelector('button');
    button.addEventListener('click', () => {
        removeFromWishlist(product.id.toString());
        productElement.remove();
    });

    return productElement;
}

function removeFromWishlist(productId) {
    const db = getDatabase();
    const wishlistRef = ref(db, `wishlist/${userId}/${productId}`);
    remove(wishlistRef)
        .then(() => {
            showPopup('찜을 취소하였습니다');
            updateWishlistButton();
        })
        .catch((error) => {
            console.log(error);
        });
}

function updateWishlistButton() {
    const cartCountElement = document.getElementById('cart-count');
    const db = getDatabase();
    const wishlistRef = ref(db, `wishlist/${userId}`);

    onValue(wishlistRef, (snapshot) => {
        const wishlist = snapshot.val() || [];
        cartCountElement.textContent = wishlist.length.toString();
    });
}

function updateWishlistStatus(productId) {
    const wishlistButton = document.getElementById('add-to-wishlist');
    const db = getDatabase();
    const wishlistRef = ref(db, `wishlist/${userId}`);

    onValue(wishlistRef, (snapshot) => {
        const wishlist = snapshot.val() || [];

        if (wishlist.includes(productId)) {
            wishlistButton.textContent = '찜 취소하기';
            wishlistButton.classList.add('active');
        } else {
            wishlistButton.textContent = '찜하기';
            wishlistButton.classList.remove('active');
        }
    });
}
