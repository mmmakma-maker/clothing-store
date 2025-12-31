let products=[
{name:"فستان أنيق", price:20, stock:5, images:["https://cdn.pixabay.com/photo/2017/08/06/22/53/dress-2598937_1280.jpg","https://cdn.pixabay.com/photo/2016/03/27/22/22/dress-1281920_1280.jpg","https://cdn.pixabay.com/photo/2017/08/02/00/03/dress-2574027_1280.jpg"]},
{name:"عباية فاخرة", price:25, stock:3, images:["https://cdn.pixabay.com/photo/2020/09/17/17/01/woman-5581100_1280.jpg","https://cdn.pixabay.com/photo/2021/06/17/20/51/fashion-6340073_1280.jpg","https://cdn.pixabay.com/photo/2016/12/06/18/27/fashion-1886467_1280.jpg"]},
{name:"فستان سهرة", price:30, stock:0, images:["https://cdn.pixabay.com/photo/2016/11/29/11/12/dress-1866570_1280.jpg","https://cdn.pixabay.com/photo/2016/04/06/19/55/dress-1317193_1280.jpg","https://cdn.pixabay.com/photo/2017/12/11/13/19/dress-3017353_1280.jpg"]},
{name:"عباية كلاسيكية", price:22, stock:2, images:["https://cdn.pixabay.com/photo/2018/03/28/13/08/fashion-3266451_1280.jpg","https://cdn.pixabay.com/photo/2018/07/28/15/40/fashion-3563142_1280.jpg","https://cdn.pixabay.com/photo/2016/03/26/23/55/fashion-1284510_1280.jpg"]},
{name:"فستان يومي", price:18, stock:4, images:["https://cdn.pixabay.com/photo/2016/03/27/22/22/dress-1281921_1280.jpg","https://cdn.pixabay.com/photo/2015/12/09/17/09/girl-1081123_1280.jpg","https://cdn.pixabay.com/photo/2016/06/06/17/05/fashion-1430363_1280.jpg"]},
];
let cart=[], total=0, ADMIN_PASS="admin123", currentImages={};
function renderProducts(){
  const container=document.getElementById("products"); container.innerHTML="";
  products.forEach((p,i)=>{currentImages[i]=0;
    const div=document.createElement("div"); div.className="product";
    div.innerHTML=`
      <img src="${p.images[0]}" id="img${i}" onclick="openLightbox(${i})">
      <h3>${p.name}</h3>
      <p>السعر: ${p.price} ر.ع</p>
      <p>الكمية المتوفرة: ${p.stock}</p>
      ${p.stock>0?`<label>المقاس:</label><select id="size${i}"><option>S</option><option>M</option><option>L</option><option>XL</option></select><label>الكمية:</label><input type="number" id="qty${i}" value="1" min="1" max="${p.stock}"><button onclick="addToCartProduct(${i})">أضف للسلة</button>`:`<p style="color:red;font-weight:bold;">⚠️ نفذ المخزون – لا يمكن الشراء</p>`}
    `; container.appendChild(div);});
}
function openLightbox(productIndex){const product=products[productIndex];let current=0;
  const lightbox=document.createElement("div"); lightbox.id="lightbox";
  Object.assign(lightbox.style,{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,flexDirection:"column"});
  const img=document.createElement("img"); img.src=product.images[current]; img.style.maxWidth="90%"; img.style.maxHeight="70%"; img.style.borderRadius="10px"; lightbox.appendChild(img);
  const prevBtn=document.createElement("button"); prevBtn.innerText="⬅️"; prevBtn.style.margin="10px"; prevBtn.onclick=()=>{current=(current-1+product.images.length)%product.images.length;img.src=product.images[current];};
  const nextBtn=document.createElement("button"); nextBtn.innerText="➡️"; nextBtn.style.margin="10px"; nextBtn.onclick=()=>{current=(current+1)%product.images.length;img.src=product.images[current];};
  const closeBtn=document.createElement("button"); closeBtn.innerText="❌ إغلاق"; closeBtn.style.margin="10px"; closeBtn.onclick=()=>document.body.removeChild(lightbox);
  const controls=document.createElement("div"); controls.appendChild(prevBtn); controls.appendChild(nextBtn); controls.appendChild(closeBtn); controls.style.display="flex"; controls.style.justifyContent="center"; lightbox.appendChild(controls);
  document.body.appendChild(lightbox);
}
function addToCartProduct(index){const product=products[index]; const qty=parseInt(document.getElementById("qty"+index).value);
  if(qty>product.stock){alert("الكمية المطلوبة أكبر من المخزون المتوفر!"); return;}
  const size=document.getElementById("size"+index).value; cart.push({name:product.name, price:product.price, size, qty}); total+=product.price*qty; product.stock-=qty;
  renderProducts(); renderCart();
}
function renderCart(){const cartList=document.getElementById("cart"); cartList.innerHTML="";
  cart.forEach((item,index)=>{const li=document.createElement("li");
    li.innerHTML=`${item.name} | مقاس: ${item.size} | الكمية: ${item.qty} | ${item.price*item.qty} ر.ع <button onclick="removeItem(${index})">❌</button>`;
    cartList.appendChild(li);
  });
  document.getElementById("total").innerText=`الإجمالي: ${total} ر.ع`;
}
function removeItem(index){const item=cart[index]; const prodIndex=products.findIndex(p=>p.name===item.name); products[prodIndex].stock+=item.qty; total-=item.price*item.qty; cart.splice(index,1); renderProducts(); renderCart();}
function payNow(){if(cart.length===0){alert("السلة فارغة");return;} const delivery=document.getElementById("delivery").value; document.getElementById("status").innerText=`✅ تم تنفيذ الطلب بنجاح 🚚 التوصيل: ${delivery}`; cart=[]; total=0; renderCart();}
function showAdminLogin(){document.getElementById("adminLogin").style.display="block";}
function loginAdmin(){const pass=document.getElementById("adminPass").value; if(pass===ADMIN_PASS){document.getElementById("adminPanel").style.display="block"; document.getElementById("adminLogin").style.display="none";}else{document.getElementById("adminMsg").innerText="كلمة السر خاطئة!";}}
function addProduct(){const name=document.getElementById("newName").value; const price=parseFloat(document.getElementById("newPrice").value); const stock=parseInt(document.getElementById("newStock").value);
  const img1=document.getElementById("newImg1").value; const img2=document.getElementById("newImg2").value; const img3=document.getElementById("newImg3").value;
  if(!name||!price||!img1){alert("يرجى تعبئة الاسم والسعر ورابط الصورة الأولى");return;}
  products.push({name,price,stock,images:[img1,img2,img3]}); renderProducts();
}
renderProducts();