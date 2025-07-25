importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD7BM42I2jfAjA0zGbU4_fKwT4tDk9NVH8",
  authDomain: "selfie-a0bd3.firebaseapp.com",
  projectId: "selfie-a0bd3",
  storageBucket: "selfie-a0bd3.firebasestorage.app",
  messagingSenderId: "481625422677",
  appId: "1:481625422677:web:dd74f5c4dd6f4dc46b8ddc",
  measurementId: "G-WD0EY3XLN1"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
