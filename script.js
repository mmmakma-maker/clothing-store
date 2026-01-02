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
const toastDiv = document.getElementById("toast");

// ------------------ حفظ البيانات ------------------
function saveData() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("orders", JSON.stringify(orders));
}

// ------------------ إشعارات ------------------
function showToast(message) {
  toastDiv.textContent = message;
  toastDiv.style.display = "block";
  setTimeout(()=>{ toastDiv.style.display = "none"; }, 2000);
}

// ------------------ عدّاد السلة ------------------
function updateCartCount() {
  cartCount.textContent = cart.reduce((sum,item)=>sum+item.qty,0);
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

  users.push({ fullName, username, email, password });
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
    if(isAdmin){ deleteButtonHTML=`<button class="delete-btn" onclick="deleteProduct(${product.id})">حذف المنتج</button>`; }

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
      showToast("تم حذف المنتج بنجاح!"); 
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

  if(!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.stock){ 
    showToast("الرجاء ملء جميع الحقول المهمة!"); 
    return;
  }
  products.push(newProduct); 
  saveData();
  renderProducts(products); 
  showToast("تمت إضافة المنتج بنجاح! ✅");
}

// ------------------ البحث والفلاتر ------------------
searchInput.addEventListener("input", applyFilters);

function filterCategory(category){
  if(category==="all"){ renderProducts(products); }
  else{ renderProducts(products.filter(p=>p.category===category)); }
}

function applyFilters(){
  const searchValue = searchInput.value.toLowerCase();
  const color = document.getElementById("filterColor").value;
  const size = document.getElementById("filterSize").value;
  const minPrice = parseFloat(document.getElementById("filterMinPrice").value) || 0;
  const maxPrice = parseFloat(document.getElementById("filterMaxPrice").value) || Infinity;
  const deliveryMax = parseInt(document.getElementById("filterDelivery").value) || Infinity;

  let filtered = products;

  if(color!=="all") filtered = filtered.filter(p=>p.colors.includes(color));
  if(size!=="all") filtered = filtered.filter(p=>p.sizes.includes(size));
  filtered = filtered.filter(p=>p.price>=minPrice && p.price<=maxPrice);
  filtered = filtered.filter(p=>p.deliveryDays<=deliveryMax);
  if(searchValue) filtered = filtered.filter(p=>p.name.toLowerCase().includes(searchValue));

  renderProducts(filtered);
}

// ------------------ عرض تفاصيل المنتج ------------------
function showProductDetail(id){
  const product = products.find(p=>p.id===id);
  if(!product) return;

  productsDiv.style.display="none";
  productDetailDiv.style.display="block";

  let colorsOptions = product.colors.map(c=>`<option value="${c}">${c}</option>`).join("");
  let sizesOptions = product.sizes.map(s=>`<option value="${s}">${s}</option>`).join("");

  productDetailDiv.innerHTML = `
    <h2>${product.name}</h2>
    <img src="${product.image}" alt="${product.name}" style="width:200px; cursor:pointer;" onclick="zoomImage('${product.image}')">
    <p>السعر: ${product.price} ريال</p>
    <p>المتبقي: ${product.stock}</p>
    <p>مدة التوصيل: ${product.deliveryDays} أيام</p>
    <label>اللون: <select id="selectedColor">${colorsOptions}</select></label><br>
    <label>الحجم: <select id="selectedSize">${sizesOptions}</select></label><br>
    <label>الكمية: <input type="number" id="selectedQty" value="1" min="1" max="${product.stock}"></label><br>
    <button id="addToCartBtn">أضف إلى السلة</button>
    <button onclick="backToProducts()">عودة للمنتجات</button>
  `;

  document.getElementById("addToCartBtn").onclick = function(){ addDetailToCart(product.id); };
}

// ------------------ إضافة للسلة + حماية ------------------
function addDetailToCart(id){
  if(!currentUser){ showToast("يرجى تسجيل الدخول أولاً"); return; }

  const product = products.find(p=>p.id===id);
  const color = document.getElementById("selectedColor").value;
  const size = document.getElementById("selectedSize").value;
  const qty = parseInt(document.getElementById("selectedQty").value);

  if(qty < 1 || qty > product.stock) return showToast("كمية غير صحيحة");

  const existing = cart.find(i=>i.id===product.id && i.color===color && i.size===size);
  if(existing){ existing.qty += qty; } 
  else { cart.push({id: product.id, name: product.name, price: product.price, color, size, qty}); }

  product.stock -= qty;

  saveData();
  renderProducts(products);
  showToast("تمت إضافة المنتج للسلة ✅");
  backToProducts();
  updateCartCount();
}

