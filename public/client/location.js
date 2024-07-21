const x = document.getElementById("location");

window.onload = function() {
    getPermission();
};

function getPermission() {
    if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then(function(result) {
            if (result.state === 'granted') {
                getLocation();
            } else if (result.state === 'prompt') {
                getLocation();
            } else {
                x.innerHTML = "Geolocation permission denied.";
            }
        }).catch(function(err) {
            console.error('Error checking geolocation permission:', err);
            getLocation(); // Attempt to get location even if permissions API fails
        });
    } else {
        getLocation(); // Fallback if Permissions API is not supported
    }
}

function getLocation() {
    if (navigator.geolocation) {
        console.log('Requesting geolocation...');
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}


// Import the functions you need from the SDKs you need
import { initializeApp } from "../node_modules/@firebase/app";
import { getDatabase, ref, set } from "../node_modules/@firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBE0SqJqJ24rfDltYeXg71J4trb8tsXHZY",
    authDomain: "csas-90a2d.firebaseapp.com",
    projectId: "csas-90a2d",
    storageBucket: "csas-90a2d.appspot.com",
    messagingSenderId: "859944009411",
    appId: "1:859944009411:web:9cd24338bde6a9d9e72c76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let current_lat = null; 
let current_long = null;
function load_firebase(lat, long) {
    set(ref(database, 'location'), {
        latitude: lat,
        longitude: long
    });
}


function showPosition(position) {
    x.innerHTML = position.coords.latitude + ", " + position.coords.longitude;
    if (current_lat == null && current_long == null) {
        current_lat = position.coords.latitude;
        current_long = position.coords.longitude;
        console.log(current_lat, current_long);
        load_firebase(current_lat, current_long);
    } else if (position.coords.latitude != current_lat || position.coords.longitude != current_long) {
        current_lat = position.coords.latitude;
        current_long = position.coords.longitude;
        console.log(current_lat, current_long);
        load_firebase(current_lat, current_long);
    }
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred.";
            break;
    }
}
