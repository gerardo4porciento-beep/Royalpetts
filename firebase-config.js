// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9l7i_uiqrf4Qa3SvYRaZtB7PT5tYh8cI",
  authDomain: "royalpetts-6dc14.firebaseapp.com",
  projectId: "royalpetts-6dc14",
  storageBucket: "royalpetts-6dc14.firebasestorage.app",
  messagingSenderId: "358253913856",
  appId: "1:358253913856:web:48adb286e8701c34f4b5e5",
  measurementId: "G-NRBD54P0E5"
};

// Initialize Firebase
let app, analytics;
// db se expone como variable global para evitar conflictos
window.db = null;

// Función para inicializar Firebase cuando los scripts estén cargados
function initFirebase() {
    if (typeof firebase !== 'undefined') {
        app = firebase.initializeApp(firebaseConfig);
        window.db = firebase.firestore();
        analytics = firebase.analytics();
        return { app, db: window.db, analytics };
    } else {
        console.error('Firebase SDK no está cargado');
        return null;
    }
}

