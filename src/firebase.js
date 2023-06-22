import firebase from "firebase/compat/app"
import 'firebase/compat/auth';
import 'firebase/compat/database'
import 'firebase/compat/firestore'


const firebaseConfig = {
    apiKey: "AIzaSyBb7jMK-TzMgt_S0CUK9Bqepxs7ra2zmeU",
    authDomain: "parkinson-sdiseaseasistsystem.firebaseapp.com",
    databaseURL: "https://parkinson-sdiseaseasistsystem-default-rtdb.firebaseio.com",
    projectId: "parkinson-sdiseaseasistsystem",
    storageBucket: "parkinson-sdiseaseasistsystem.appspot.com",
    messagingSenderId: "539715718528",
    appId: "1:539715718528:web:6395739861291686ea0565",
    measurementId: "G-BGYLSKWR3F"
  };
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth=firebase.auth();  
  const googleProvider = new firebase.auth.GoogleAuthProvider()
  export const signInWithGoogle = () => {
    auth.signInWithPopup(googleProvider).then((res) => {
      console.log(res.user)
    }).catch((error) => {
      console.log(error.message)
    })
  }

  const database = firebaseApp.database();
  export {auth,database};
  export default db;


  
