import { getDatabase, ref, set, onValue, remove } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

function loadProductDetail(productId) {
    const db = getDatabase();
    const productRef = ref(db, `products/${productId}`);

    onValue(productRef, (snapshot) => {
        const product = snapshot.val();
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

        const db = getDatabase();
        const cartRef = ref(db, `carts/${userId}/${productId}`);

        onValue(cartRef, (snapshot) => {
            const cartItem = snapshot.val();

            if (cartItem) {
                const updatedQuantity = cartItem.quantity + quantity;
                set(ref(db, `carts/${userId}/${productId}`), { ...cartItem, quantity: updatedQuantity })
                    .then(() => {
                        console.log(`${quantity}개 상품이 장바구니에 추가되었습니다.`);
                        window.updateCartCount();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                set(ref(db, `carts/${userId}/${productId}`), { productId, quantity })
                    .then(() => {
                        console.log(`${quantity}개 상품이 장바구니에 추가되었습니다.`);
                        window.updateCartCount();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
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

function setupAddToWishlist() {
    const addToWishlistButton = document.getElementById('add-to-wishlist');
    addToWishlistButton.addEventListener('click', toggleWishlist);
}

function toggleWishlist() {
    const db = getDatabase();
    const wishlistRef = ref(db, `wishlist/${userId}/${productId}`);

    onValue(wishlistRef, (snapshot) => {
        if (snapshot.exists()) {
            remove(ref(db, `wishlist/${userId}/${productId}`))
                .then(() => {
                    showPopup('찜을 취소하였습니다');
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            set(wishlistRef, true)
                .then(() => {
                    showPopup('찜하였습니다', 'wish-list.html');
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    });
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
    const db = getDatabase();
    const wishlistRef = ref(db, `wishlist/${userId}/${productId}`);
    const addToWishlistButton = document.getElementById('add-to-wishlist');

    onValue(wishlistRef, (snapshot) => {
        if (snapshot.exists()) {
            addToWishlistButton.textContent = '찜취소하기';
            addToWishlistButton.classList.add('active');
        } else {
            addToWishlistButton.textContent = '찜하기';
            addToWishlistButton.classList.remove('active');
        }
    });
}

function updateWishlistStatus(productId) {
    const db = getDatabase();
    const wishlistRef = ref(db, `wishlist/${userId}/${productId}`);
    const wishlistButton = document.getElementById('add-to-wishlist');

    onValue(wishlistRef, (snapshot) => {
        if (snapshot.exists()) {
            wishlistButton.textContent = '찜 취소하기';
            wishlistButton.classList.add('wishlisted');
        } else {
            wishlistButton.textContent = '찜하기';
            wishlistButton.classList.remove('wishlisted');
        }
    });

    wishlistButton.addEventListener('click', () => {
        onValue(wishlistRef, (snapshot) => {
            if (snapshot.exists()) {
                remove(ref(db, `wishlist/${userId}/${productId}`))
                    .then(() => {
                        wishlistButton.textContent = '찜하기';
                        wishlistButton.classList.remove('wishlisted');
                        updateWishlistButton();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                set(wishlistRef, true)
                    .then(() => {
                        wishlistButton.textContent = '찜 취소하기';
                        wishlistButton.classList.add('wishlisted');
                        updateWishlistButton();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    loadProductDetail(productId);
    setupAddToCart();
    setupQuantityInput();
    setupAddToWishlist();
    updateWishlistButton();
    updateWishlistStatus(productId);
});
