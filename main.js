import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getDatabase, ref, get, set, push } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyAep6KK-ZCpAx8C9ckXIkmuzugXohe9jfs",
  authDomain: "bank-project-for-summer.firebaseapp.com",
  databaseURL: "https://bank-project-for-summer-default-rtdb.firebaseio.com",
  projectId: "bank-project-for-summer",
  storageBucket: "bank-project-for-summer.appspot.com",
  messagingSenderId: "1079399174128",
  appId: "1:1079399174128:web:42f67a309e9193268d5735"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const errorParagraph = document.getElementById("errorParagraph");
const loginButton = document.getElementById("loginButton");
const showPasswordCheckbox = document.getElementById("showPassword");
const loginForm = document.getElementById("LoginForm");
const dataSection = document.getElementById("dataSection");

onAuthStateChanged(auth, user => {
  if (user) {
    loginForm.style.display = "none";
    dataSection.style.display = "block";
    offersDropDown.style.display = "flex";
    loadUserData(user);
  } else {
    loginForm.style.display = "block";
    dataSection.style.display = "none";
    offersDropDown.style.display = "none";
  }
});

let selectedOffer = localStorage.getItem('selectedOffer') || "usernameOffers";

function loadUserData(user) {
  const adminUid = user.uid;
  get(ref(db, `admins/${adminUid}`)).then(adminSnapshot => {
    if (adminSnapshot.exists()) {
      const data = adminSnapshot.val();
      const offersDropDown = document.getElementById('selectedOffer');
      data.allowedOffers.forEach(offer => {
        const option = document.createElement('option');
        option.value = offer.trim();
        option.textContent = offer.trim();
        if (offer.trim() === selectedOffer) {
          option.selected = true;
        }
        offersDropDown.appendChild(option);
      });
      loadOfferData(selectedOffer);

      offersDropDown.addEventListener('change', function() {
        selectedOffer = this.value;
        localStorage.setItem('selectedOffer', this.value);
        loadOfferData(selectedOffer);
      });
    }
  });
}

