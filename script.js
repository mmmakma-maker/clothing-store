// ------------------ البيانات ------------------
let products = [
  { id: 1, name: "فستان نسائي أنيق", price: 150, image: "images/product1.png", category: "نسائي", deliveryDays: 5, colors: ["أزرق","أصفر"], sizes: ["M","L"], stock: 3 },
  { id: 2, name: "بلوزة نسائية", price: 80, image: "images/product2.png", category: "نسائي", deliveryDays: 3, colors: ["أبيض","زهري"], sizes: ["S","M","L"], stock: 5 },
  { id: 3, name: "تنورة نسائية", price: 120, image: "images/product3.png", category: "نسائي", deliveryDays: 4, colors: ["أسود","أزرق"], sizes: ["M","L"], stock: 4 },
  { id: 4, name: "جاكيت نسائي شتوي", price: 200, image: "images/product4.png", category: "نسائي", deliveryDays: 7, colors: ["أبيض","رمادي"], sizes: ["M","L","XL"], stock: 2 }
];

let cart = [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let ratings = JSON.parse(localStorage.getItem("ratings")) || {};

// ------------------ DOM ------------------
const productsDiv = document.getElementById("products");
const productDetailDiv = document.getElementById("productDetail");
const cartButton = document.getElementById("cartButton");
const cartPopup = document.getElementById("cartPopup");
const cartPopupList = document.getElementById("cartPopupList");
const popupTotal = document.getElementById("popupTotal");
const cartCount = document.getElementById("cartCount");
const searchInput = document.getElementById("search");

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
  localStorage.setItem("users", JSON.stringify(users));

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
  localStorage.setItem("currentUser", JSON.stringify(user));
  showUser();
}

function showUser() {
  document.getElementById("userLoginDiv").style.display="none";
  document.getElementById("welcomeUser").style.display="block";
  document.getElementById("usernameDisplay").textContent=currentUser.username;
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  document.getElementById("userLoginDiv").style.display="block";
  document.getElementById("welcomeUser").style.display="none";
}

// ------------------ التاجر ------------------
const adminPasswordValue="1234";
function loginAsAdmin(){ 
  const input=document.getElementById("adminPassword").value; 
  const msg=document.getElementById("loginMsg"); 
  if(input===adminPasswordValue){document.getElementById("loginDiv").style.display="none"; document.getElementById("adminDiv").style.display="block"; msg.textContent=""; renderProducts(products);} 
  else{msg.textContent="كلمة المرور غير صحيحة!";}
}

// ------------------ عرض المنتجات ------------------
function renderProducts(list){
  productsDiv.innerHTML="";
  productDetailDiv.style.display = "none"; // إخفاء التفاصيل
  productsDiv.style.display = "flex";

  const isAdmin = document.getElementById("adminDiv").style.display==="block";

  list.forEach(product=>{
    const div=document.createElement("div"); 
    div.className="product";

    if(product.stock === 0){
      div.style.opacity="0.5";
      div.style.border="2px solid red";
    }

    let deleteButtonHTML="";
    if(isAdmin){ deleteButtonHTML=`<button onclick="deleteProduct(${product.id})" style="background:red;">حذف المنتج</button>`; }

    div.innerHTML=`
      <img src="${product.image}">
      <h4>${product.name}</h4>
      <p>${product.price} ريال</p>
      <p>المتبقي: ${product.stock}</p>
      <p>مدة التوصيل: ${product.deliveryDays} أيام</p>
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
    colors: document.getElementById("newColors").value.split(","), 
    sizes: document.getElementById("newSizes").value.split(","), 
    stock: parseInt(document.getElementById("newStock").value) 
  };

  if(!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.stock){ 
    alert("الرجاء ملء جميع الحقول المهمة!"); 
    return;
  }
  products.unshift(newProduct); 
  renderProducts(products); 
  alert("تمت إضافة المنتج بنجاح! ✅");
}

// ------------------ البحث والفلاتر ------------------
searchInput.addEventListener("input", ()=>{
  applyFilters();
});

function filterCategory(category){
  if(category==="all"){ renderProducts(products); }
  else{ renderProducts(products.filter(p=>p.category===category)); }
}

function applyFilters(){
  const searchValue = searchInput.value.toLowerCase();
  const color = document.getElementById("filterColor").value;
  const size = document.getElementById("filterSize").value;

  let filtered = products;

  if(color!=="all") filtered = filtered.filter(p=>p.colors.includes(color));
  if(size!=="all") filtered = filtered.filter(p=>p.sizes.includes(size));
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
    <hr>
    <h3>تقييم المنتج ⭐</h3>
    <div id="productRating">
      <select id="ratingSelect">
        <option value="1">1 ⭐</option>
        <option value="2">2 ⭐⭐</option>
        <option value="3">3 ⭐⭐⭐</option>
        <option value="4">4 ⭐⭐⭐⭐</option>
        <option value="5">5 ⭐⭐⭐⭐⭐</option>
      </select>
      <input type="text" id="ratingComment" placeholder="اكتب تعليقك...">
      <button onclick="submitRating(${product.id})">أرسل التقييم</button>
    </div>
    <div id="ratingList"></div>
    <hr>
    <h3>منتجات مشابهة</h3>
    <div id="similarProducts" style="display:flex; gap:10px;"></div>
  `;

  document.getElementById("addToCartBtn").onclick = function(){ addDetailToCart(product.id); };
  displayRatings(product.id);
  showSimilarProducts(product);
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

// ------------------ إضافة للسلة ------------------
function addDetailToCart(id){
  const product = products.find(p=>p.id===id);
  const color = document.getElementById("selectedColor").value;
  const size = document.getElementById("selectedSize").value;
  const qty = parseInt(document.getElementById("selectedQty").value);

  if(qty > product.stock) return alert("الكمية المطلوبة أكبر من المتوفر");

  cart.push({id: product.id, name: product.name, price: product.price, color, size, qty});
  product.stock -= qty;

  renderProducts(products);
  alert("تمت إضافة المنتج للسلة ✅");
  backToProducts();
}

function backToProducts(){
  productDetailDiv.style.display="none";
  renderProducts(products);
}

// ------------------ التقييمات ------------------
function submitRating(productId){
  const ratingValue = parseInt(document.getElementById("ratingSelect").value);
  const comment = document.getElementById("ratingComment").value.trim();

  if(!ratings[productId]) ratings[productId] = [];
  ratings[productId].push({rating: ratingValue, comment});
  localStorage.setItem("ratings", JSON.stringify(ratings));

  displayRatings(productId);
  document.getElementById("ratingComment").value = "";
}

function displayRatings(productId){
  const listDiv = document.getElementById("ratingList");
  listDiv.innerHTML = "";
  if(!ratings[productId]) return;

  ratings[productId].forEach(r=>{
    const div = document.createElement("div");
    div.innerHTML = `${"⭐".repeat(r.rating)} - ${r.comment}`;
    listDiv.appendChild(div);
  });
}

// ------------------ المنتجات المشابهة ------------------
function showSimilarProducts(product){
  const similarDiv = document.getElementById("similarProducts");
  similarDiv.innerHTML =
