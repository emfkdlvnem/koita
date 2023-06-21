const loadHeader = () => {
    const header = document.querySelector('.header');
    const headerURL = '../components/header.html';

    fetch(headerURL)
        .then(response => response.text())
        .then(data => {
            header.innerHTML = data;
            updateCartCount();
            addMenuToggle();
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


window.updateCartCount = updateCartCount;

loadHeader();
