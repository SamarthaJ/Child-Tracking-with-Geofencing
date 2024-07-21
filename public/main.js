// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBE0SqJqJ24rfDltYeXg71J4trb8tsXHZY",
  authDomain: "csas-90a2d.firebaseapp.com",
  databaseURL: "https://csas-90a2d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "csas-90a2d",
  storageBucket: "csas-90a2d.appspot.com",
  messagingSenderId: "859944009411",
  appId: "1:859944009411:web:9cd24338bde6a9d9e72c76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { getDatabase, ref,child, get } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";
    
const database = getDatabase(app);

window.onload = function() {
    loadData();
};

function loadData() {
    const dbref = ref(database);
    get(child( dbref, 'location')).then((snapshot) => {
        if (snapshot.exists()) {
            lat = snapshot.val().latitude;
            long = snapshot.val().longitude;
            rand = snapshot.val().randomNumber;
            console.log(rand);
        }
        else {
            console.log('No data available');
        }
    }).catch((error) => {
        console.error(error);
    });
}

let lat = 0;
let long= 0 ;
let rand=0;
if ('Notification' in window && navigator.serviceWorker) {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
        } else {
            console.log('Notification permission denied.');
        }
    });
}
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
        console.log('Service Worker registration failed:', error);
    });
}
// Initialize the map with center coordinates and zoom level
var map = L.map('map').setView([lat, long], 13);

// Add a tile layer from OpenStreetMap
var tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Initialize a variable for a marker (currently null)
var marker = null;
var bounds = null;
// Create a feature group for drawn items (e.g., shapes)
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

map.on('draw:created', function (e) {
    var layer = e.layer;
    var boundary = e.layer.getBounds(); // Use getBounds() to ensure compatibility with other shapes
    bounds = boundary; // Assign directly without stringifying/parsing
    drawnItems.addLayer(layer);
    console.log("Layer created and added to drawnItems:", layer);
});

// Handle the deletion of drawn items
map.on('draw:deleted', function (e) {
    var deletedLayers = e.layers;
    deletedLayers.eachLayer(function (layer) {
        drawnItems.removeLayer(layer); // Remove each deleted layer from drawnItems
        console.log("Layer deleted and removed from drawnItems:", layer);
    });
});
// Initialize a draw control to allow drawing/editing shapes
var drawControl = new L.Control.Draw({
    draw: {
        polyline: false,
        polygon: false,
        circle: false,
        circlemarker: false,
        marker: false,
    },
    edit: {
        featureGroup: drawnItems  // Bind the draw control to the drawn items feature group
    }
});
map.addControl(drawControl);

function isMarkerInRectangle(markerPosition, rectangleBounds) {
    const { lat, lng } = markerPosition;
    const { _southWest, _northEast } = rectangleBounds;

    console.log("Start1");
    console.log(_southWest);
    console.log("Start2");
    return (
        lat >= _southWest.lat.toFixed(2) &&
        lat <= _northEast.lat.toFixed(2) ||
        lng >= _southWest.lng.toFixed(2) &&
        lng <= _northEast.lng.toFixed(2)
    );
}
window.check = function() {
    loadData();
    const isInRectangle = isMarkerInRectangle({lat,long}, bounds);
    console.log("Is marker inside rectangle?", isInRectangle);
    if (!isInRectangle) {
        notify();
    }
    console.log("Drawn Items: ",drawnItems);
}

window.edit = function(event){
    event.preventDefault();
    const deviceElement = event.target.closest('.device');
    const name = deviceElement.querySelector('.name').textContent.trim();
    const description = deviceElement.querySelector('.description').textContent.trim();
    
    // Prompt for new name and description
    const newName = prompt('Enter new device name:', name);
    const newDescription = prompt('Enter new description:', description);
    
    // Update device details if newName and newDescription are not null
    if (newName !== null && newDescription !== null) {
        deviceElement.querySelector('.name').textContent = newName;
        deviceElement.querySelector('.description').textContent = newDescription;
        saveToDeviceStorage(newName, newDescription);
    }
}

function saveToDeviceStorage(name, description) {
    const deviceData = {
        name,
        description
    };
    localStorage.setItem('deviceData', JSON.stringify(deviceData));
}

function loadFromDeviceStorage() {
    const deviceDataJSON = localStorage.getItem('deviceData');
    if (deviceDataJSON) {
        const deviceData = JSON.parse(deviceDataJSON);
        return deviceData;
    }
    return null;
}
const storedDeviceData = loadFromDeviceStorage();
if (storedDeviceData) {
    document.querySelector('.name').textContent = storedDeviceData.name;
    document.querySelector('.description').textContent = storedDeviceData.description;
}

document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.querySelector('.toggle-btn');
    const sidebar = document.getElementById('mySidebar');
    const content = document.querySelector('.content');
    const name_of_device = document.querySelector('.name');
    
    name_of_device.addEventListener('click', function(){
        var newLatLng = [lat, long]; // New marker position
        if (marker) {
            // Marker exists, so update its position
            marker.setLatLng(newLatLng).update();
        } else {
            // Marker doesn't exist, so create a new one
            marker = L.marker(newLatLng).addTo(map);
            marker.bindPopup("Camera focused here").openPopup(); // Optional popup message
        }
        
        // Fly to the new position with smooth transition
        map.flyTo(newLatLng, 18, {
            duration: 1
        });
        marker.bindPopup("Camera focused here").openPopup();
    })
    
    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('closed');
        content.classList.toggle('expanded');
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('closed');
            content.classList.remove('expanded');
        }
    });
});

// Notification part
function notify() {
    navigator.serviceWorker.ready.then(registration => {
        registration.showNotification('Hello, world!', {
            body: 'This is a test notification.',
            icon: '/path/to/icon.png',
            tag: 'test-notification'
        });
    });
    console.log("clicked2");
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    } else {
        var notification = new Notification(
            "Hello, World!",
            {
                body: "Samartha has left the predefined bounds",
                // tag: "Samartha has left the predefined bounds"
            }
        );
    }
}
