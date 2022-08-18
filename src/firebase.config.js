import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAfo9rR8pqlZjzRL8MCbS0TIPBZe5Em93s",
  authDomain: "dbrecipe-60782.firebaseapp.com",
  projectId: "dbrecipe-60782",
  storageBucket: "dbrecipe-60782.appspot.com",
  messagingSenderId: "271890271023",
  appId: "1:271890271023:web:f450bde39d453e0cfeefda"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {db};