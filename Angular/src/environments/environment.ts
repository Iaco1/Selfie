function getLocalIPAddress(): string {
    // During development, we can hardcode the IP or get it from window.location
    const hostname = window.location.hostname;
    return hostname === 'localhost' ? '192.168.1.4' : hostname;
}


const localIP = getLocalIPAddress();

export const environment = {
  production: false,
  baseURL: `/api`,
  timeout: 1000,
  firebase: {
    apiKey: "AIzaSyD7BM42I2jfAjA0zGbU4_fKwT4tDk9NVH8",
    authDomain: "selfie-a0bd3.firebaseapp.com",
    projectId: "selfie-a0bd3",
    storageBucket: "selfie-a0bd3.firebasestorage.app",
    messagingSenderId: "481625422677",
    appId: "1:481625422677:web:dd74f5c4dd6f4dc46b8ddc",
    measurementId: "G-WD0EY3XLN1",
    vapidKey: 'BFOoUQfCMPt_PbRHHuNZjcLJ_9JkYeb5KoTJDuWnIE_UNJaUz5JMB6czQ48df4HdaTz702WGi2bUd0XcZJhOqQ4'
  }

}
