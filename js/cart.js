const displayCartItems = async () => {
	const cartItemsElement = document.getElementById('cart-items');
	const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

	cartItemsElement.innerHTML = '';

	if (cartItems.length === 0) {
		cartItemsElement.innerHTML = '<p class="txt-none">장바구니가 비어있습니다. <i class="fas fa-shopping-cart"></i></p>';
		cartItemsElement.style.marginBottom = '400px'

		const summaryElement = document.createElement('div');
		summaryElement.classList.add('cart-summary');
		summaryElement.innerHTML = `
			<div class="summary-details">
				<span class="summary-title">총 합계:</span>
				<span class="summary-value">0</span>
			</div>
			<div class="summary-details">
				<span class="summary-title">결제 예정 금액:</span>
				<span class="summary-value">0</span>
			</div>
			<button type="button" disabled><span>총 0개 구매하기</span></button>
		`;
		cartItemsElement.appendChild(summaryElement);
	} else {
		cartItemsElement.style.marginBottom = '200px';
		const productGroups = groupProductsByType(cartItems);
		let totalQuantity = 0;
		let totalPrice = 0;

		for (const [productType, items] of Object.entries(productGroups)) {
			for (const item of items) {
				const { productId, quantity } = item;
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
						<button class="remove-from-cart" data-product-id="${productId}" data-product-type="${productType}">삭제</button>
					</div>
				`;
				cartItemsElement.appendChild(itemElement);

				totalQuantity += quantity;
				totalPrice += itemPrice;
			}
		}

		const summaryElement = document.createElement('div');
		summaryElement.classList.add('cart-summary');
		summaryElement.innerHTML = `
			<div class="summary-details">
				<span class="summary-title">총 합계:</span>
				<span class="summary-value">${totalQuantity}</span>
			</div>
			<div class="summary-details">
				<span class="summary-title">결제 예정 금액:</span>
				<span class="summary-value">${getFormattedPrice(totalPrice)}</span>
			</div>
			<button type="button"><span>총 ${totalQuantity}개 구매하기</span></button>
		`;
		cartItemsElement.appendChild(summaryElement);
	}

	attachRemoveFromCartListeners();
};
const groupProductsByType = (cartItems) => {
	const productGroups = {};

	for (const item of cartItems) {
		const { productType } = item;
		if (!productGroups[productType]) {
			productGroups[productType] = [];
		}
		productGroups[productType].push(item);
	}

	return productGroups;
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
			const productType = event.target.dataset.productType;
			removeProductFromCart(productId, productType);
		});
	});
};

const removeProductFromCart = (productId, productType) => {
	let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
	cartItems = cartItems.filter((item) => item.productId !== productId || item.productType !== productType);
	localStorage.setItem('cartItems', JSON.stringify(cartItems));

	window.updateCartCount();
	displayCartItems();
};

window.onload = () => {
	displayCartItems();
};


