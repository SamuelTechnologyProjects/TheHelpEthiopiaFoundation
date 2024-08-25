import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { setCookie, getCookie, eraseCookie } from './cookies.js';
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-functions.js";

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
const auth = getAuth(app);

export const signUp = async (email, password, loginElement) => {
    try {

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(user);
        AddUserNameAndProfilePic(loginElement);
        await sendEmailVerification(user);

        setCookie('user', user.uid, 1); // Set a cookie with user ID
        showAlert('User signed up successfully',false);
        return true;
    } catch (error) {
        const errorCode = error.code;
        if (error.code === 'auth/invalid-email') {

        }
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        showAlert(errorMessage,true);
        return false;
    }
};

function AddUserNameAndProfilePic(loginElement) {
    loginElement.style.display = 'none';
    // Create the div element
    const div = document.createElement('div');
    div.className = 'login';
    div.id = 'SetProfile';

    // Create the input element
    const input = document.createElement('input');
    input.id = 'username';
    input.type = 'text'; // Using 'text' since 'username' is not a valid type
    input.placeholder = 'My awesome Username';

    // Create the button element
    const button = document.createElement('button');
    button.classList.add("btn");
    button.classList.add("btn-pink");
    button.id = 'set-username';
    button.textContent = 'Set Username';

    // Add event listener to the button
    button.addEventListener('click', () => SetUserData(input));

    // Append the input and button to the div
    div.appendChild(input);
    div.appendChild(button);

    // Append the div to the body (or another container)
    document.body.appendChild(div);
}
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

function SetUserData(input) {
    const userName = input.value;
    updateProfile(auth.currentUser, {
        displayName: userName,
        photoURL: "https://media.springernature.com/lw685/springer-static/image/art%3A10.1186%2F2045-3701-2-9/MediaObjects/13578_2011_Article_54_Fig2_HTML.jpg"
    }).then(() => {
        console.log('User profile updated');
        showAlert('Profile updated successfully',false);
        // Redirect to index.html after profile update
        window.location.reload();
    }).catch((error) => {
        console.error('Error updating profile:', error);
        showAlert('Failed to update profile',true);
    });
}


export const signIn = async (email, password) => {
    try {
        if (getCookie('user') != null) {
            eraseCookie('user');
        }
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(user.emailVerified);
        console.log(user);
        console.log(user.displayName);
        setCookie('user', user.uid, 1); // Set a cookie with user ID
        showAlert('User signed in successfully',false);
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        showAlert(errorMessage,true);
    }
};

export const userSignOut = () => {
    signOut(auth).then(() => {
        eraseCookie('user'); // Remove the user cookie
        console.log('User signed out');
        showAlert('User signed out successfully',false);
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        showAlert(errorMessage,true);
    });
};

export const checkLoginStatus = (loginElement,head, authPartElement) => {
    onAuthStateChanged(auth, (user) => {
        const cookieUser = getCookie('user');
        if (user && cookieUser && user.uid === cookieUser) {
            loginElement.style.display = 'none';
            authPartElement.className = "authV";
            
            head.className = "headH";
            console.log('User is signed in');
        } else {
            loginElement.style.display = 'block';
            authPartElement.className = "authH";
            
            head.className = "headV";
            eraseCookie('user'); // Clear the invalid cookie
            console.log('User is signed out');
        }
    });
};
export const checkEmailExists = async function (email) {
    const functions = getFunctions();
    const checkEmail = httpsCallable(functions, 'checkEmailExists');
    try {
        const result = await checkEmail({ email: email });
        console.log(result.data.exists ? 'Email exists' : 'Email does not exist');
        return result.data.exists;
    } catch (error) {
        console.error('Error checking email:', error);
        return false;
    }
}
export const isUserLoggedIn = async () => {
    return new Promise((resolve) => {
        const cookieUser = getCookie('user');

        if (cookieUser) {
            onAuthStateChanged(auth, (user) => {
                if (user && user.uid === cookieUser) {
                    console.log(user.displayName);
                    resolve({ loggedIn: true, user }); // Return both loggedIn status and user object
                } else {
                    eraseCookie('user'); // Clear the invalid cookie
                    resolve({ loggedIn: false }); // No matching user, return false
                }
            });
        } else {
            resolve({ loggedIn: false }); // No cookie, user is not logged in
        }
    });
};

