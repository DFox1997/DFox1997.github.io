const products = [
    { name: 'Product 1', price: 10.0, description: 'Description 1' },
    { name: 'Product 2', price: 20.0, description: 'Description 2' }
];

const productContainer = document.getElementById('products');
products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.innerHTML = `<h2>${product.name}</h2><p>${product.description}</p><p>$${product.price}</p>`;
    productContainer.appendChild(productElement);
});
