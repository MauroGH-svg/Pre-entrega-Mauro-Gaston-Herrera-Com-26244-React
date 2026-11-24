// Importamos las funciones necesarias de Firebase.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de nuestro proyecto FiestaBox.
const firebaseConfig = {
  apiKey: "AIzaSyCPBMoFZCbbMgF97lcAWWXRqOrr6yEOls0",
  authDomain: "fiestabox-e1c4c.firebaseapp.com",
  projectId: "fiestabox-e1c4c",
  storageBucket: "fiestabox-e1c4c.firebasestorage.app",
  messagingSenderId: "690642351122",
  appId: "1:690642351122:web:76c076a25bc721979bd4cb"
};

// Inicializamos Firebase.
const app = initializeApp(firebaseConfig);

// Configuramos los servicios de autenticación y base de datos.
export const auth = getAuth(app);
export const db = getFirestore(app);