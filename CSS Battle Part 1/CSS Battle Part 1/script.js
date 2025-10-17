function updateTotal() {
    var price = parseFloat(document.getElementById("price").textContent);
    var qty = parseInt(document.getElementById("qty").value);
    
    if (isNaN(qty) || qty < 1) qty = 1;

    var totalCost = price * qty;
    document.getElementById("total").textContent = "Total: ₹" + totalCost.toFixed(2);
}

document.getElementById("qty").addEventListener("input", updateTotal);
document.getElementById("qty").addEventListener("change", updateTotal);
document.addEventListener("DOMContentLoaded", updateTotal);

function discount() {
    var oldPrice = document.getElementById("price");
    var disco = document.getElementById("discount");
    var qty = parseInt(document.getElementById("qty").value);
    var butt = document.getElementById("apply-discount");

    if (isNaN(qty) || qty < 1) qty = 1;

    if (!oldPrice.dataset.originalPrice) {
        oldPrice.dataset.originalPrice = oldPrice.textContent;
    }

    var salePrice = parseFloat(oldPrice.dataset.originalPrice);
    var totalPrice = salePrice - (salePrice * disco.value) / 100;

    oldPrice.textContent = totalPrice.toFixed(2);

    var grandTotal = totalPrice * qty;
    document.getElementById("total").textContent = "Total: ₹" + grandTotal.toFixed(2);

    butt.disabled = true;

      if (disco.value >= 50) {
          vid.style.filter="blur(0px)"
        }
        else{
            vid.style.filter="blur(10px)"
        }
}
document.getElementById("apply-discount").addEventListener("click", discount);

var cartButton = document.querySelector(".add-to-cart-button");

cartButton.addEventListener("click", function() {
    var originalText = this.textContent;
    var originalBg = this.style.backgroundColor;

    this.textContent = "Added!";
    this.style.backgroundColor = "gray";

    setTimeout(() => {
        this.textContent = originalText;
        this.style.backgroundColor = originalBg;
    }, 1500);
});