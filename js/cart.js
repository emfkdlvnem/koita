import { getDatabase, ref, onValue, remove } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { auth } from './firebaseConfig.js';

let userId;

onAuthStateChanged(auth, async (user) => {
	if (user) {
		userId = user.uid;
		await displayCartItems();
	} else {
		userId = null;
		displayEmptyCartMessage();
	}
});

const displayCartItems = async () => {
	const cartItemsElement = document.getElementById('cart-items');
	const db = getDatabase();
	const cartRef = ref(db, `carts/${userId}`);

	onValue(cartRef, async (snapshot) => {
		const cartItems = snapshot.val() || {};

		cartItemsElement.innerHTML = '';

		if (Object.keys(cartItems).length === 0) {
			displayEmptyCartMessage();
		} else {
			for (const [productId, item] of Object.entries(cartItems)) {
				const { quantity } = item;
				const product = await getProductById(productId);
				const itemPrice = product.price * quantity;

				const itemElement = document.createElement('div');
				itemElement.classList.add('cart-item');
				itemElement.innerHTML = `
					<div class="thumb">
						<img src="${product.image}" alt="${product.title}">
					</div>
					<div class="item-details">
						<span class="item-title">${product.title}</span>
						<span class="item-quantity">수량: ${quantity}</span>
						<span class="item-total-price">Total: ${getFormattedPrice(itemPrice)}</span>
						<button class="remove-from-cart" data-product-id="${productId}">삭제</button>
					</div>
				`;
				cartItemsElement.appendChild(itemElement);
			}
		}

		attachRemoveFromCartListeners();
	});
};

const getProductById = async (productId) => {
	const jsonFilePath = getProductJsonFilePath(productId);
	const products = await loadProductsFromJson(jsonFilePath);
	const parsedProductId = parseInt(productId);
	const product = products.find((product) => product.id === parsedProductId);

	return product ? product : { image: '', title: '', price: 0 };
};

const getProductJsonFilePath = (productId) => {
	if (productId >= 1 && productId <= 6) {
		return '../data/festival.json';
	} else if (productId >= 7 && productId <= 12) {
		return '../data/oita.json';
	}
};

const loadProductsFromJson = async (jsonFilePath) => {
	try {
		const response = await fetch(jsonFilePath);
		const productsData = await response.json();
		return productsData;
	} catch (error) {
		console.error('Error loading products data:', error);
		return [];
	}
};

const getFormattedPrice = (price) => {
	return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
};

const attachRemoveFromCartListeners = () => {
	document.querySelectorAll('.remove-from-cart').forEach((button) => {
		button.addEventListener('click', (event) => {
			const productId = event.target.dataset.productId;
			removeProductFromCart(productId);
		});
	});
};

const removeProductFromCart = (productId) => {
	const db = getDatabase();
	remove(ref(db, `carts/${userId}/${productId}`));

	window.updateCartCount();
	displayCartItems();
};

const displayEmptyCartMessage = () => {
	const cartItemsElement = document.getElementById('cart-items');
	cartItemsElement.innerHTML = '<p class="txt-none">장바구니가 비어있습니다. <i class="fa-regular fa-file-lines"></i></p>';
};

window.onload = () => {
	displayEmptyCartMessage();
};
