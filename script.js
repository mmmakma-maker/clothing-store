// ------------------ البيانات ------------------
const products = [
  { id: 1, name: "فستان نسائي أنيق", price: 150, image: "https://via.placeholder.com/150", category: "نسائي", deliveryDays: 5, colors: ["أزرق","أصفر"], sizes: ["M","L"], stock: 3 },
  { id: 2, name: "بلوزة نسائية", price: 80, image: "https://via.placeholder.com/150", category: "نسائي", deliveryDays: 3, colors: ["أبيض","زهري"], sizes: ["S","M","L"], stock: 5 },
  { id: 3, name: "تنورة نسائية", price: 120, image: "https://via.placeholder.com/150", category: "نسائي", deliveryDays: 4, colors: ["أسود","أزرق"], sizes: ["M","L"], stock: 4 },
  { id: 4, name: "جاكيت نسائي شتوي", price: 200, image: "https://via.placeholder.com/150", category: "نسائي", deliveryDays: 7, colors: ["أبيض","رمادي"], sizes: ["M","L","XL"], stock: 2 }
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
function loginUser() { const email = document.getElementById("userEmail").value; const password = document.getElementById("userPassword").value; if(!email||!password){document.getElementById("userMsg").textContent="الرجاء ملء جميع الحقول"; return;} currentUser=email.split("@")[0]; showUser(); }
function loginApple(){ currentUser="AppleUser"; showUser(); }
function showUser(){ document.getElementById("userLoginDiv").style.display="none"; document.getElementById("welcomeUser").style.display="block"; document.getElementById("usernameDisplay").textContent=currentUser; }
function logoutUser(){ currentUser=null; document.getElementById("userLoginDiv").style.display="block"; document.getElementById("welcomeUser").style.display="none"; }

// ------------------ التاجر ------------------
const adminPasswordValue="1234";
function loginAsAdmin(){ const input=document.getElementById("adminPassword").value; const msg=document.getElementById("loginMsg"); if(input===adminPasswordValue){document.getElementById("loginDiv").style.display="none"; document.getElementById("adminDiv").style.display="block"; msg.textContent=""; renderProducts(products);} else{msg.textContent="كلمة المرور غير صحيحة!";} }

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

// ------------------ المنتج التفصيلي ------------------
function showProductDetail(id){
  const product=products.find(p=>p.id===id);
  productDetailDiv.style.display="block"; productsDiv.style.display="none";
  let colorOptions=""; product.colors.forEach(c=>colorOptions+=`<option value="${c}">${c}</option>`);
  let sizeOptions=""; product.sizes.forEach(s=>sizeOptions+=`<option value="${s}">${s}</option>`);
  const suggestedProducts=products.filter(p=>p.category===product.category && p.id!==id);
  let suggestedHTML=""; if(suggestedProducts.length>0){ suggestedHTML=`<h3>منتجات مقترحة</h3><div class="suggested-products">`; suggestedProducts.forEach(p=>{ suggestedHTML+=`<div class="product"><img src="${p.image}"><h4>${p.name}</h4><p>${p.price} ريال</p><button onclick="showProductDetail(${p.id})" ${p.stock===0?'disabled':''}>عرض المنتج</button></div>`}); suggestedHTML+="</div>";}
  productDetailDiv.innerHTML=`<img src="${product.image}"><h2>${product.name}</h2><p>${product.price} ريال</p><p>مدة التوصيل: ${product.deliveryDays} أيام</p><p>الكمية المتبقية: ${product.stock}</p><p>اختر اللون: <select id="colorSelect">${colorOptions}</select></p><p>اختر الحجم: <select id="sizeSelect">${sizeOptions}</select></p><input type="number" id="quantity" class="quantity-input" value="1" min="1" max="${product.stock}"><br><button onclick="addDetailToCart(${id})" ${product.stock===0?'disabled':''}>إضافة للسلة</button><br><br><button onclick="backToProducts()">⬅ العودة للمنتجات</button>${suggestedHTML}`;
}

// ------------------ السلة ------------------
function addDetailToCart(id){
  const quantity=parseInt(document.getElementById("quantity").value);
  const product=products.find(p=>p.id===id);
  const color=document.getElementById("colorSelect").value;
  const size=document.getElementById("sizeSelect").value;
  if(quantity>product.stock){alert(`لا يمكن إضافة أكثر من ${product.stock} قطع متوفرة في المخزن!`); return;}
  for(let i=0;i<quantity;i++){cart.push({...product, selectedColor:color, selectedSize:size});}
  product.stock-=quantity; renderCartPopup(); backToProducts();
}
function backToProducts(){ productDetailDiv.style.display="none"; renderProducts(products);}
function updateCartCount(){ cartCount.textContent=cart.length;}
cartButton.onclick=()=>{ renderCartPopup(); cartPopup.style.display="block";};
function closeCart(){ cartPopup.style.display="none";}
function renderCartPopup(){ cartPopupList.innerHTML=""; let total=0; cart.forEach((item,index)=>{ total+=item.price; const li=document.createElement("li"); li.innerHTML=`${item.name} (${item.selectedColor}/${item.selectedSize}) - ${item.price} ريال <input type="number" value="1" min="1" style="width:40px" onchange="updateQuantity(${index}, this.value)"><button onclick="removeFromCart(${index})">❌</button>`; cartPopupList.appendChild(li);}); popupTotal.textContent=`المجموع: ${total} ريال`; updateCartCount();}
function updateQuantity(index,value){ value=parseInt(value); if(value<1)value=1; const product=cart[index]; cart.splice(index,1); for(let i=0;i<value;i++) cart.splice(index,0,product); renderCartPopup();}
function removeFromCart(index){ cart.splice(index,1); renderCartPopup();}
function payNow(){ if(cart.length===0) return alert("السلة فارغة!"); alert("تمت عملية الدفع التجريبية بنجاح! ✅"); cart=[]; renderCartPopup(); backToProducts();}

// ------------------ البحث والفلاتر ------------------
searchInput.addEventListener("input",()=>{ const value=searchInput.value.toLowerCase(); renderProducts(products.filter(p=>p.name.toLowerCase().includes(value)));});
function filterCategory(category){ if(category==="all") renderProducts(products); else renderProducts(products.filter(p=>p.category===category));}

// ------------------ تهيئة ------------------
renderProducts(products);

