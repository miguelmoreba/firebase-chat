import "./App.css";
import { initializeApp } from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, DocumentData, getFirestore, limit, orderBy, query } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useCollectionData } from 'react-firebase-hooks/firestore';

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

  return (
    <div className="App">
      <header></header>
      {user ? <ChatRoom/> : <SignIn />}
    </div>
  );
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

  const messagesRef = collection(firestore, 'messages');
  const q = query(messagesRef,orderBy('createdAt'), limit(25));

  const [messages] = useCollectionData(q);
  console.log('messages', messages)

  return (
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
    </div>
  )
}

type ChatMessageProps = {
  message: DocumentData
}

export const ChatMessage: React.FC<ChatMessageProps> = (props) => {
  const {text, uid} = props.message;

  return <p>{text}</p>
}



export default App;
