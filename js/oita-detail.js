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

function setupAddToCart() {
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
			const item = { productId: productId, productType: 'oita', quantity: quantity };
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
function setupAddToWishlist() {
    const addToWishlistButton = document.getElementById('add-to-wishlist');
    addToWishlistButton.addEventListener('click', toggleWishlist);
}

function toggleWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (wishlist.includes(productId)) {
        const index = wishlist.indexOf(productId);
        wishlist.splice(index, 1);
        showPopup('찜을 취소하였습니다');
    } else {
        wishlist.push(productId);
        showPopup('찜하였습니다', 'wish-list.html');
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
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
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const addToWishlistButton = document.getElementById('add-to-wishlist');

    if (wishlist.includes(productId)) {
        addToWishlistButton.textContent = '찜취소하기';
        addToWishlistButton.classList.add('active');
    } else {
        addToWishlistButton.textContent = '찜하기';
        addToWishlistButton.classList.remove('active');
    }
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
