import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCz3CHJLh7WZMFvyhLMjB5m_qCrgCyglBs",
  projectId: "birdscoutusers",
  storageBucket: "birdscoutusers.firebasestorage.app",
  messagingSenderId: "218951388893",
  appId: "1:218951388893:android:45a3539d54b15c494a1534",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

async function testFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    console.log(
      "Firestore is connected! Documents:",
      querySnapshot.docs.map((doc) => doc.data())
    );
  } catch (error) {
    console.error("Firestore connection error:", error);
  }
}

testFirestore();
