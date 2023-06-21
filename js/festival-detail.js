const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

function loadProductDetail(productId) {
	fetch('../data/festival.json')
		.then(response => response.json())
		.then(products => {
		const product = products.find(p => p.id === parseInt(productId));
		if (product) {
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
			initWishlistIcon(productId); 
		}
		});
}

function setupAddToCart() {
	// const addToCartButton = document.getElementById('add-to-cart');
	// const selectNum = document.getElementById('select-num');
	const addToCartButton = document.getElementById('add-to-cart');
    const decreaseQuantityButton = document.getElementById('decrease-quantity');
    const increaseQuantityButton = document.getElementById('increase-quantity');
    const quantityInput = document.getElementById('select-num');
    const totalQuantityElement = document.getElementById('total-quantity');

    decreaseQuantityButton.addEventListener('click', () => {
        const currentQuantity = parseInt(quantityInput.value);
        if (currentQuantity > 1) {
            quantityInput.value = currentQuantity - 1;
            updateTotalQuantity();
        }
    });

    increaseQuantityButton.addEventListener('click', () => {
        const currentQuantity = parseInt(quantityInput.value);
        if (currentQuantity < 10) {
            quantityInput.value = currentQuantity + 1;
            updateTotalQuantity();
        }
    });

    quantityInput.addEventListener('input', () => {
        updateTotalQuantity();
    });

	addToCartButton.addEventListener('click', () => {
		const quantity = parseInt(quantityInput.value);
	// 	const quantity = parseInt(selectNum.value);

		let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
		if (cartItems.find(item => item.productId === productId)) {
			cartItems = cartItems.map(item => {
				if (item.productId === productId) {
					item.quantity += quantity;
				}
				return item;
			});
		} else {
			const item = { productId: productId, productType: 'festival', quantity: quantity };
			cartItems.push(item);
		}
		localStorage.setItem('cartItems', JSON.stringify(cartItems));

		console.log(`${quantity}개 상품이 장바구니에 추가되었습니다.`);

		updateCartCount();
	});

	function updateTotalQuantity() {
		const quantity = parseInt(quantityInput.value);
		totalQuantityElement.textContent = `총 수량: ${quantity}`;
	}	
}

function setupAddToWishlist() {
	const wishlistIcon = document.querySelector('.wishlist-icon');

	wishlistIcon.addEventListener('click', () => {
		const productId = wishlistIcon.dataset.productId;
		toggleWishlist(productId);
	});
}

function toggleWishlist(productId) {
	const wishlistIcon = document.querySelector(`.wishlist-icon[data-product-id="${productId}"]`);
	let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
	const existingItemIndex = wishlistItems.findIndex(item => item.productId === productId);

	if (existingItemIndex !== -1) {
		// 이미 위시리스트에 있는 상품인 경우, 상품을 삭제
		wishlistItems.splice(existingItemIndex, 1);
		showWishlistPopup('removed');
	} else {
		// 위시리스트에 없는 상품인 경우, 상품을 추가
		wishlistItems.push({ productId });
		showWishlistPopup('added');
	}

	localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
	initWishlistIcon(productId);
}

function initWishlistIcon(productId) {
	const wishlistIcon = document.querySelector(`.wishlist-icon[data-product-id="${productId}"]`);
	let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
	const existingItem = wishlistItems.find(item => item.productId === productId);
	
	if (wishlistIcon) {
		if (existingItem) {
			wishlistIcon.classList.add('active');
		} else {
			wishlistIcon.classList.remove('active');
		}
	}

	// 추가된 부분: 페이지 로딩 시 wishlist 아이콘의 상태를 유지
	wishlistIcon.addEventListener('click', (event) => {
		event.preventDefault();
	});
}

function showWishlistPopup(action) {
	const popupElement = document.getElementById('popup');
	let message = '';

	if (action === 'added') {
		message = '위시리스트에 상품이 추가되었습니다. <button id="wishlist-link">위시리스트로 이동</button>';
	} else if (action === 'removed') {
		message = '위시리스트에서 상품이 제거되었습니다.';
	}

	popupElement.innerHTML = message;
	popupElement.style.display = 'block';

	// 위시리스트로 이동 버튼 클릭 이벤트 처리
	const wishlistLinkButton = document.getElementById('wishlist-link');
	if (wishlistLinkButton) {
		wishlistLinkButton.addEventListener('click', () => {
		window.location.href = '../pages/wishList.html';
		});
	}

	setTimeout(() => {
		popupElement.style.display = 'none';
	}, 3000);
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

window.addEventListener('DOMContentLoaded', () => {
	const urlParams = new URLSearchParams(window.location.search);
	const productId = urlParams.get('id');

	loadProductDetail(productId);
	setupAddToCart();
	setupAddToWishlist();
	setupQuantityInput();
});
