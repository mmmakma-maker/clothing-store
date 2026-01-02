// ------------------ البيانات ------------------
let products = JSON.parse(localStorage.getItem("products")) || [
  { id: 1, name: "فستان نسائي أنيق", price: 150, image: "images/product1.png", category: "نسائي", deliveryDays: 5, colors: ["أزرق","أصفر"], sizes: ["M","L"], stock: 3 },
  { id: 2, name: "بلوزة نسائية", price: 80, image: "images/product2.png", category: "نسائي", deliveryDays: 3, colors: ["أبيض","زهري"], sizes: ["S","M","L"], stock: 5 },
  { id: 3, name: "تنورة نسائية", price: 120, image: "images/product3.png", category: "نسائي", deliveryDays: 4, colors: ["أسود","أزرق"], sizes: ["M","L"], stock: 4 },
  { id: 4, name: "جاكيت نسائي شتوي", price: 200, image: "images/product4.png", category: "نسائي", deliveryDays: 7, colors: ["أبيض","رمادي"], sizes: ["M","L","XL"], stock: 2 }
];

let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// ------------------ DOM ------------------
const productsDiv = document.getElementById("products");
const productDetailDiv = document.getElementById("productDetail");
const cartButton = document.getElementById("cartButton");
const cartPopup = document.getElementById("cartPopup");
const cartPopupList = document.getElementById("cartPopupList");
const popupTotal = document.getElementById("popupTotal");
const cartCount = document.getElementById("cartCount");
const searchInput = document.getElementById("search");

// ------------------ حفظ البيانات ------------------
function saveData() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("orders", JSON.stringify(orders));
}

// ------------------ تسجيل المستخدم ------------------
function registerUser() {
  const fullName = document.getElementById("fullName").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value.trim();
  const msg = document.getElementById("userMsg");

  if (!fullName || !username || !email || !password) { msg.textContent="الرجاء تعبئة جميع البيانات"; return; }
  if (users.find(u=>u.email===email)) { msg.textContent="الإيميل مستخدم مسبقًا"; return; }

  const newUser = { fullName, username, email, password };
  users.push(newUser);
  saveData();

  msg.style.color="green";
  msg.textContent="تم إنشاء الحساب بنجاح ✅ يمكنك تسجيل الدخول الآن";
}

function loginUser() {
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value.trim();
  const msg = document.getElementById("userMsg");

  const user = users.find(u=>u.email===email && u.password===password);
  if(!user){ msg.textContent="بيانات الدخول غير صحيحة"; return; }

  currentUser = user;
  saveData();
  showUser();
}

function showUser() {
  document.getElementById("userLoginDiv").style.display="none";
  document.getElementById("welcomeUser").style.display="block";
  document.getElementById("usernameDisplay").textContent=currentUser.username;
  renderCartPopup();
  showMyOrders();
}

function logoutUser() {
  currentUser = null;
  saveData();
  location.reload();
}

// ------------------ التاجر ------------------
const adminPasswordValue="1234";
function loginAsAdmin(){ 
  const input=document.getElementById("adminPassword").value; 
  const msg=document.getElementById("loginMsg"); 
  if(input===adminPasswordValue){
    document.getElementById("loginDiv").style.display="none"; 
    document.getElementById("adminDiv").style.display="block"; 
    msg.textContent="";
    renderProducts(products);
    renderOrdersAdmin();
  } else {
    msg.textContent="كلمة المرور غير صحيحة!";
  }
}

// ------------------ عرض المنتجات ------------------
function renderProducts(list){
  productsDiv.innerHTML="";
  productDetailDiv.style.display = "none"; 
  productsDiv.style.display = "flex";

  const isAdmin = document.getElementById("adminDiv").style.display==="block";

  list.forEach(product=>{
    const div=document.createElement("div"); 
    div.className="product";

    let deleteButtonHTML="";
    if(isAdmin){ deleteButtonHTML=`<button onclick="deleteProduct(${product.id})" style="background:red;">حذف المنتج</button>`; }

    div.innerHTML=`
      <img src="${product.image}">
      <h4>${product.name}</h4>
      <p>${product.price} ريال</p>
      <p>المتبقي: ${product.stock}</p>
      <button onclick="showProductDetail(${product.id})" ${product.stock===0?'disabled':''}>${product.stock===0?'نفدت الكمية':'عرض المنتج'}</button>
      ${deleteButtonHTML}
    `;
    productsDiv.appendChild(div);
  });
}

// ------------------ حذف وإضافة المنتجات ------------------
function deleteProduct(id){ 
  const index = products.findIndex(p=>p.id===id); 
  if(index!==-1){ 
    if(confirm("هل أنت متأكد من حذف هذا المنتج؟ ❌")){ 
      products.splice(index,1); 
      saveData();
      renderProducts(products); 
      alert("تم حذف المنتج بنجاح!"); 
    } 
  }
}

function addProduct(){
  const newProduct = { 
    id: Date.now(), 
    name: document.getElementById("newName").value, 
    price: parseFloat(document.getElementById("newPrice").value), 
    image: document.getElementById("newImage").value, 
    category: document.getElementById("newCategory").value, 
    deliveryDays: parseInt(document.getElementById("newDelivery").value), 
    colors: document.getElementById("newColors").value.split(",").map(c=>c.trim()), 
    sizes: document.getElementById("newSizes").value.split(",").map(s=>s.trim()), 
    stock: parseInt(document.getElementById("newStock").value)
  };
  products.push(newProduct);
  saveData();
  renderProducts(products);
  alert("تم إضافة المنتج ✅");
}

