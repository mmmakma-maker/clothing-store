// ------------------ المنتجات (مع حفظ دائم) ------------------
let products = JSON.parse(localStorage.getItem("products")) || [
  { id: 1, name: "فستان نسائي أنيق", price: 150, image: "images/product1.png", category: "نسائي", deliveryDays: 5, colors: ["أزرق","أصفر"], sizes: ["M","L"], stock: 3, ratings: [] },
  { id: 2, name: "بلوزة نسائية", price: 80, image: "images/product2.png", category: "نسائي", deliveryDays: 3, colors: ["أبيض","زهري"], sizes: ["S","M","L"], stock: 5, ratings: [] },
  { id: 3, name: "تنورة نسائية", price: 120, image: "images/product3.png", category: "نسائي", deliveryDays: 4, colors: ["أسود","أزرق"], sizes: ["M","L"], stock: 4, ratings: [] },
  { id: 4, name: "جاكيت نسائي شتوي", price: 200, image: "images/product4.png", category: "نسائي", deliveryDays: 7, colors: ["أبيض","رمادي"], sizes: ["M","L","XL"], stock: 2, ratings: [] }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// ------------------ حفظ ------------------
const saveProducts = () => localStorage.setItem("products", JSON.stringify(products));
const saveCart = () => localStorage.setItem("cart", JSON.stringify(cart));
const saveOrders = () => localStorage.setItem("orders", JSON.stringify(orders));

// ------------------ DOM ------------------
const productsDiv = document.getElementById("products");
const productDetailDiv = document.getElementById("productDetail");
const cartPopup = document.getElementById("cartPopup");
const cartPopupList = document.getElementById("cartPopupList");
const popupTotal = document.getElementById("popupTotal");
const cartCount = document.getElementById("cartCount");
const searchInput = document.getElementById("search");

// ------------------ المستخدم ------------------
function registerUser(){
  const fullName = document.getElementById("fullName").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("userEmail").value;
  const password = document.getElementById("userPassword").value;

  if(!fullName || !username || !email || !password) return alert("أكملي البيانات");
  if(users.find(u=>u.email===email)) return alert("الإيميل مستخدم");

  users.push({fullName, username, email, password});
  localStorage.setItem("users", JSON.stringify(users));
  alert("تم إنشاء الحساب");
}

function loginUser(){
  const email = userEmail.value;
  const password = userPassword.value;
  const user = users.find(u=>u.email===email && u.password===password);
  if(!user) return alert("بيانات غير صحيحة");
  currentUser = user;
  localStorage.setItem("currentUser", JSON.stringify(user));
  showUser();
}

function showUser(){
  userLoginDiv.style.display="none";
  welcomeUser.style.display="block";
  usernameDisplay.textContent=currentUser.username;
}

function logoutUser(){
  currentUser=null;
  localStorage.removeItem("currentUser");
  location.reload();
}

// ------------------ التاجر ------------------
function loginAsAdmin(){
  if(adminPassword.value==="1234"){
    loginDiv.style.display="none";
    adminDiv.style.display="block";
    renderProducts(products);
    renderOrdersAdmin();
  } else alert("كلمة المرور خاطئة");
}

// ------------------ عرض المنتجات ------------------
function renderProducts(list){
  productsDiv.innerHTML="";
  productDetailDiv.style.display="none";
  productsDiv.style.display="flex";

  const isAdmin = adminDiv.style.display==="block";

  list.forEach(p=>{
    const avgRating = p.ratings.length
      ? (p.ratings.reduce((a,b)=>a+b)/p.ratings.length).toFixed(1)
      : "لا يوجد";

    productsDiv.innerHTML += `
      <div class="product">
        <img src="${p.image}">
        <h4>${p.name}</h4>
        <p>${p.price} ريال</p>
        <p>⭐ ${avgRating}</p>
        <p>المتبقي: ${p.stock}</p>
        <button onclick="showProductDetail(${p.id})" ${p.stock===0?"disabled":""}>عرض المنتج</button>
        ${isAdmin ? `<button style="background:red" onclick="deleteProduct(${p.id})">حذف</button>` : ""}
      </div>
    `;
  });
}

// ------------------ إضافة / حذف منتجات ------------------
function addProduct(){
  const p = {
    id: Date.now(),
    name: newName.value,
    price:+newPrice.value,
    image:newImage.value,
    category:newCategory.value,
    deliveryDays:+newDelivery.value,
    colors:newColors.value.split(","),
    sizes:newSizes.value.split(","),
    stock:+newStock.value,
    ratings:[]
  };
  products.push(p);
  saveProducts();
  renderProducts(products);
  alert("تمت الإضافة");
}

function deleteProduct(id){
  if(!confirm("هل أنت متأكد؟")) return;
  products = products.filter(p=>p.id!==id);
  saveProducts();
  renderProducts(products);
}

// ------------------ البحث والفلاتر (كما الأصل) ------------------
searchInput.addEventListener("input", applyFilters);

function filterCategory(category){
  if(category==="all") renderProducts(products);
  else renderProducts(products.filter(p=>p.category===category));
}

function applyFilters(){
  const color = filterColor.value;
  const size = filterSize.value;
  const search = searchInput.value.toLowerCase();

  let filtered = products;
  if(color!=="all") filtered = filtered.filter(p=>p.colors.includes(color));
  if(size!=="all") filtered = filtered.filter(p=>p.sizes.includes(size));
  if(search) filtered = filtered.filter(p=>p.name.toLowerCase().includes(search));

  renderProducts(filtered);
}

// ------------------ تفاصيل المنتج ------------------
function showProductDetail(id){
  const p = products.find(x=>x.id===id);
  productsDiv.style.display="none";
  productDetailDiv.style.display="block";

  productDetailDiv.innerHTML = `
    <h2>${p.name}</h2>
    <img src="${p.image}" onclick="zoomImage('${p.image}')" style="cursor:pointer">
    <p>${p.price} ريال</p>
    <p>مدة التوصيل: ${p.deliveryDays} أيام</p>

    <select id="color">${p.colors.map(c=>`<option>${c}</option>`)}</select>
    <select id="size">${p.sizes.map(s=>`<option>${s}</option>`)}</select>
    <input id="qty" type="number" value="1" min="1" max="${p.stock}">

    <label>التقييم:
      <select id="rating">
        <option value="5">⭐⭐⭐⭐⭐</option>
        <option value="4">⭐⭐⭐⭐</option>
        <option value="3">⭐⭐⭐</option>
      </select>
    </label>

    <button onclick="addToCart(${p.id})">أضف للسلة</button>
    <button onclick="backToProducts()">رجوع</button>
  `;
}

function zoomImage(src){
  const d=document.createElement("div");
  d.style=`position:fixed;top:0;left:0;width:100%;height:100%;background:black;display:flex;align-items:center;justify-content:center`;
  d.innerHTML=`<img src="${src}" style="max-width:90%"><button onclick="this.parentElement.remove()">✖</button>`;
  document.body.appendChild(d);
}

// ------------------ السلة ------------------
function addToCart(id){
  const p = products.find(x=>x.id===id);
  const q = +qty.value;
  if(q>p.stock) return alert("الكمية غير متوفرة");

  cart.push({
    id:p.id,name:p.name,price:p.price,
    qty:q,color:color.value,size:size.value
  });

  p.stock -= q;
  p.ratings.push(+rating.value);

  saveProducts();
  saveCart();
  alert("تمت الإضافة");
  backToProducts();
}

function backToProducts(){
  productDetailDiv.style.display="none";
  renderProducts(products);
}

cartButton.onclick = ()=>{ renderCart(); cartPopup.style.display="block"; };
function closeCart(){ cartPopup.style.display="none"; }

function renderCart(){
  cartPopupList.innerHTML="";
  let total=0;
  cart.forEach((i,idx)=>{
    total+=i.price*i.qty;
    cartPopupList.innerHTML+=`
      <li>${i.name} x${i.qty}
      <button onclick="removeFromCart(${idx})">❌</button></li>`;
  });
  popupTotal.textContent=`المجموع: ${total} ريال`;
  cartCount.textContent=cart.length;
}

function removeFromCart(i){
  cart.splice(i,1);
  saveCart();
  renderCart();
}

// ------------------ الطلبات ------------------
function payNow(){
  if(!currentUser) return alert("سجلي دخول أولاً");

  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  orders.push({
    user:currentUser.email,
    items:cart,
    total,
    status:"قيد التجهيز",
    date:new Date().toLocaleString()
  });

  cart=[];
  saveCart();
  saveOrders();
  alert("تم الطلب بنجاح");
  closeCart();
}

// ------------------ التاجر: الطلبات ------------------
function renderOrdersAdmin(){
  const div = document.getElementById("ordersAdmin");
  if(!div) return;
  div.innerHTML="";
  orders.forEach((o,i)=>{
    div.innerHTML+=`
      <p>${o.user} - ${o.total} ريال
      <select onchange="updateOrderStatus(${i},this.value)">
        <option ${o.status==="قيد التجهيز"?"selected":""}>قيد التجهيز</option>
        <option ${o.status==="تم الشحن"?"selected":""}>تم الشحن</option>
      </select></p>`;
  });
}

function updateOrderStatus(i,s){
  orders[i].status=s;
  saveOrders();
}

// ------------------ بدء ------------------
if(currentUser) showUser();
renderProducts(products);

