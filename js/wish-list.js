window.addEventListener('DOMContentLoaded', () => {
    loadWishlist();
});

function loadWishlist() {
    // LocalStorage에서 위시리스트 로드
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistContainer = document.getElementById('wishlist-container');

    // festival.json과 oita.json에서 상품 데이터를 가져옵니다.
    Promise.all([
        fetch('../data/festival.json').then(response => response.json()),
        fetch('../data/oita.json').then(response => response.json())
    ])
    .then(([festivalProducts, oitaProducts]) => {
        // 두 상품 데이터를 병합합니다.
        const products = [...festivalProducts, ...oitaProducts];

        // 위시리스트에 있는 각 상품에 대해
        wishlist.forEach(productId => {
            // 병합된 상품 데이터에서 해당 상품 정보를 찾습니다.
            const product = products.find(p => p.id === parseInt(productId));
            if (product) {
                // 상품 정보를 화면에 표시합니다.
                const productElement = createProductElement(product);
                wishlistContainer.appendChild(productElement);
            }
        });
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
        <h3>${product.title}</h3>
        <img src="${product.image}" alt="${product.title}">
        <span>${formattedPrice}</span>
        <button>찜 취소하기</button>
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
    }
}












