// ------------------ البيانات ------------------
const products = [
  { id: 1, name: "فستان نسائي أنيق", price: 150, image: "images/product1.png", category: "نسائي", deliveryDays: 5, colors: ["أزرق","أصفر"], sizes: ["M","L"], stock: 3 },
  { id: 2, name: "بلوزة نسائية", price: 80, image: "images/product2.png", category: "نسائي", deliveryDays: 3, colors: ["أبيض","زهري"], sizes: ["S","M","L"], stock: 5 },
  { id: 3, name: "تنورة نسائية", price: 120, image: "images/product3.png", category: "نسائي", deliveryDays: 4, colors: ["أسود","أزرق"], sizes: ["M","L"], stock: 4 },
  { id: 4, name: "جاكيت نسائي شتوي", price: 200, image: "images/product4.png", category: "نسائي", deliveryDays: 7, colors: ["أبيض","رمادي"], sizes: ["M","L","XL"], stock: 2 }
];

let cart = [];
let currentUser = null;

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
function loginUser() { 
  const email = document.getElementById("userEmail").value; 
  const password = document.getElementById("userPassword").value; 
  if(!email||!password){document.getElementById("userMsg").textContent="الرجاء ملء جميع الحقول"; return;} 
  currentUser=email.split("@")[0]; 
  showUser(); 
}
function loginApple(){ currentUser="AppleUser"; showUser(); }
function showUser(){ document.getElementById("userLoginDiv").style.display="none"; document.getElementById("welcomeUser").style.display="block"; document.getElementById("usernameDisplay").textContent=currentUser; }
function logoutUser(){ currentUser=null; document.getElementById("userLoginDiv").style.display="block"; document.getElementById("welcomeUser").style.display="none"; }

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
  productDetailDiv.style.display="none";
  productsDiv.style.display="flex";
  const isAdmin=document.getElementById("adminDiv").style.display==="block";
  list.forEach(product=>{
    const div=document.createElement("div"); div.className="product";
    let deleteButtonHTML="";
    if(isAdmin){ deleteButtonHTML=`<button onclick="deleteProduct(${product.id})" style="background:red;">حذف المنتج</button>`; }
    div.innerHTML=`<img src="${product.image}"><h4>${product.name}</h4><p>${product.price} ريال</p><p>المتبقي: ${product.stock}</p><button onclick="showProductDetail(${product.id})" ${product.stock===0?'disabled':''}>عرض المنتج</button>${deleteButtonHTML}`;
    productsDiv.appendChild(div);
  });
}

// ------------------ حذف وإضافة ------------------
function deleteProduct(id){ const index=products.findIndex(p=>p.id===id); if(index!==-1){if(confirm("هل أنت متأكد من حذف هذا المنتج؟ ❌")){products.splice(index,1); renderProducts(products); alert("تم حذف المنتج بنجاح!");}}}
function addProduct(){
  const newProduct={ id:Date.now(), name:document.getElementById("newName").value, price:parseFloat(document.getElementById("newPrice").value), image:document.getElementById("newImage").value, category:document.getElementById("newCategory").value, deliveryDays:parseInt(document.getElementById("newDelivery").value), colors:document.getElementById("newColors").value.split(","), sizes:document.getElementById("newSizes").value.split(","), stock:parseInt(document.getElementById("newStock").value) };
  if(!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.stock){alert("الرجاء ملء جميع الحقول المهمة!"); return;}
  products.push(newProduct); renderProducts(products); alert("تمت إضافة المنتج بنجاح! ✅");
}

// ------------------ باقي الكود للسلة والتفاصيل والبحث والفلاتر ------------------
searchInput.addEventListener("input",()=>{ const value=searchInput.value.toLowerCase(); renderProducts(products.filter(p=>p.name.toLowerCase().includes(value)));});
function filterCategory(category){ if(category==="all") renderProducts(products); else renderProducts(products.filter(p=>p.category===category));}
function showProductDetail(id){ /* نفس الكود السابق */ }
function addDetailToCart(id){ /* نفس الكود السابق */ }
function backToProducts(){ productDetailDiv.style.display="none"; renderProducts(products);}
cartButton.onclick=()=>{ renderCartPopup(); cartPopup.style.display="block";};
function closeCart(){ cartPopup.style.display="none";}
function renderCartPopup(){ /* نفس الكود السابق */ }
function updateQuantity(index,value){ /* نفس الكود السابق */ }
function removeFromCart(index){ /* نفس الكود السابق */ }
function payNow(){ if(cart.length===0) return alert("السلة فارغة!"); alert("تمت عملية الدفع التجريبية بنجاح! ✅"); cart=[]; renderCartPopup(); backToProducts();}
renderProducts(products);