// ------------------ تفاصيل المنتج ------------------
function showProductDetail(id){
  const product = products.find(p=>p.id===id);
  if(!product) return;

  productsDiv.style.display="none";
  productDetailDiv.style.display="block";

  productDetailDiv.innerHTML=`
    <img src="${product.image}" onclick="zoomImage('${product.image}')">
    <h2>${product.name}</h2>
    <p>السعر: ${product.price} ريال</p>
    <p>الألوان: ${product.colors.join(", ")}</p>
    <p>الأحجام: ${product.sizes.join(", ")}</p>
    <p>مدة التوصيل: ${product.deliveryDays} أيام</p>
    <p>المتبقي: ${product.stock}</p>
    <input type="number" id="quantityInput" class="quantity-input" min="1" max="${product.stock}" value="1">
    <button onclick="addToCart(${id})" ${product.stock===0?'disabled':''}>${product.stock===0?'نفدت الكمية':'إضافة للسلة'}</button>
    <button onclick="backToProducts()">رجوع للمتجر</button>
  `;
}

function backToProducts(){
  productDetailDiv.style.display="none";
  productsDiv.style.display="flex";
}

// ------------------ السلة ------------------
function addToCart(id){
  if(!currentUser){ alert("الرجاء تسجيل الدخول أولاً"); return; }
  const product = products.find(p=>p.id===id);
  const quantity = parseInt(document.getElementById("quantityInput").value);
  if(quantity > product.stock){ alert("الكمية غير متاحة"); return; }

  const existing = cart.find(c=>c.id===id);
  if(existing){ existing.quantity+=quantity; } 
  else { cart.push({ ...product, quantity }); }

  saveData();
  renderCartPopup();
  alert("تمت الإضافة للسلة ✅");
}

cartButton.addEventListener("click",()=>{ cartPopup.style.display="block"; });

function closeCart(){ cartPopup.style.display="none"; }

function renderCartPopup(){
  cartPopupList.innerHTML="";
  let total=0;
  cart.forEach(item=>{
    total+=item.price*item.quantity;
    const li=document.createElement("li");
    li.innerHTML=`${item.name} (${item.quantity}) - ${item.price*item.quantity} ريال 
      <button onclick="removeFromCart(${item.id})">❌</button>`;
    cartPopupList.appendChild(li);
  });
  popupTotal.textContent = `المجموع: ${total} ريال`;
  cartCount.textContent = cart.reduce((a,b)=>a+b.quantity,0);
}

function removeFromCart(id){
  cart = cart.filter(c=>c.id!==id);
  saveData();
  renderCartPopup();
}

function payNow(){
  if(cart.length===0){ alert("السلة فارغة!"); return; }
  if(!currentUser){ alert("الرجاء تسجيل الدخول"); return; }

  const userOrders = cart.map(item=>({ ...item, user: currentUser.username, orderDate: new Date().toLocaleString() }));
  orders.push(...userOrders);
  cart.forEach(c=>{
    const prod = products.find(p=>p.id===c.id);
    if(prod) prod.stock -= c.quantity;
  });
  cart=[];
  saveData();
  renderCartPopup();
  renderProducts(products);
  showMyOrders();
  renderOrdersAdmin();
  alert("تمت عملية الدفع بنجاح ✅");
}

// ------------------ الفلاتر ------------------
function filterCategory(cat){
  if(cat==="all"){ renderProducts(products); return; }
  renderProducts(products.filter(p=>p.category===cat));
}

function applyFilters(){
  const color = document.getElementById("filterColor").value;
  const size = document.getElementById("filterSize").value;
  const search = searchInput.value.trim().toLowerCase();

  let filtered = products.filter(p=>{
    let match=true;
    if(color!=="all") match = match && p.colors.includes(color);
    if(size!=="all") match = match && p.sizes.includes(size);
    if(search) match = match && p.name.toLowerCase().includes(search);
    return match;
  });
  renderProducts(filtered);
}

searchInput.addEventListener("input", applyFilters);

// ------------------ تكبير الصور ------------------
function zoomImage(src){
  const zoomDiv=document.createElement("div");
  zoomDiv.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;justify-content:center;align-items:center;z-index:2000;";
  zoomDiv.innerHTML=`<img src="${src}" style="max-width:90%;max-height:90%;border-radius:15px;cursor:pointer;">`;
  zoomDiv.addEventListener("click",()=>{ document.body.removeChild(zoomDiv); });
  document.body.appendChild(zoomDiv);
}

// ------------------ الطلبات ------------------
function showMyOrders(){
  if(!currentUser) return;
  const myOrdersDiv=document.getElementById("myOrders");
  myOrdersDiv.innerHTML="<h3>طلباتي:</h3>";
  const myOrders = orders.filter(o=>o.user===currentUser.username);
  if(myOrders.length===0){ myOrdersDiv.innerHTML+="<p>لا توجد طلبات بعد.</p>"; return; }
  myOrders.forEach(order=>{
    myOrdersDiv.innerHTML+=`<p>${order.name} (${order.quantity}) - ${order.price*order.quantity} ريال - ${order.orderDate}</p>`;
  });
}

function renderOrdersAdmin(){
  const ordersAdminDiv = document.getElementById("ordersAdmin");
  if(!ordersAdminDiv) return;
  ordersAdminDiv.innerHTML="";
  if(orders.length===0){ ordersAdminDiv.innerHTML="<p>لا توجد طلبات بعد.</p>"; return; }
  orders.forEach(order=>{
    ordersAdminDiv.innerHTML+=`<p>${order.user} طلب ${order.name} (${order.quantity}) - ${order.price*order.quantity} ريال - ${order.orderDate}</p>`;
  });
}

// ------------------ تهيئة الصفحة ------------------
if(currentUser) showUser();
renderProducts(products);


