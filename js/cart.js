window.onload = () => {
	displayCartItems();
};

const displayCartItems = async () => {
	const cartItemsElement = document.getElementById('cart-items');
	const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

	if (cartItems.length === 0) {
    cartItemsElement.innerHTML = '<p>장바구니가 비어있습니다.<i class="fas fa-shopping-cart"></i></p>';
	} else {
		cartItemsElement.innerHTML = '';

		for (const item of cartItems) {
		const { productId, productType, quantity } = item;
		const product = await getProductById(productId);
		const itemPrice = product.price * quantity;

		const itemElement = document.createElement('div');
		itemElement.classList.add('cart-item');
		itemElement.innerHTML = `
			<img src="${product.image}" alt="${product.title}">
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
};

const getProductById = async (productId) => {
	const jsonFilePath = getProductJsonFilePath(productId);
	const products = await loadProductsFromJson(jsonFilePath);

	const parsedProductId = parseInt(productId);
	const product = products.find((product) => product.id === parsedProductId);

	return product ? product : { image: '', title: '', price: 0 };
};

const getProductJsonFilePath = (productId) => {
	if (productId <= 3) {
		return '../data/festival.json';
	} else {
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
	let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
	cartItems = cartItems.filter((item) => item.productId !== productId);
	localStorage.setItem('cartItems', JSON.stringify(cartItems));

	window.updateCartCount();
	displayCartItems();
};
