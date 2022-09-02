import "./App.css";
import { initializeApp } from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FormEvent, useRef, useState } from "react";

const app = initializeApp({
  apiKey: "AIzaSyBz_7XXSL4wo_RWeHionxo88Jz2d1vKuZU",
  authDomain: "superchat-bef08.firebaseapp.com",
  projectId: "superchat-bef08",
  storageBucket: "superchat-bef08.appspot.com",
  messagingSenderId: "144145958437",
  appId: "1:144145958437:web:2f89c2729a1f0a6f7261cc",
  measurementId: "G-T41KVED3HJ",
});

const appAuth = getAuth(app);
const firestore = getFirestore(app);

export const App = () => {
  const [user] = useAuthState(appAuth);

  return <div className="App">{user ? <ChatRoom /> : <SignIn />}</div>;
};

export const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(appAuth, provider);
  };

  return <button onClick={signInWithGoogle}>Sign In</button>;
};

export const SignOut = () => {
  return (
    appAuth.currentUser && (
      <button onClick={() => appAuth.signOut()}>Sign Out</button>
    )
  );
};

export const ChatRoom = () => {
  const dummy = useRef() as React.MutableRefObject<HTMLInputElement>;

  const messagesRef = collection(firestore, "messages");
  const q = query(messagesRef, orderBy("createdAt"), limit(25));

  const [messages] = useCollectionData(q);

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();

    const uid = appAuth.currentUser?.uid;
    const photoUrl = appAuth.currentUser?.photoURL;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      photoUrl,
      uid,
    });

    setFormValue("");

    dummy.current.scrollIntoView();
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
          <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
};

type ChatMessageProps = {
  message: DocumentData;
};

export const ChatMessage: React.FC<ChatMessageProps> = (props) => {
  const { text, uid, photoUrl } = props.message;

  const messageClass = uid === appAuth.currentUser?.uid ? "sent" : "recieved";

  return (
    <div className={`message ${messageClass}`}>
      {photoUrl && <img src={photoUrl} alt="profile" />}
      <p>{text}</p>
    </div>
  );
};

export default App;
