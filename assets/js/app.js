const CART_KEY = "ecommerce_cart";

function trackEvent(eventName, data = {}) {
    console.log("[EVENT]", eventName, data);
    console.log(new Date().toISOString());
}

let products = [];
let filteredProducts = [];
let selectedCategory = "all";
let selectedSubcategory = "all";

$(document).ready(function () {
    trackEvent("page_load", { page: "home" });

    loadProducts();
    updateCartCount();
});

function loadProducts() {
    $.getJSON("assets/js/products.json", function (data) {
        products = data;
        filteredProducts = products;
        renderProducts();
    });
}

function renderProducts() {
    let html = "";

    filteredProducts.forEach(p => {
        html += `
        <div class="col-md-3 mb-4">
            <div class="card h-100">
                <img src="${p.image}" class="card-img-top">
                <div class="card-body">
                    <h5>${p.name}</h5>
                    <p>${p.description}</p>
                    <span class="badge bg-secondary">${p.category}</span>
                    <span class="badge bg-info">${p.subcategory}</span>
                    <h6 class="mt-2">$${p.price}</h6>
                    <button class="btn btn-primary btn-sm mt-2" onclick="addToCart(${p.id})">Add to Cart</button>
                    <button class="btn btn-success btn-sm mt-2" onclick="buyNow(${p.id})">Buy Now</button>
                </div>
            </div>
        </div>`;
    });

    $("#productGrid").html(html);
}

function filterProducts() {
    filteredProducts = products.filter(p => {
        return (selectedCategory === "all" || p.category === selectedCategory)
            && (selectedSubcategory === "all" || p.subcategory === selectedSubcategory);
    });
    renderProducts();
}

function selectCategory(cat) {
    selectedCategory = cat;
    trackEvent("category_click", { category: cat });
    filterProducts();
}

function selectSubcategory(sub) {
    selectedSubcategory = sub;
    trackEvent("subcategory_click", { subcategory: sub });
    filterProducts();
}

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(id) {
    let cart = getCart();
    let item = cart.find(i => i.id === id);

    if (item) {
        item.quantity++;
    } else {
        let product = products.find(p => p.id === id);
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    updateCartCount();

    trackEvent("add_to_cart", { productId: id, quantity: 1 });
}

function updateCartCount() {
    let cart = getCart();
    $("#cartCount").text(cart.length);
}

function buyNow(id) {
    localStorage.setItem("buy_now_item", id);
    trackEvent("buy_now_click", { productId: id });
    window.location.href = "checkout.html";
}