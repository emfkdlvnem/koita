function loadProducts(jsonFile) {
    fetch(jsonFile)
        .then(response => response.json())
        .then(products => {
            let productList = document.getElementById('product-list');
            productList.innerHTML = products.map(product => {
                const formattedPrice = product.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
                const rating = product.rating.rate; // 별점
                const count = product.rating.count; // 리뷰 수
                const ratingHtml = generateRatingHtml(rating, count); // 별점 아이콘을 생성하는 함수 호출

                return `
                    <div class="product">
                        <a href="festival-detail.html?id=${product.id}">                        
                            <div class="thumb">
                                <img src="${product.image}" alt="${product.title}">
                            </div>    
                            <div class="content">
                                <h3>${product.title}</h3>
                                <span>${formattedPrice}</span>
                                <p>${product.description}</p>
                                ${ratingHtml} <!-- 별점 아이콘 -->
                            </div>
                        </a>
                    </div>
                `;
            }).join('');
        });
}

window.onload = () => {
    loadProducts('../data/festival.json');
};

// 별점 아이콘을 생성하는 함수
function generateRatingHtml(rating, count) {
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

    const countElement = document.createElement('span');
    countElement.textContent = `(${count} reviews)`;

    const ratingElement = document.createElement('div');
    ratingElement.appendChild(starContainer);
    ratingElement.appendChild(countElement);

    return ratingElement.outerHTML;
}
