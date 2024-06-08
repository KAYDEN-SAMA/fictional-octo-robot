import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getDatabase, ref, get, set, push } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

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

const path = ref(db, 'shop');

function fetchAndDisplayusernameOffers() {
  const usernameOffersPath = ref(db, 'shop/usernameOffers');
  get(usernameOffersPath).then((snapshot) => {
    if (snapshot.exists()) {
      const usernameOffers = snapshot.val();
      const usernameOffersDiv = document.getElementById("usernameOffers");
      usernameOffersDiv.innerHTML = '<h3>عروض اللقب</h3>';
      Object.keys(usernameOffers).forEach((offerId, index) => {
        const offer = usernameOffers[offerId];
        const whatsappLinkId = `whatsapp-link-${index}`;
        usernameOffersDiv.innerHTML += `
          <div class="offers-card">
            <div class="cover-div">
              <img src="${offer.cover}">
            </div>
            <div class="card-elements">
              <h4>${offer.title}</h4>
              <p>${offer.description}</p>
              <p>السعر: ${offer.price} <i class="fa-solid fa-star"></i></p>
              <a id="${whatsappLinkId}" href="#" target="_blank">طلب العرض</a>
            </div>
          </div>`;
      });
      const username = localStorage.getItem('username') || 'عضو';
      Object.keys(usernameOffers).forEach((offerId, index) => {
        const offer = usernameOffers[offerId];
        const whatsappLinkId = `whatsapp-link-${index}`;
        let whatsappLink = document.getElementById(whatsappLinkId);
        const phoneNumber = '+963 992 984 704';
        const message = `مرحبا، أنا ${username} مهتم بعرض ${offer.title}`;
        whatsappLink.href = generateWhatsAppLink(phoneNumber, message);
      });
    } else {
      usernameOffersDiv.textContent = "لا توجد أي عروض حاليا";
    }
  }).catch((error) => {
    console.error("Error fetching user offers: ", error);
  });
}

function fetchAndDisplayBagageOffers() {
  const bagageOffersPath = ref(db, 'shop/bagageOffers');
  get(usernameOffersPath).then((snapshot) => {
    if (snapshot.exists()) {
      const usernameOffers = snapshot.val();
      const usernameOffersDiv = document.getElementById("usernameOffers");
      usernameOffersDiv.innerHTML = '<h3>عروض اللقب</h3>';
      Object.keys(usernameOffers).forEach((offerId, index) => {
        const offer = usernameOffers[offerId];
        const whatsappLinkId = `whatsapp-link-${index}`;
        usernameOffersDiv.innerHTML += `
          <div class="offers-card">
            <div class="cover-div">
              <img src="${offer.cover}">
            </div>
            <div class="card-elements">
              <h4>${offer.title}</h4>
              <p>${offer.description}</p>
              <p>السعر: ${offer.price} <i class="fa-solid fa-star"></i></p>
              <a id="${whatsappLinkId}" href="#" target="_blank">طلب العرض</a>
            </div>
          </div>`;
      });
      const username = localStorage.getItem('username') || 'عضو';
      Object.keys(usernameOffers).forEach((offerId, index) => {
        const offer = usernameOffers[offerId];
        const whatsappLinkId = `whatsapp-link-${index}`;
        let whatsappLink = document.getElementById(whatsappLinkId);
        const phoneNumber = '+963 992 984 704';
        const message = `مرحبا، أنا ${username} مهتم بعرض ${offer.title}`;
        whatsappLink.href = generateWhatsAppLink(phoneNumber, message);
      });
    } else {
      usernameOffersDiv.textContent = "لا توجد أي عروض حاليا";
    }
  }).catch((error) => {
    console.error("Error fetching user offers: ", error);
  });
}

function generateWhatsAppLink(phoneNumber, message) {
  let encodedMessage = encodeURIComponent(message);
  let whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  return whatsappUrl;
}

window.onload = () => {
  fetchAndDisplayusernameOffers();
  fetchAndDisplayBagageOffers();
}
