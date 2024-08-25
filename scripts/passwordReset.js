location.reload(true);
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyBkT4JXCcRlQXsaTWUmZbtAy_kfVSD2szg",
    authDomain: "thehelpethiopiaproject.firebaseapp.com",
    projectId: "thehelpethiopiaproject",
    storageBucket: "thehelpethiopiaproject.appspot.com",
    messagingSenderId: "141120785240",
    appId: "1:141120785240:web:83f385a066382accadb32d",
    measurementId: "G-2HBXKBZ5FT"
};

const app = initializeApp(firebaseConfig);
// Initialize Firebase
const auth = getAuth(app);

document.getElementById('sendResetEmail').addEventListener('click', () => {
    const email = document.getElementById('resetEmail').value.trim();
    const messageElement = document.getElementById('message');

    if (!email) {
        messageElement.textContent = 'Please enter an email address.';
        return;
    }
    if (email) {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                messageElement.style.color = '#28a745';
                messageElement.textContent = 'Password reset email sent successfully!';
                
                window.location = "Authenticator.html";
            })
            .catch((error) => {
                messageElement.style.color = '#ff0000';
                messageElement.textContent = 'Failed to send password reset email.';
                
            });
    } else {
        document.getElementById('message').innerText = 'Please enter a valid email address.';
    }
});
