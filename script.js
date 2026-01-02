let products = [
  {name:"قميص رجالي", price:10, img:"https://via.placeholder.com/150"},
  {name:"فستان نسائي", price:15, img:"https://via.placeholder.com/150"},
  {name:"بنطال", price:12, img:"https://via.placeholder.com/150"},
  {name:"جاكيت", price:20, img:"https://via.placeholder.com/150"},
  {name:"حذاء", price:18, img:"https://via.placeholder.com/150"}
];

let cart = [];
let total = 0;

function showProducts(list = products){
  const div = document.getElementById("products");
  div.innerHTML = "";
  list.forEach((p,i)=>{
    div.innerHTML += `
      <div class="product">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>${p.price} ر.ع</p>
        <button onclick="addToCart(${i})">إضافة</button>
      </div>`;
  });
}

function addToCart(i){
  cart.push(products[i]);
  total += products[i].price;
  document.getElementById("total").innerText = total;
  document.getElementById("cart").innerHTML += <p>${products[i].name}</p>;
}

function searchProducts(){
  const q = document.getElementById("search").value;
  showProducts(products.filter(p=>p.name.includes(q)));
}

function toggleAdmin(){
  const p = document.getElementById("adminPanel");
  p.style.display = p.style.display === "none" ? "block" : "none";
}

function login(){
  if(document.getElementById("adminPass").value === "1234"){
    document.getElementById("adminControls").style.display = "block";
  } else {
    alert("كلمة السر خطأ");
  }
}

function addProduct(){
  products.push({
    name: name.value,
    price: Number(price.value),
    img: img.value
  });
  showProducts();
}

showProducts();
