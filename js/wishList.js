// wishList.js
document.addEventListener('DOMContentLoaded', () => {
    const wishListElement = document.getElementById('wish-list');
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
  
    if (wishlistItems.length === 0) {
      wishListElement.innerHTML = '<p>No items in your wish list.</p>';
    } else {
      const productList = document.createElement('ul');
      productList.classList.add('product-list');
  
      wishlistItems.forEach(item => {
        const productItem = document.createElement('li');
        productItem.classList.add('product-item');
  
        const productTitle = document.createElement('h3');
        productTitle.textContent = item.title;
        productItem.appendChild(productTitle);
  
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-button');
        removeButton.addEventListener('click', () => {
          removeFromWishList(item.productId);
        });
        productItem.appendChild(removeButton);
  
        productList.appendChild(productItem);
      });
  
      wishListElement.appendChild(productList);
    }
  });
  
  function removeFromWishList(productId) {
    let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    const existingItemIndex = wishlistItems.findIndex(item => item.productId === productId);
  
    if (existingItemIndex !== -1) {
      wishlistItems.splice(existingItemIndex, 1);
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  
      // Refresh the page to update the wishlist
      location.reload();
    }
  }
  