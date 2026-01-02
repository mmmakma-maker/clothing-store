const products = [
  {
    name: "فستان سهرة أحمر",
    price: 28,
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38",
    stock: 2
  },
  {
    name: "فستان يومي",
    price: 20,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    stock: 5
  },
  {
    name: "عباية سوداء",
    price: 30,
    image: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6",
    stock: 0
  },
  {
    name: "عباية رمادية",
    price: 32,
    image: "https://images.unsplash.com/photo-1593032465171-8e1e2c2e2f1a",
    stock: 3
  },
  {
    name: "فستان أطفال",
    price: 15,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
    stock: 4
  }
];

const container = document.getElementById("products");
const cartDiv = document.getElementById("cart");
const searchInput = document.getElementById("search");

let cart = [];

function renderProducts() {
  container.innerHTML = "";

  const searchText = searchInput.value.trim();

  products
    .filter(p => p.name.includes(searchText))
    .forEach((p, index) => {
      const div = document.createElement("div");
      div.className = "product";

      div.innerHTML = `
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <div class="price">${p.price} ر.ع</div>
        ${
          p.stock > 0
            ? <button onclick="addToCart(${index})">أضف للسلة</button>
            : <div class="out">نفدت الكمية</div>
        }
      `;

      container.appendChild(div);
    });
}

function addToCart(index) {
  const product = products[index];
  if (product.stock > 0) {
    cart.push(product);
    product.stock--;
    renderCart();
    renderProducts();
  }
}

function renderCart() {
  cartDiv.innerHTML = "";
  cart.forEach(item => {
    const d = document.createElement("div");
    d.textContent = ${item.name} - ${item.price} ر.ع;
    cartDiv.appendChild(d);
  });
}

searchInput.addEventListener("input", renderProducts);

renderProducts();
