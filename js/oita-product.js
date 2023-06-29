function loadProducts(jsonFile) {
    fetch(jsonFile)
        .then(response => response.json())
        .then(products => {
            applyFilter(products);
            let productList = document.getElementById('product-list');
            productList.innerHTML = products.map(product => {
                const formattedPrice = product.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
                const rating = product.rating.rate; // 별점
                const count = product.rating.count; // 리뷰 수
                const ratingHtml = generateRatingHtml(rating, count); 

                return `
                    <div class="product">
                        <a href="oita-detail.html?id=${product.id}">                        
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
            }).join('');
        });
}
function applyFilter(products) {
    const filter = document.getElementById('filter').value;
    let sortedProducts;

    switch(filter) {
        case 'highest':
            sortedProducts = products.sort((a, b) => b.price - a.price);
            break;
        case 'lowest':
            sortedProducts = products.sort((a, b) => a.price - b.price);
            break;
        case 'top_rated':
            sortedProducts = products.sort((a, b) => b.rating.count - a.rating.count);
            break;
        default:
            sortedProducts = products;
    }

    displayProducts(sortedProducts);
}

function displayProducts(products) {
    let productList = document.getElementById('product-list');
    productList.innerHTML = products.map(product => {
    }).join('');
}

window.onload = () => {
    loadProducts('../data/oita.json');
    document.getElementById('filter').addEventListener('change', () => loadProducts('../data/oita.json'));
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