function loadOfferData(selectedOffer) {
  const header = document.getElementById("header");
  const addOfferDiv = document.getElementById("addOfferDiv");
  get(ref(db, `shop/${selectedOffer}`)).then(allowedOffersSnapshot => {
    if (allowedOffersSnapshot.exists()) {
      dataSection.innerHTML = "";
      addOfferDiv.innerHTML = "";
      
      const addOfferBtn = document.createElement('i');
      
      addOfferBtn.className = "fa-sharp fa-solid fa-plus";
      addOfferBtn.id = 'addOfferBtn';
      
      addOfferDiv.appendChild(addOfferBtn);
      header.appendChild(addOfferDiv);
      
      addOfferBtn.addEventListener('click', () => {
        const dialog = document.createElement('div');
        dialog.innerHTML = `<div class="dialog">
          <label for="title">العنوان:</label>
          <input type="text" id="title" placeholder="العنوان" maxlength="12">
          <label for="">الوصف:</label>
          <input type="text" id="description" placeholder="الوصف" maxlength="50">
          <label for="price">السعر:</label>
          <input type="number" id="price" placeholder="السعر">
          <label for="cover">رابط الصورة:</label>
          <input type="text" id="cover" placeholder="رابط الصورة">
          <p id="errorElm"></p>
          <div class="buttons-div">
            <button id="confirmBtn">تأكيد</button>
            <button id="cancelBtn">إلغاء</button>
          </div>
        </div>`;
        document.body.appendChild(dialog);
        document.body.classList.add('modal-open');
        
        const confirmBtn = document.getElementById('confirmBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        confirmBtn.addEventListener('click', () => {
          const titleInput = document.getElementById('title');
          const descriptionInput = document.getElementById('description');
          const priceInput = document.getElementById('price');
          const coverSrcInput = document.getElementById('cover');
          const errorElm = document.getElementById('errorElm');
          
          const title = titleInput.value.trim();
          const description = descriptionInput.value.trim();
          const price = priceInput.value.trim();
          const cover = coverSrcInput.value.trim();
          if (title === "" || description === "" || price === "" || cover === "") {
            errorElm.textContent = "إملأ كل الحقول المطلوبة";
          } else {
            const newOfferRef = ref(db, `shop/${selectedOffer}/${title}`);
            set(newOfferRef, {
              title: title,
              description: description,
              price: price,
              cover: cover
            }).then(() => {
              alert('تم إضافة العرض بنجاح!');
              dialog.remove();
              location.reload();
            }).catch(error => {
              alert('حصل خطأ أثناء إضافة العرض: ' + error.message);
            });
          }
        });
        
        cancelBtn.addEventListener('click', () => {
          dialog.remove();
          document.body.classList.remove('modal-open');
        });
      });
      const offersData = allowedOffersSnapshot.val();
      const sortedOfferIds = Object.keys(offersData).sort((a, b) => {
        const valueA = offersData[a].toString();
        const valueB = offersData[b].toString();
        return valueA.localeCompare(valueB, 'ar');
      });
      sortedOfferIds.forEach(offerId => {
        const offerData = offersData[offerId];
        createofferCard(offerId, offerData);
      });
    } else {
        addOfferDiv.innerHTML = "";
      
      const addOfferBtn = document.createElement('i');
      
      addOfferBtn.className = "fa-sharp fa-solid fa-plus";
      addOfferBtn.id = 'addOfferBtn';
      
      addOfferDiv.appendChild(addOfferBtn);
      header.appendChild(addOfferDiv);
      
      addOfferBtn.addEventListener('click', () => {
        const dialog = document.createElement('div');
        dialog.innerHTML = `<div class="dialog">
          <label for="title">العنوان:</label>
          <input type="text" id="title" placeholder="العنوان" maxlength="12">
          <label for="">الوصف:</label>
          <input type="text" id="description" placeholder="الوصف" maxlength="50">
          <label for="price">السعر:</label>
          <input type="number" id="price" placeholder="السعر">
          <label for="cover">رابط الصورة:</label>
          <input type="text" id="cover" placeholder="رابط الصورة">
          <p id="errorElm"></p>
          <div class="buttons-div">
            <button id="confirmBtn">تأكيد</button>
            <button id="cancelBtn">إلغاء</button>
          </div>
        </div>`;
        document.body.appendChild(dialog);
        document.body.classList.add('modal-open');
        
        const confirmBtn = document.getElementById('confirmBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        confirmBtn.addEventListener('click', () => {
          const titleInput = document.getElementById('title');
          const descriptionInput = document.getElementById('description');
          const priceInput = document.getElementById('price');
          const coverSrcInput = document.getElementById('cover');
          const errorElm = document.getElementById('errorElm');
          
          const title = titleInput.value.trim();
          const description = descriptionInput.value.trim();
          const price = priceInput.value.trim();
          const cover = coverSrcInput.value.trim();
          if (title === "" || description === "" || price === "" || cover === "") {
            errorElm.textContent = "إملأ كل الحقول المطلوبة";
          } else {
            const newOfferRef = ref(db, `shop/${selectedOffer}/${title}`);
            set(newOfferRef, {
              title: title,
              description: description,
              price: price,
              cover: cover
            }).then(() => {
              alert('تم إضافة العرض بنجاح!');
              dialog.remove();
              location.reload();
            }).catch(error => {
              alert('حصل خطأ أثناء إضافة العرض: ' + error.message);
            });
          }
        });
        
        cancelBtn.addEventListener('click', () => {
          dialog.remove();
          document.body.classList.remove('modal-open');
        });
      });
      const offersData = allowedOffersSnapshot.val();
      const sortedOfferIds = Object.keys(offersData).sort((a, b) => {
        const valueA = offersData[a].toString();
        const valueB = offersData[b].toString();
        return valueA.localeCompare(valueB, 'ar');
      });
      sortedOfferIds.forEach(offerId => {
        const offerData = offersData[offerId];
        createofferCard(offerId, offerData);
      });
    }
  });
}

