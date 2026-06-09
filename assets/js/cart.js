const CART_KEY = "ecommerce_cart";

function trackEvent(eventName, data = {}) {
    console.log("[EVENT]", eventName, data);
}

$(document).ready(function () {
    trackEvent("page_load", { page: "cart" });
    loadCart();
});

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function loadCart() {
    let cart = getCart();

    trackEvent("cart_loaded", { itemsCount: cart.length });

    if (cart.length === 0) {
        $("#cartContainer").html("<h4>Your cart is empty</h4>");
        $("#grandTotal").text("");
        return;
    }

    let html = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        html += `
        <div class="card mb-3 p-3">
            <div class="row">
                <div class="col-md-2"><img src="${item.image}" class="img-fluid"></div>
                <div class="col-md-4">
                    <h5>${item.name}</h5>
                    <p>$${item.price}</p>
                </div>
                <div class="col-md-3">
                    <button onclick="decreaseQty(${item.id})" class="btn btn-sm btn-secondary">-</button>
                    ${item.quantity}
                    <button onclick="increaseQty(${item.id})" class="btn btn-sm btn-secondary">+</button>
                </div>
                <div class="col-md-3 text-end">
                    <button onclick="removeItem(${item.id})" class="btn btn-danger btn-sm">Remove</button>
                </div>
            </div>
        </div>`;
    });

    $("#cartContainer").html(html);
    $("#grandTotal").text("Total: $" + total.toFixed(2));
}

function increaseQty(id) {
    let cart = getCart();
    let item = cart.find(i => i.id === id);

    item.quantity++;

    saveCart(cart);
    loadCart();

    trackEvent("cart_qty_increase", { productId: id });
    trackEvent("cart_update_quantity", { productId: id, quantity: item.quantity });
}

function decreaseQty(id) {
    let cart = getCart();
    let item = cart.find(i => i.id === id);

    if (item.quantity > 1) {
        item.quantity--;

        saveCart(cart);
        loadCart();

        trackEvent("cart_qty_decrease", { productId: id });
        trackEvent("cart_update_quantity", { productId: id, quantity: item.quantity });
    }
}

function removeItem(id) {
    let cart = getCart().filter(i => i.id !== id);

    saveCart(cart);
    loadCart();

    trackEvent("remove_from_cart", { productId: id });
}