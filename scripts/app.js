// main.js
import { signUp, signIn, checkEmailExists, userSignOut, checkLoginStatus, isUserLoggedIn } from './auth.js';
import {
    getAuth, updateProfile, sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { ref, uploadBytes, getDownloadURL, getStorage } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";
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
const storage = getStorage(app);




const email = document.getElementById('email');
const password = document.getElementById('password');
const signUpBtn = document.getElementById('signUpBtn');
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const login = document.getElementById('login');
const authPart = document.getElementById('aut');
console.log("hello" + authPart + "fe");
const auth = getAuth();
const usernameHolder = document.getElementById('usernameHolder');
const emailHolder = document.getElementById('emailHolder');
const profilePic = document.getElementById('profilePic');
const changePicBtn = document.getElementById('changePicBtn');
const changeUsernameBtn = document.getElementById('changeUsernameBtn');

// Modal elements
const changePicModal = document.getElementById('changePicModal');
const changeUsernameModal = document.getElementById('changeUsernameModal');
const closePicModal = document.getElementById('closePicModal');
const closeUsernameModal = document.getElementById('closeUsernameModal');
const savePicBtn = document.getElementById('savePicBtn');
const saveUsernameBtn = document.getElementById('saveUsernameBtn');
const newUsername = document.getElementById('newUsername');
let verificationMessage = null;
const box = document.querySelector(".profile-container");
const header = document.querySelector("#hder");
const validationMessage = document.getElementById('validationMessage');
function showAlert(message, isError = false, timeout = 5000) {
    // Create alert container
    const alertContainer = document.createElement('div');
    alertContainer.classList.add('dynamic-alert');
    
    // Add class based on error type
    if (isError) {
        alertContainer.classList.add('error-alert');
    } else {
        alertContainer.classList.add('success-alert');
    }
    
    // Create alert message
    const alertMessage = document.createElement('p');
    alertMessage.textContent = message;
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×'; // Using a Unicode character for the close button
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(alertContainer);
    });

    // Append message and button to alert container
    alertContainer.appendChild(alertMessage);
    alertContainer.appendChild(closeButton);
    
    // Append alert container to the body
    document.body.appendChild(alertContainer);

    // Automatically remove the alert after a timeout
    setTimeout(() => {
        if (document.body.contains(alertContainer)) {
            document.body.removeChild(alertContainer);
        }
    }, timeout);
}
// Track the last time a verification email was sent
let lastSentTime = 0;
const resendCooldown = 5 * 60000; // 60 seconds cooldown
const sys = async () => {
    const loggedIn = await isUserLoggedIn();

    if (loggedIn) {
        const user = auth.currentUser;

        if (user !== null) {
            user.providerData.forEach((profile) => {

                console.log("  Name: " + profile.displayName);
                if (profile.displayName == null) {
                    usernameHolder.innerText = "Alpha-Omega";
                } else {

                    usernameHolder.innerText = profile.displayName;
                }
                console.log("  Email: " + profile.email);
                emailHolder.innerText = profile.email;
                console.log("  Photo URL: " + profile.photoURL);
                if (profile.photoURL == null) {
                    profilePic.setAttribute("src","https://media.springernature.com/lw685/springer-static/image/art%3A10.1186%2F2045-3701-2-9/MediaObjects/13578_2011_Article_54_Fig2_HTML.jpg");
                } else {
                    profilePic.setAttribute("src", profile.photoURL);
                }

            });
        }
        console.log('User is signed in');
    } else {
        console.log('User is signed out');
    }
};
sys();
// Show modal for changing profile picture
changePicBtn.addEventListener('click', () => {
    changePicModal.style.display = 'block';
});

// Show modal for changing username
changeUsernameBtn.addEventListener('click', () => {
    changeUsernameModal.style.display = 'block';
});

// Close modal for changing profile picture
closePicModal.addEventListener('click', () => {
    changePicModal.style.display = 'none';
});

// Close modal for changing username
closeUsernameModal.addEventListener('click', () => {
    changeUsernameModal.style.display = 'none';
});

const fileInput = document.getElementById('fileInput');
const statusElement = document.getElementById('status');

let uploadedFileURL = ''; // Variable to store the uploaded file URL

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        savePicBtn.disabled = false; // Enable the button when a file is selected
    } else {
        savePicBtn.disabled = true; // Disable the button if no file is selected
    }
});

savePicBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];

    if (!file) {
        statusElement.textContent = 'Please select a file first.';
        statusElement.classList.remove('success');
        statusElement.classList.add('error');
        return;
    }

    // Create a storage reference
    const storageRef = ref(storage, `profile_pics/${file.name}`);

    try {
        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);
        console.log('Uploaded a blob or file!', snapshot);

        // Get the download URL
        uploadedFileURL = await getDownloadURL(snapshot.ref);
        statusElement.textContent = 'File uploaded and profile picture updated successfully!';
        statusElement.classList.remove('error');
        statusElement.classList.add('success');

        // Update profile picture
        await updateProfile(auth.currentUser, {
            photoURL: uploadedFileURL
        });
        profilePic.setAttribute("src", uploadedFileURL);
        console.log('Profile picture updated');
        showAlert('Profile picture updated successfully',false);
        changePicModal.style.display = 'none'; // Close the modal
    } catch (error) {
        console.error('Error:', error);
        statusElement.textContent = 'Failed to upload file and update profile picture.';
        statusElement.classList.remove('success');
        statusElement.classList.add('error');
    }
});

