import { updateLoginButton } from './auth.js';
import { auth } from './firebaseConfig.js';

const loadHeader = () => {
    const header = document.querySelector('.header');
    const headerURL = '../components/header.html';

    fetch(headerURL)
        .then(response => response.text())
        .then(data => {
            header.innerHTML = data;
            updateCartCount();
            addMenuToggle();
            checkLoginStatus();
            updateLoginButton();
            setupSearchInput();
        });
}

const checkLoginStatus = () => {
    document.querySelector('.my-page .btn-wish-list').addEventListener('click', (event) => {
        const user = auth.currentUser;
        if (!user) {
            event.preventDefault();
            alert('로그인을 해주세요.');
        }
    });
}

const addMenuToggle = () => {
    const btnMenu = document.querySelector('.btn-menu');
    const menu = document.querySelector('.menu');

    btnMenu.addEventListener('click', () => {
        menu.classList.toggle('show');
    });

    document.addEventListener('click', (event) => {
        if (!menu.contains(event.target) && !btnMenu.contains(event.target)) {
            menu.classList.remove('show');
        }
    });
}

const updateCartCount = () => {
    const cartCount = getCartCount();
    const cartCountElement = document.querySelector('#cart-count');
    cartCountElement.textContent = cartCount;
}

const getCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
    const totalQuantity = Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);
    return totalQuantity;
};

// 검색 기능
const setupSearchInput = () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', event => {
        updateSearchSuggestions(event.target.value);
    });
};

function getChosung(word) {
    const cho = [
        'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 
        'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    ];
    
    let chosung = '';
    for (let i = 0; i < word.length; i++) {
        const charCode = word.charCodeAt(i);
        if (charCode < 0xAC00 || charCode > 0xD7A3) {
            chosung += word[i];
            continue;
        }
        const x = charCode - 0xAC00;
        const y = x % (21 * 28);
        const z = y % 28;
        const first = parseInt(x / (21 * 28));
        chosung += cho[first];
    }
    return chosung;
};

const updateSearchSuggestions = (query) => {
    Promise.all([fetch('../data/festival.json'), fetch('../data/oita.json')])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(([festivalProducts, oitaProducts]) => {
        festivalProducts.forEach(product => product.type = 'festival');
        oitaProducts.forEach(product => product.type = 'oita');

        const allProducts = [...festivalProducts, ...oitaProducts];

            if (query) {
                const suggestions = allProducts.filter(product => {
                    const lowerCaseTitle = product.title.toLowerCase();
                    if (/^[ㄱ-ㅎ]+$/.test(query)) {
                        return getChosung(lowerCaseTitle).includes(query);
                    } else {
                        return lowerCaseTitle.includes(query.toLowerCase());
                    }
                }).slice(0, 5);  

                createSearchSuggestions(suggestions, query);
            }
        });
}

const createSearchSuggestions = (suggestions, searchQuery) => {
    const searchSuggestionContainer = document.querySelector('.search-suggestion');
    searchSuggestionContainer.innerHTML = '';
    
    if (searchQuery) {
        for (const suggestion of suggestions) {
            const suggestionElement = document.createElement('div');
            suggestionElement.textContent = suggestion.title;
            suggestionElement.classList.add('suggestion');

            const productId = suggestion.id;

            const detailPageUrl = suggestion.type === 'festival' ? `../pages/festival-detail.html?id=${productId}` : `../pages/oita-detail.html?id=${productId}`;

            suggestionElement.addEventListener('click', () => {
                window.location.href = detailPageUrl;
            });

            searchSuggestionContainer.appendChild(suggestionElement);
        }
    }
};



window.updateCartCount = updateCartCount;

loadHeader();
