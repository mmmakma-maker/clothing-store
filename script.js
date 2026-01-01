let products = [
{
id: 1,
name: "فستان سهرة",
price: 25,
image: "https://images.unsplash.com/photo-1520975916090-3105956dac38",
sizes: ["S","M","L"],
stock: 2,
category: "فساتين"
},
{
id: 2,
name: "عباية سوداء",
price: 30,
image: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6",
sizes: ["M","L","XL"],
stock: 0,
category: "عبايات"
}
];

let cart = [];

function renderProducts() {
const search = searchInput.value;
const cat = category.value;
products.filter(p =>
p.name.includes(search) &&
(cat === "" || p.category === cat)
).forEach(drawProduct);
}

function drawProduct(p) {
const box = document.createElement("div");
box.className = "product";
box.innerHTML = `
<img src="${p.image}">
<h3>${p.name}</h3>
<p>${p.price} ر.ع</p>
<div class="sizes">${p.sizes.map(s=>`<span>${s}</span>`).join("")}</div>
${p.stock>0
? `<button onclick="addToCart(${p.id})">أضف للسلة</button>`
: `<div class="out">نفدت الكمية</div>`}
`;
productsDiv.appendChild(box);
}

function addToCart(id){
const p = products.find(x=>x.id===id);
if(p.stock>0){
cart.push(p);
p.stock--;
update();
}
}

function renderCart(){
cartDiv.innerHTML="";
cart.forEach(i=>{
cartDiv.innerHTML += `<div>${i.name} - ${i.price} ر.ع</div>`;
});
}

function checkout(){
alert("تم الطلب 🚚\nالتوصيل: " + delivery.value);
cart=[];
update();
}

function toggleAdmin(){
admin.style.display =
admin.style.display==="none" ? "block" : "none";
}

function addProduct(){
products.push({
id: Date.now(),
name: pname.value,
price: +pprice.value,
image: pimg.value,
sizes:["S","M","L"],
stock:+pstock.value,
category: pcat.value
});
update();
}

function update(){
productsDiv.innerHTML="";
renderProducts();
renderCart();
}

const productsDiv = document.getElementById("products");
const cartDiv = document.getElementById("cart");
const searchInput = document.getElementById("search");
const category = document.getElementById("category");
const delivery = document.getElementById("delivery");
const admin = document.getElementById("admin");

searchInput.oninput = update;
category.onchange = update;

update();