// ------------------ السلة ------------------
cartButton.onclick = ()=>{ renderCartPopup(); cartPopup.style.display="block"; };
function closeCart(){ cartPopup.style.display="none"; }

function renderCartPopup(){
  cartPopupList.innerHTML="";
  let total=0;
  cart.forEach((item,index)=>{
    const li = document.createElement("li");
    li.innerHTML=`${item.name} - ${item.color}/${item.size} x${item.qty} - ${item.price*item.qty} ريال <button onclick="removeFromCart(${index})">حذف</button>`;
    cartPopupList.appendChild(li);
    total += item.price*item.qty;
  });
  popupTotal.textContent=`المجموع: ${total} ريال`;
  updateCartCount();
}

function removeFromCart(index){
  const item = cart[index];
  const product = products.find(p=>p.id===item.id);
  product.stock += item.qty;
  cart.splice(index,1);
  saveData();
  renderCartPopup();
  renderProducts(products);
  showToast("تم حذف المنتج من السلة ❌");
}

// ------------------ الدفع ------------------
function payNow(){
  if(!currentUser){ showToast("سجل دخولك أولاً"); return; }
  if(cart.length===0) return showToast("السلة فارغة!");

  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  orders.push({user:currentUser.email, items:cart, total, status:"قيد التجهيز"});
  cart=[];
  saveData();
  renderCartPopup();
  backToProducts();
  showToast("تمت عملية الدفع بنجاح! ✅");
  showMyOrders();
}

// ------------------ طلباتي ------------------
function showMyOrders(){
  if(!currentUser) return;
  const myOrdersDiv = document.getElementById("myOrders");
  myOrdersDiv.innerHTML="<h3>طلباتي:</h3>";
  orders.filter(o=>o.user===currentUser.email)
        .forEach(o=>{
          myOrdersDiv.innerHTML+=`<p>حالة الطلب: ${o.status} - ${o.items.map(i=>i.name+" x"+i.qty).join(", ")} - 💰 ${o.total} ريال</p>`;
        });
}

// ------------------ إدارة الطلبات للتاجر ------------------
function renderOrdersAdmin(){
  const ordersAdminDiv = document.getElementById("ordersAdmin");
  if(!ordersAdminDiv) return;
  ordersAdminDiv.innerHTML="<h3>إدارة الطلبات</h3>";
  orders.forEach((o, idx)=>{
    ordersAdminDiv.innerHTML+=`<p>${o.user} - 💰 ${o.total} ريال - 📦 ${o.status} <button onclick="updateOrder(${idx})">تم التجهيز</button></p>`;
  });
}

function updateOrder(idx){
  orders[idx].status = "تم التجهيز";
  saveData();
  renderOrdersAdmin();
  showMyOrders();
}

// ------------------ العودة للمنتجات ------------------
function backToProducts(){
  productDetailDiv.style.display="none";
  renderProducts(products);
}

// ------------------ تكبير الصورة ------------------
function zoomImage(src){
  const zoomDiv = document.createElement("div");
  zoomDiv.style.position = "fixed";
  zoomDiv.style.top = "0";
  zoomDiv.style.left = "0";
  zoomDiv.style.width = "100%";
  zoomDiv.style.height = "100%";
  zoomDiv.style.background="rgba(0,0,0,0.8)";
  zoomDiv.style.display="flex";
  zoomDiv.style.alignItems="center";
  zoomDiv.style.justifyContent="center";
  zoomDiv.style.zIndex="9999";
  zoomDiv.innerHTML = `<img src="${src}" style="max-width:90%; max-height:90%;"><button style="position:absolute;top:20px;right:20px;font-size:20px;" onclick="this.parentElement.remove()">✖</button>`;
  document.body.appendChild(zoomDiv);
}

// ------------------ عند فتح الموقع ------------------
if(currentUser) showUser();
renderProducts(products);
updateCartCount();
