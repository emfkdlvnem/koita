window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    
    Promise.all([fetch('../data/festival.json'), fetch('../data/oita.json')])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([festivalProducts, oitaProducts]) => {
            festivalProducts.forEach(product => product.type = 'festival');
            oitaProducts.forEach(product => product.type = 'oita');

            const allProducts = [...festivalProducts, ...oitaProducts];
            
            const searchResults = allProducts.filter(product =>
                product.title.toLowerCase().includes(searchQuery.toLowerCase())
            );

            displaySearchResults(searchResults);
        });
};

function displaySearchResults(products) {
    const productContainer = document.querySelector('.product-container');
    productContainer.innerHTML = ''; 

    if (products.length === 0) {
        productContainer.innerHTML = '<p>검색 결과를 찾을 수 없습니다.</p>';
    } else {
        for (const product of products) {
            const formattedPrice = product.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
            const rating = product.rating.rate; // 별점
            const count = product.rating.count; // 리뷰 수
            const ratingHtml = generateRatingHtml(rating, count);
            const detailPageUrl = product.type === 'festival' ? `../pages/festival-detail.html?id=${product.id}` : `../pages/oita-detail.html?id=${product.id}`;

            productContainer.innerHTML += `
                <div class="product">
                    <a href="${detailPageUrl}">
                        <div class="thumb">
                            <img src="${product.image}" alt="${product.title}">
                        </div>    
                        <div class="content">
                            <h3 class="title">${product.title}</h3>
                            <span class="price">${formattedPrice}</span>
                            <p class="txt">${product.description}</p>
                            ${ratingHtml} <!-- 별점 아이콘 -->
                        </div>
                    </a>
                </div>
            `;
        }
    }
}

function generateRatingHtml(rating) {
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
        starsHtml += i < rating ? '<i class="fa fa-star checked"></i>' : '<i class="fa fa-star"></i>';
    }
    return starsHtml;
}
