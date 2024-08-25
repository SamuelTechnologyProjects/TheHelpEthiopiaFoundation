import { isUserLoggedIn } from './auth.js';

const signup = document.querySelector(".signup");

const sys = async () => {
    const { loggedIn, user } = await isUserLoggedIn();

    if (loggedIn) {
        const profilePicHtml = user.photoURL ? 
            `<img src="${user.photoURL}" alt="Profile Picture" class="profile-pic">` : '';
        const displayName = user.displayName ? user.displayName : 'No Name';

        signup.innerHTML = `
            <div class="profile-container">
                ${profilePicHtml}
            </div>
        `;
        console.log('User is signed in');
    } else {
        signup.innerHTML = "Sign Up / Sign In";
        console.log('User is signed out');
    }
};

sys();
