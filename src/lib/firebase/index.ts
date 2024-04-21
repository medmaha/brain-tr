import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyCP3crKMPVrmG1pBfJzJczjLZVR3Oziscc",
  authDomain: "intrasoftware-36be6.firebaseapp.com",
  projectId: "intrasoftware-36be6",
  storageBucket: "intrasoftware-36be6.appspot.com",
  messagingSenderId: "986901332980",
  appId: "1:986901332980:web:4e4d9252ac91018e8bafa1",
  measurementId: "G-MV68LF04Z9",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;
