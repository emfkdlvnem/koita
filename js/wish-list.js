window.addEventListener('DOMContentLoaded', () => {
    loadWishlist();
});

function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistContainer = document.getElementById('wishlist-container');
    const emptyWishlistElement = document.getElementById('empty-wishlist');

    Promise.all([
        fetch('../data/festival.json').then(response => response.json()),
        fetch('../data/oita.json').then(response => response.json())
    ])
    .then(([festivalProducts, oitaProducts]) => {
        const products = [...festivalProducts, ...oitaProducts];

        wishlist.forEach(productId => {
            const product = products.find(p => p.id === parseInt(productId));
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
    .catch(error => {
        console.error('Error:', error);
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
        </div>
        <div  class="btn-area">
            <button>삭제</button>
        </div>
    `;

    const button = productElement.querySelector('button');
    button.addEventListener('click', () => {
        removeFromWishlist(product.id.toString());
        productElement.remove();
    });

    return productElement;
}


function updateWishlistButton() {
    // 위시리스트 버튼 상태 업데이트
    console.log("Wishlist button updated.");
}

function updateWishlistStatus(productId) {
    // 상세 상품의 위시리스트 상태 업데이트 
    console.log(`Wishlist status of product ${productId} updated.`);
}

function removeFromWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.indexOf(productId);
    
    if (index !== -1) {
        wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));

        updateWishlistButton();
        updateWishlistStatus(productId);

        if (wishlist.length === 0) {
            const emptyWishlistElement = document.getElementById('empty-wishlist');
            const emptyWishlistText = '위시리스트가 비어있습니다.';
            emptyWishlistElement.textContent = emptyWishlistText; // 위시리스트가 비어있을 때 문구를 설정하여 표시
        }
    }
}