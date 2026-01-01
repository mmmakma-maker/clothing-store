// ====== التخزين ======
let products = JSON.parse(localStorage.getItem("products")) || [
  {
    id: 1,
    name: "فستان أنيق",
    price: 25,
    stock: 5,
    category: "فساتين",
    sizes: ["S", "M", "L"],
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38"
  },
  {
    id: 2,
    name: "عباية سوداء",
    price: 40,
    stock: 0,
    category: "عبايات",
    sizes: ["M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1583391733956-3759d24d8d2b"
  }
];

let cart = [];

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

// ====== عرض المنتجات ======
function renderProducts(filter = "") {
  const container = document.getElementById("products");
  container.innerHTML = "";

  products
    .filter(p => p.name.includes(filter))
    .forEach(product => {
      const div = document.createElement("div");
      div.className = "product";

      div.innerHTML = `
        <img src="${product.image}">
        <h3>${product.name}</h3>
        <div class="price">${product.price} ر.ع</div>
        <div class="sizes">${product.sizes.map(s => `<span>${s}</span>`).join("")}</div>
        ${
          product.stock > 0
            ? `<button onclick="addToCart(${product.id})">أضف للسلة</button>`
            : `<div class="out">نفدت الكمية</div>`
        }
      `;
      container.appendChild(div);
    });
}

// ====== السلة ======
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product || product.stock <= 0) return;

  cart.push(product);
  product.stock--;
  saveProducts();
  renderProducts();
  renderCart();
  alert("تمت الإضافة للسلة ✅");
}

function renderCart() {
  const cartDiv = document.getElementById("cart");
  let total = 0;

  cartDiv.innerHTML = "<h2>🛒 السلة</h2>";

  cart.forEach(item => {
    total += item.price;
    cartDiv.innerHTML += `<div class="cart-item">${item.name} - ${item.price} ر.ع</div>`;
  });

  cartDiv.innerHTML += `<div class="total">الإجمالي: ${total} ر.ع</div>`;
}

// ====== لوحة التاجر ======
document.querySelector(".admin-btn").onclick = () => {
  const pass = prompt("أدخل كلمة السر");
  if (pass !== "admin123") return alert("كلمة سر خطأ");

  const name = prompt("اسم المنتج:");
  const price = prompt("السعر:");
  const stock = prompt("الكمية:");
  const category = prompt("التصنيف:");
  const image = prompt("رابط الصورة:");

  products.push({
    id: Date.now(),
    name,
    price: Number(price),
    stock: Number(stock),
    category,
    sizes: ["S", "M", "L"],
    image
  });

  saveProducts();
  renderProducts();
};

renderProducts();
renderCart();
