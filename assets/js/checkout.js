const CART_KEY = "ecommerce_cart";

function trackEvent(eventName, data = {}) {
    console.log("[EVENT]", eventName, data);
}

$(document).ready(function () {
    trackEvent("page_load", { page: "checkout" });

    loadSummary();

    $("#checkoutForm input").on("change", function () {
        trackEvent("checkout_input_change", {
            field: $(this).attr("name"),
            value: $(this).val()
        });
    });

    $("#checkoutForm").on("submit", function (e) {
        e.preventDefault();
        placeOrder();
    });
});

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function loadSummary() {
    let buyNowId = localStorage.getItem("buy_now_item");
    let html = "";
    let total = 0;

    if (buyNowId) {
        trackEvent("buy_now_checkout_load", { productId: buyNowId });

        html += `<p>Buying product ID: ${buyNowId}</p>`;
        total = 99; // fallback demo price
    } else {
        let cart = getCart();

        cart.forEach(item => {
            total += item.price * item.quantity;

            html += `<p>${item.name} x ${item.quantity}</p>`;
        });
    }

    $("#orderSummary").html(html);
    $("#orderSummary").append(`<h5>Total: $${total}</h5>`);
}

function generateOrderId() {
    let date = new Date();
    let ymd = date.toISOString().slice(0,10).replace(/-/g,'');
    let rand = Math.floor(1000 + Math.random()*9000);

    return `ORD-${ymd}-${rand}`;
}

function placeOrder() {
    let total = $("#orderSummary h5").text().replace("Total: $", "");

    trackEvent("place_order_click", { totalAmount: total });

    let orderId = generateOrderId();

    trackEvent("order_success", {
        orderId: orderId,
        totalAmount: total
    });

    localStorage.removeItem("ecommerce_cart");
    localStorage.removeItem("buy_now_item");

    trackEvent("cart_cleared");

    alert("Order placed successfully! Order ID: " + orderId);

    window.location.href = "index.html";
}