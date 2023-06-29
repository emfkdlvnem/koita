import { getDatabase, ref, set, onValue, remove } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { auth } from './firebaseConfig.js';

let userId;
let productData;

onAuthStateChanged(auth, (user) => {
	if (user) {
		userId = user.uid;
		loadProductDetail(productId);
		setupAddToCart();
		setupAddToWishlist();
		updateWishlistButton();
	} else {
		userId = null;
	}
});

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

function loadProductDetail(productId) {
	fetch('../data/oita.json')
		.then(response => response.json())
		.then(products => {
		const product = products.find(p => p.id === parseInt(productId));
		if (product) {
			productData = product;

			const productDetailElement = document.getElementById('product-detail');
			const formattedPrice = product.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });

			productDetailElement.innerHTML = `
			<div class="thumb">
				<img src="${product.image}" alt="${product.title}">
			</div>
			<div class="content">
				<h4>${product.title}</h4>
				<span>${formattedPrice}</span>
				<div class="rating"></div> 
			</div>
			`;

			const ratingElement = document.querySelector('.rating'); 
			const rating = product.rating.rate;
			const count = product.rating.count; 

			showRating(ratingElement, rating, count); 
		}
		});
}

function addProductToCart(product) {
	const db = getDatabase();
	const cartRef = ref(db, `carts/${userId}`);
	
	onValue(ref(db, `carts/${userId}/${product.id}`), snapshot => {
		if (snapshot.exists()) {
			const data = snapshot.val();
			set(ref(db, `carts/${userId}/${product.id}`), { ...data, quantity: data.quantity + product.quantity });
		} else {
			set(ref(db, `carts/${userId}/${product.id}`), product);
		}
	}, {
	onlyOnce: true
	});
}

function showRating(ratingElement, rating, count) {
	ratingElement.innerHTML = ''; 

	const starContainer = document.createElement('div');
	starContainer.classList.add('stars');

	for (let i = 1; i <= 5; i++) {
		const star = document.createElement('span');
		star.classList.add('fa', 'fa-star'); 

		if (i <= rating) {
			star.classList.add('checked');
		} else {
			star.classList.add('unchecked'); 
		}

		starContainer.appendChild(star);
	}

	ratingElement.appendChild(starContainer);

	const countElement = document.createElement('span');
	countElement.textContent = `(${count} reviews)`; 
	ratingElement.appendChild(countElement);
}

function setupQuantityInput() {
    const quantityInput = document.getElementById('select-num');
    const totalQuantityElement = document.getElementById('total-quantity');

    const defaultQuantity = parseInt(quantityInput.value);
    totalQuantityElement.textContent = `총 수량: ${defaultQuantity}`;

    quantityInput.addEventListener('input', () => {
        const quantity = parseInt(quantityInput.value);
        totalQuantityElement.textContent = `총 수량: ${quantity}`;
    });
}


//위시리스트 관련 로직 부분
function setupAddToCart() {
    const addToCartButton = document.getElementById('add-to-cart');
    addToCartButton.addEventListener('click', () => {
        const user = auth.currentUser;
        if (!user) {
            alert('로그인을 해주세요.');
            return;
        }
        const quantityInput = document.getElementById('select-num');
        const quantity = parseInt(quantityInput.value);
        const productToAdd = { ...productData, quantity };
        addProductToCart(productToAdd);
    });
}

function toggleWishlist() {
    const user = auth.currentUser;
    if (!user) {
        alert('로그인을 해주세요.');
        return;
    }
    const db = getDatabase();
    const wishlistRef = ref(db, `wishlist/${userId}/${productId}`);

    onValue(wishlistRef, snapshot => {
        if (snapshot.exists()) {
            remove(ref(db, `wishlist/${userId}/${productId}`));
            showPopup('찜을 취소하였습니다');
        } else {
            set(wishlistRef, true);
            showPopup('찜하였습니다', 'wish-list.html');
        }
    }, {
        onlyOnce: true
    });
    updateWishlistButton();
}

let popupTimeoutId = null;

function showPopup(message, link) {
    const popup = document.getElementById('popup');

    let html = message;
    if (link) {
        html += ` <a href="${link}">위시리스트로 이동</a>`;
    }

    popup.innerHTML = html;
    popup.style.display = 'block';

    if (popupTimeoutId !== null) {
        clearTimeout(popupTimeoutId);
    }

    popupTimeoutId = setTimeout(() => {
        popup.style.display = 'none';
    }, 2000);
}

function updateWishlistButton() {
    const user = auth.currentUser;
    if (!user) {
        return;
    }
    const db = getDatabase();
    const wishlistRef = ref(db, `wishlist/${userId}/${productId}`);
    const addToWishlistButton = document.getElementById('add-to-wishlist');

    onValue(wishlistRef, snapshot => {
        if (snapshot.exists()) {
            addToWishlistButton.textContent = '찜취소하기';
            addToWishlistButton.classList.add('active');
        } else {
            addToWishlistButton.textContent = '찜하기';
            addToWishlistButton.classList.remove('active');
        }
    });
}
function setupAddToWishlist() {
    const addToWishlistButton = document.getElementById('add-to-wishlist');
    addToWishlistButton.addEventListener('click', toggleWishlist);
}



window.addEventListener('DOMContentLoaded', () => {
	const urlParams = new URLSearchParams(window.location.search);
	const productId = urlParams.get('id');

	loadProductDetail(productId);
	setupAddToCart();
	setupQuantityInput();

	setupAddToWishlist();
    updateWishlistButton();

});
