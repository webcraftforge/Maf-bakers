

// =====================
// CART STATE
// =====================
let cart = [];

let selectedPrice = 0;
let selectedOption = "";
let qty = 1;

let currentItem = {
  name: "",
  img: "",
  desc: ""
};

// =====================
// ELEMENTS
// =====================
const cartIcon = document.getElementById("cart-icon");
const cartPopup = document.getElementById("cart-popup");
const cartItemsContainer = document.querySelector(".cart-items-container");
const cartCount = document.getElementById("cart-count");
const cartTotalValue = document.getElementById("cart-total-value");
const checkoutWhatsapp = document.getElementById("checkout-whatsapp");
const closeCart = document.getElementById("close-cart");

// =====================
// CART OPEN / CLOSE (CSS ACTIVE CLASS)
// =====================
cartIcon.addEventListener("click", () => {
  cartPopup.classList.add("active");
});

closeCart.addEventListener("click", () => {
  cartPopup.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target === cartPopup) {
    cartPopup.classList.remove("active");
  }
});

// =====================
// FORMAT OPTIONS
// =====================
function format(key) {
  if (key === "box6") return "Box of 6";
  if (key === "box12") return "Box of 12";
  if (key === "half") return "Half Loaf";
  if (key === "full") return "Full Loaf";
  if (key ==="dozen1") return "1 Dozen";
   if (key ==="dozen2") return "2 Dozen";
  return key;
}

// =====================
// OPEN POPUP (UNCHANGED LOGIC)
// =====================
function openPopup(name, img, desc, options) {

  document.getElementById("popup").style.display = "flex";

  currentItem = { name, img, desc };

  document.getElementById("p-name").innerText = name;
  document.getElementById("p-img").src = img;
  document.getElementById("p-desc").innerText = desc;

  qty = 1;
  document.getElementById("qty").innerText = qty;

  const box = document.querySelector(".size-box");
  box.innerHTML = "";

  const keys = Object.keys(options);

  keys.forEach((key, i) => {

    const btn = document.createElement("button");
    btn.className = "size-btn";

    btn.innerText = format(key) + " - Rs " + options[key];

    btn.onclick = () => {

      document.querySelectorAll(".size-btn")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");

      selectedPrice = options[key];
      selectedOption = format(key);

      updatePopupPrice();
    };

    box.appendChild(btn);

    if (i === 0) {
      selectedPrice = options[key];
      selectedOption = format(key);
      btn.classList.add("active");
    }
  });

  updatePopupPrice();
}

// =====================
// QTY CONTROL (POPUP)
// =====================
function changeQty(val) {
  qty += val;
  if (qty < 1) qty = 1;

  document.getElementById("qty").innerText = qty;
  updatePopupPrice();
}

function updatePopupPrice() {
  document.getElementById("p-price").innerText =
    "Total: Rs " + (selectedPrice * qty);
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}


// ham burger close button

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");
const closeMenu = document.getElementById("close-menu");

hamburger.onclick = () => {
  navMenu.classList.add("active"); // open menu
};

closeMenu.onclick = () => {
  navMenu.classList.remove("active"); // close menu
};

// =====================
// ADD TO CART
// =====================
function addToCart() {

  if (!currentItem.name || selectedPrice <= 0) {
    alert("Please select option first!");
    return;
  }

  const existing = cart.find(
    item =>
      item.name === currentItem.name &&
      item.option === selectedOption
  );

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      name: currentItem.name,
      option: selectedOption,
      price: selectedPrice,
      qty: qty,
      img: currentItem.img
    });
  }

  updateCart();
  closePopup();
}

// =====================
// UPDATE CART UI
// =====================
function updateCart() {

  cartItemsContainer.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {

    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <div class="cart-item-left">
        <img src="${item.img}" class="cart-img">
        <div class="cart-info">
          <strong>${item.name}</strong>
          <small>${item.option}</small>
        </div>
      </div>

      <div class="cart-item-right">

        <div class="qty-controls">
          <button class="qty-minus" data-index="${index}">−</button>
          <span>${item.qty}</span>
          <button class="qty-plus" data-index="${index}">+</button>
        </div>

        <div class="price">
          Rs ${itemTotal}
        </div>

        <button class="remove-item" data-index="${index}">×</button>

      </div>
    `;

    cartItemsContainer.appendChild(div);
  });

  cartTotalValue.textContent = total;
  cartCount.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
}

// =====================
// CART ACTIONS (+ - REMOVE)
// =====================
document.addEventListener("click", (e) => {

  const index = e.target.dataset.index;
  if (index === undefined) return;

  if (e.target.classList.contains("qty-plus")) {
    cart[index].qty++;
    updateCart();
  }

  if (e.target.classList.contains("qty-minus")) {
    if (cart[index].qty > 1) {
      cart[index].qty--;
    } else {
      cart.splice(index, 1);
    }
    updateCart();
  }

  if (e.target.classList.contains("remove-item")) {
    cart.splice(index, 1);
    updateCart();
  }
});

// =====================
// WHATSAPP CHECKOUT
// =====================
checkoutWhatsapp.addEventListener("click", () => {

  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const name = document.getElementById("user-name").value.trim();
  const contact = document.getElementById("user-contact").value.trim();
  const address = document.getElementById("user-address").value.trim();

  if (!name || !contact || !address) {
    alert("Please fill all details!");
    return;
  }

  let message = "🧁 *Mafs Bakery Order*\n\n";
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    message += `${item.name} (${item.option}) x${item.qty} = Rs ${itemTotal}\n`;
  });

  message += `\n Total: Rs ${total}`;
  message += `\n\n Name: ${name}`;
  message += `\n Contact: ${contact}`;
  message += `\n Address: ${address}`;

  window.open(
    `https://wa.me/923362373888?text=${encodeURIComponent(message)}`,
    "_blank"
  );
});

// ===== POLICIES COLLAPSE =====
document.addEventListener("DOMContentLoaded", function() {
  const toggleBtn = document.querySelector('.policies-toggle');
  const content = document.querySelector('.policies-content');

  if(toggleBtn && content) {
    toggleBtn.addEventListener('click', () => {
      if(content.style.maxHeight && content.style.maxHeight !== "0px") {
        content.style.maxHeight = "0";
        toggleBtn.textContent = "Policies +";
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        toggleBtn.textContent = "Policies -";
      }
    });
  }
});