function createofferCard(offerId, offerData) {
  const card = document.createElement("div");
  const titleDiv = document.createElement("div");
  const titleTitle = document.createElement("h3");
  const titleEl = document.createElement("p");
  const descriptionDiv = document.createElement("div");
  const descriptionTitle = document.createElement("h3");
  const descriptionEl = document.createElement("p");
  const priceDiv = document.createElement("div");
  const priceTitle = document.createElement("h3");
  const priceEl = document.createElement("p");
  const coverDiv = document.createElement("div");
  const coverTitle = document.createElement("h3");
  const coverEl = document.createElement("p");
  const coverImg = document.createElement("img"); 
  
  const iconsDiv = document.createElement("div");
  const deleteBtn = document.createElement("i");
  const editBtn = document.createElement("i");
  
  card.className = "offer-card";
  titleEl.className = "offer-title";
  descriptionEl.className = "offer-description";
  priceEl.className = "offer-price";
  coverDiv.className = "cover-div"
  deleteBtn.className = "fa-solid fa-trash";
  editBtn.className = "fa-solid fa-pen";
  
  titleTitle.textContent = "العنوان: ";
  titleEl.textContent = offerData.title;
  descriptionTitle.textContent = "الوصف: ";
  descriptionEl.textContent = offerData.description;
  priceTitle.textContent = "السعر: ";
  priceEl.textContent = offerData.price;
  coverTitle.textContent =  "الصورة:";
  coverEl.textContent = offerData.cover;
  coverImg.src = offerData.cover;
  
  deleteBtn.onclick = function() {
    if (confirm("متأكد من حذف هذا العضو؟")) {
      const offerRef = ref(db, `shop/${selectedOffer}/${offerId}`);
      set(offerRef, null)
        .then(() => {
          alert('لقد تم حذف العرض بنجاح')
          card.remove();
        })
        .catch(error => {
          alert('حصل خطأ أثناء الحذف: ', error);
        });
    }
  };
  let isEditable = false;
  editBtn.addEventListener('click', () => {
    if (!isEditable) {
      titleEl.contentEditable = true;
      descriptionEl.contentEditable = true;
      priceEl.contentEditable = true;
      coverEl.contentEditable = true;
      editBtn.className = "fa-solid fa-floppy-disk";
      isEditable = true;
    } else {
      set(ref(db, `shop/${selectedOffer}/${offerId}`), {
        title: titleEl.textContent,
        description: descriptionEl.textContent,
        price: priceEl.textContent,
        cover: coverEl.textContent,
      });
      titleEl.contentEditable = false;
      descriptionEl.contentEditable = false;
      priceEl.contentEditable = false;
      coverEl.contentEditable = false;
      editBtn.className = "fa-solid fa-pen";
      isEditable = false;
    }
  });
  titleDiv.appendChild(titleTitle);
  titleDiv.appendChild(titleEl);
  descriptionDiv.appendChild(descriptionTitle);
  descriptionDiv.appendChild(descriptionEl);
  priceDiv.appendChild(priceTitle);
  priceDiv.appendChild(priceEl);
  coverDiv.appendChild(coverTitle);
  coverDiv.appendChild(coverEl)
  coverDiv.appendChild(coverImg);
  iconsDiv.appendChild(deleteBtn);
  iconsDiv.appendChild(editBtn);
  card.appendChild(titleDiv);
  card.appendChild(descriptionDiv);
  card.appendChild(priceDiv);
  card.appendChild(coverDiv);
  card.appendChild(iconsDiv);
  dataSection.appendChild(card);
}

showPasswordCheckbox.addEventListener('change', function() {
  passwordInput.type = this.checked ? "text" : "password";
});

loginButton.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (email === "" || password === "") {
    errorParagraph.style.display = "block";
    errorParagraph.textContent = "أدخل البريد الإلكتروني و كلمة المرور معا!";
    return;
  }

  try {
    await setPersistence(auth, browserLocalPersistence);
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    errorParagraph.style.display = "block";
    errorParagraph.textContent = error.message;
  }
});