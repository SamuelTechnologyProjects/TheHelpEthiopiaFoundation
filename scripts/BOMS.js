
var refugeeCampImages = [
    "https://firebasestorage.googleapis.com/v0/b/thehelpethiopiaproject.appspot.com/o/Images%2FrefugeeCamp%2F1.jpg?alt=media&token=3f748203-d520-4586-91aa-412fffb6a950",
    "https://firebasestorage.googleapis.com/v0/b/thehelpethiopiaproject.appspot.com/o/Images%2FrefugeeCamp%2F2.jpg?alt=media&token=b5379458-00bb-4db2-8fe0-8ee294d29d5f",
    "https://firebasestorage.googleapis.com/v0/b/thehelpethiopiaproject.appspot.com/o/Images%2FrefugeeCamp%2F3.jpg?alt=media&token=75d7ee53-bf16-4a75-a067-b7b446008a49",
    "https://firebasestorage.googleapis.com/v0/b/thehelpethiopiaproject.appspot.com/o/Images%2FrefugeeCamp%2F4.jpg?alt=media&token=1b3bf5ab-6944-46ac-a08e-98c026b47f05",
    "https://firebasestorage.googleapis.com/v0/b/thehelpethiopiaproject.appspot.com/o/Images%2FrefugeeCamp%2F5.jpg?alt=media&token=240287f8-1e9f-469b-a5f1-6105d4242b56",
    "https://firebasestorage.googleapis.com/v0/b/thehelpethiopiaproject.appspot.com/o/Images%2FrefugeeCamp%2F6.jpg?alt=media&token=afca4499-8802-408a-894e-7d9445220d58",
    "https://firebasestorage.googleapis.com/v0/b/thehelpethiopiaproject.appspot.com/o/Images%2FrefugeeCamp%2F7.jpg?alt=media&token=08006ac3-de53-4540-9de4-02c748bbb0d6",
    "https://firebasestorage.googleapis.com/v0/b/thehelpethiopiaproject.appspot.com/o/Images%2FrefugeeCamp%2F8.jpg?alt=media&token=91f9d4fc-b8c7-49cd-a060-94f4fff02566",
    "https://firebasestorage.googleapis.com/v0/b/thehelpethiopiaproject.appspot.com/o/Images%2FrefugeeCamp%2F9.jpg?alt=media&token=9a65f256-302a-4e60-b0d1-0ce2def473ba",
    "https://firebasestorage.googleapis.com/v0/b/thehelpethiopiaproject.appspot.com/o/Images%2FrefugeeCamp%2F10.jpg?alt=media&token=d9c9271d-7303-4973-8e0a-96c9c7597d97",
    "https://firebasestorage.googleapis.com/v0/b/thehelpethiopiaproject.appspot.com/o/Images%2FrefugeeCamp%2F11.jpg?alt=media&token=a842f7c3-c8d9-4b9b-ab6f-2bb380b76605",
    "https://firebasestorage.googleapis.com/v0/b/thehelpethiopiaproject.appspot.com/o/Images%2FrefugeeCamp%2F12.jpg?alt=media&token=7ef2bcd4-0854-439d-9d84-1356aed10705",
    "https://firebasestorage.googleapis.com/v0/b/thehelpethiopiaproject.appspot.com/o/Images%2FrefugeeCamp%2F13.jpg?alt=media&token=82658ac3-a8d6-43bf-9e97-e8f1c2faa595"
];
let currentIndex = 0;
const intervalTime = 12000; // Change image every 5 seconds
const fadeDuration = 2500; // Duration of the fade effect

function changeBackgroundImage() {
    let backgroundImageElement = document.querySelector('.background-image');

    // Fade out the current image
    backgroundImageElement.style.opacity = 0;

    // Update the background image after fade-out duration
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % refugeeCampImages.length;
        backgroundImageElement.style.backgroundImage = `url('${refugeeCampImages[currentIndex].src}')`;
        backgroundImageElement.style.opacity = 1;
    }, fadeDuration); // Match the fade-out duration
}

// Initial setup
changeBackgroundImage();

// Set up an interval to change the background image automatically
setInterval(changeBackgroundImage, intervalTime);
