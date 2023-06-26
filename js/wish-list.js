function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    const wishlistContainer = document.getElementById('wishlist-container');

    wishlist.forEach(productId => {
        fetch(`../data/festival.json`)  // 상품 데이터의 URL
            .then(response => response.json())
            .then(products => {
                const product = products.find(p => p.id === parseInt(productId));
                if (product) {
                    const productElement = document.createElement('div');

                    const formattedPrice = product.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });

                    productElement.innerHTML = `
                    <div class="thumb">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="content">
                        <h4>${product.title}</h4>
                        <span>${formattedPrice}</span>
                        <div class="rating"></div> 
                    </div>
                    `;

                    const ratingElement = productElement.querySelector('.rating'); 
                    const rating = product.rating.rate;
                    const count = product.rating.count; 

                    showRating(ratingElement, rating, count);  // 평점 표시

                    wishlistContainer.appendChild(productElement);
                }
            });
    });
}

window.addEventListener('DOMContentLoaded', loadWishlist);