closePicModal.addEventListener('click', () => {
    changePicModal.style.display = 'none'; // Close the modal
});

// Function to show the modal (for demonstration purposes)
function showChangePicModal() {
    changePicModal.style.display = 'block';
}
// Save new username
saveUsernameBtn.addEventListener('click', () => {
    const newUsernameValue = newUsername.value.trim();
    if (newUsernameValue) {
        usernameHolder.innerText = newUsernameValue;
        updateProfile(auth.currentUser, {
            displayName: newUsernameValue
        }).then(() => {
            console.log('Username updated');
            showAlert('Username updated successfully',false);
        }).catch((error) => {
            console.error('Error updating username:', error);
            showAlert('Failed to update username',true);
        });
    }
    changeUsernameModal.style.display = 'none';
});
async function checkEmailVerification() {
    const user = auth.currentUser;

    if (user) {
        await user.reload(); // Ensure we have the latest user data
        if (user.emailVerified) {
            console.log("I EXIST!" + user.emailVerified);
            console.log('Email is verified');

            // Proceed with user access
        } else {
            console.log('Email is not verified');
            createVerificationMessage();
            // Show verification message
        }
    } else {
        console.log('No user is signed in');
    }
}
async function resendVerificationEmail() {
    const user = auth.currentUser;
    const now = Date.now();

    if (user && (now - lastSentTime) > resendCooldown) {
        try {
            await sendEmailVerification(user);
            console.log('Verification email resent.');
            showAlert('A new verification email has been sent. Please check your inbox.',false);
            lastSentTime = now;
        } catch (error) {
            console.error('Error resending email:', error);
            showAlert('Failed to resend verification email.',true);
        }
    } else {
        showAlert('Please wait before requesting another email.',false);
    }
}
// Event listeners

// Event listeners
signUpBtn.addEventListener('click', () => PushSignUp());
signInBtn.addEventListener('click', () => PushSignIn());
signOutBtn.addEventListener('click', userSignOut);

checkLoginStatus(login, header, authPart);
const loggedIn = await isUserLoggedIn();
if (loggedIn) {
    checkEmailVerification();
}
function PushSignUp() {
    validationMessage.textContent = '';
    let errors = 0;
    // Email validation
    if (!validateEmail(email)) {
        errors += 1;
        validationMessage.textContent += 'Please enter a valid email address.\n';
    }

    // Password validation
    if (!validatePassword(password)) {
        errors += 1;
        validationMessage.textContent += 'Password must be at least 8 characters long, and not greater than 15 characters, include at least one uppercase letter and one number.\n ';
    }
    if (errors === 0) {

        signUp(email.value, password.value, login);
    }
}
function PushSignIn() {
    validationMessage.textContent = '';
    let errors = 0;
    // Email validation
    if (!validateEmail(email)) {
        errors += 1;
        validationMessage.textContent += 'Please enter a valid email address.\n';
    }

    // Password validation
    if (!validatePassword(password)) {
        errors += 1;
        validationMessage.textContent += 'Your password is invaild!\n ';
    }
    if (errors === 0) {

        signIn(email.value, password.value);

    }
}

// Function to create and display the email verification message
function createVerificationMessage() {
    // Create container div
    const container = document.createElement('div');
    container.className = 'container';
    container.id = 'verificationMessage';

    // Create heading
    const heading = document.createElement('h2');
    heading.textContent = 'Email Verification Required';

    // Create paragraph
    const paragraph = document.createElement('p');
    paragraph.textContent = 'Please check your email and verify your address. You won\'t be able to access some features until your email is verified.';

    // Create resend button
    const resendBtn = document.createElement('button');
    resendBtn.className = 'btn';
    resendBtn.id = 'resendEmailBtn';
    resendBtn.textContent = 'Resend Verification Email';
    resendBtn.addEventListener('click', resendVerificationEmail);

    // Append elements to container
    container.appendChild(heading);
    container.appendChild(paragraph);
    container.appendChild(resendBtn);
    verificationMessage = container;
    // Append container to body (or another container element)
    box.insertAdjacentElement("afterbegin", container);
}

// Function to validate email
function validateEmail(email) {
    let objs = email.value.split("@");
    if (objs.length != 2) return false;
    console.log(1);
    if (objs[0] === '') return false;
    console.log(2);
    if (objs[1] === '') return false;
    console.log(3);
    return true;
}

// Function to validate password
function validatePassword(password) {
    // Check password length
    if (password.value.length < 8) {
        return false;
    }
    if (password.value.length > 15) {
        return false;
    }
    // Check for uppercase letter
    if (!hasUpperCase(password.value)) {
        console.log("noUPPERCASEEE!");
        return false;
    }
    if (!hasNumber(password.value)) {
        return false;
    }

    return true;
}
function hasUpperCase(text) {
    // Iterate through each character in the text
    for (let i = 0; i < text.length; i++) {
        // Check if the current character is uppercase
        if (text[i] === text[i].toUpperCase() && text[i] !== text[i].toLowerCase()) {
            return true;
        }
    }
    return false;
}
function hasNumber(text) {
    for (let i = 0; i < text.length; i++) {
        for (let j = 0; j < 9; j++) {
            if (Number(text[i]) == j) {
                return true;
            }
        }
    }
    return false;
}