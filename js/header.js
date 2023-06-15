document.addEventListener('DOMContentLoaded', function() {
    const setupMenu = () => {
        const btnMenu = document.querySelector('.btn-menu');
        const menu = document.querySelector('.menu');
    
        if (btnMenu && menu) {
            btnMenu.addEventListener('click', function() {
                menu.classList.toggle('show');
            });
    
            document.addEventListener('click', function(event) {
                if (!event.target.closest('.header-main-bar .nav')) {
                    menu.classList.remove('show');
                }
            });
        }
    };
});

const loadHeader = () => {
    const header = document.querySelector('.header');
    const headerURL = '../components/header.html';

    fetch(headerURL)
        .then(response => response.text())
        .then(data => {
            header.innerHTML = data;
            updateCartCount();
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


window.updateCartCount = updateCartCount;

loadHeader();
