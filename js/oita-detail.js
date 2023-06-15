const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

function loadProductDetail(productId) {
	fetch('../data/oita.json')
		.then(response => response.json())
		.then(products => {
		const product = products.find(p => p.id === parseInt(productId));
		if (product) {
			const productDetailElement = document.getElementById('product-detail');

			const formattedPrice = product.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });

			productDetailElement.innerHTML = `
			<img src="${product.image}" alt="${product.title}">
			<h2>${product.title}</h2>
			<p>${formattedPrice}</p>
			<p>${product.description}</p>
			<div class="rating"></div> <!-- 별점을 표시할 요소 -->
			`;

			const ratingElement = document.querySelector('.rating'); // 별점을 표시할 요소 선택
			const rating = product.rating.rate; // 별점
			const count = product.rating.count; // 리뷰 수

			showRating(ratingElement, rating, count); // 별점 표시
			initWishlistIcon(productId); // 위시리스트 아이콘 초기화
		}
		});
}

function setupAddToCart() {
	const addToCartButton = document.getElementById('add-to-cart');
	const selectNum = document.getElementById('select-num');

	addToCartButton.addEventListener('click', () => {
		const quantity = parseInt(selectNum.value);

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
		// 이미 위시리스트에 있는 상품인 경우, 상품을 삭제합니다.
		wishlistItems.splice(existingItemIndex, 1);
		showWishlistPopup('removed');
	} else {
		// 위시리스트에 없는 상품인 경우, 상품을 추가합니다.
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

	// 추가된 부분: 페이지 로딩 시 wishlist 아이콘의 상태를 유지합니다.
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

window.addEventListener('DOMContentLoaded', () => {
	const urlParams = new URLSearchParams(window.location.search);
	const productId = urlParams.get('id');

	loadProductDetail(productId);
	setupAddToCart();
	setupAddToWishlist();
});

// showRating 함수를 festival-detail.js에 포함시킵니다.
function showRating(ratingElement, rating, count) {
  	ratingElement.innerHTML = ''; // 별점을 초기화합니다.

	const starContainer = document.createElement('div');
	starContainer.classList.add('stars');

	// rating에 따라 별 모양을 생성하여 starContainer에 추가합니다.
	for (let i = 1; i <= 5; i++) {
		const star = document.createElement('span');
		star.classList.add('fa', 'fa-star'); // 별 아이콘을 사용하는 경우를 가정하여 Font Awesome 클래스를 추가합니다.

		if (i <= rating) {
		star.classList.add('checked'); // rating 이하의 별에 checked 클래스를 추가하여 색상을 채웁니다.
		} else {
		star.classList.add('unchecked'); // rating 초과의 별에 unchecked 클래스를 추가하여 색상을 비웁니다.
		}

		starContainer.appendChild(star);
	}

	ratingElement.appendChild(starContainer);

	const countElement = document.createElement('span');
	countElement.textContent = `(${count} reviews)`; // 리뷰 수를 표시합니다.
	ratingElement.appendChild(countElement);
}
