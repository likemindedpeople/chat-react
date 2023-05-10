import React, { useRef, useState } from 'react'
import './App.css'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
// import { initializeApp } from "firebase/app";

firebase.initializeApp({
  apiKey: 'AIzaSyAGkCG_UYcZuyFPSesLRKDLg_8C6KWL0Jg',
  authDomain: 'fir-react-chat-820e0.firebaseapp.com',
  projectId: 'fir-react-chat-820e0',
  storageBucket: 'fir-react-chat-820e0.appspot.com',
  messagingSenderId: '352509500465',
  appId: '1:352509500465:web:81466dd06af2795a224910',
})

const auth = firebase.auth()
const firestore = firebase.firestore()

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return <button onClick={signInWithGoogle}> Sign in with Google</button>
}

export const SignOut = () => {
  return (
    auth.currentUser && (
      <button onClick={() => auth.sightOut()}>Sign Out</button>
    )
  )
}

const ChatRoom = () => {
  const dummy = useRef()
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)
  const [messages] = useCollectionData(query, { idField: 'id' })
  const [formValue, setFormValue] = useState('')

  const sendMessage = async (e) => {
    e.preventDefault()
    const { uid, photoURL } = auth.currentUser

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    })

    setFormValue('')

    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }

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

        <button type='submit'>🚀</button>
      </form>
    </>
  )
}

const ChatMessage = (props) => {
  const { text, uid, photoURL } = props.message

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved'

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

const App = () => {
  const [user] = useAuthState(auth)
  return (
    <div className='App'>
      <header className='App-header'></header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  )
}

export default App
