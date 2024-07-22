import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBE0SqJqJ24rfDltYeXg71J4trb8tsXHZY",
  authDomain: "csas-90a2d.firebaseapp.com",
  databaseURL: "https://csas-90a2d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "csas-90a2d",
  storageBucket: "csas-90a2d.appspot.com",
  messagingSenderId: "859944009411",
  appId: "1:859944009411:web:9cd24338bde6a9d9e72c76"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let lat = 0;
let long = 0;
let rand = 0;
let marker = null;
let bounds = null;
let map = null;

window.onload = function() {
    initMap();
    loadData();
    setInterval(loadData, 15000);
    setInterval(checkBounds, 15000);
};

function loadData() {
    console.log('Loading data...');
    const dbRef = ref(database);
    get(child(dbRef, 'location')).then((snapshot) => {
        if (snapshot.exists()) {
            lat = snapshot.val().latitude;
            long = snapshot.val().longitude;
            rand = snapshot.val().randomNumber;
            console.log(rand);
            updateMarker();
        } else {
            console.log('No data available');
        }
    }).catch((error) => {
        console.error(error);
    });
    console.log('Loaded data:', lat, long, rand);
}

function initMap() {
    map = L.map('map').setView([lat, long], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    var drawControl = new L.Control.Draw({
        draw: {
            polyline: false,
            polygon: false,
            circle: false,
            circlemarker: false,
            marker: false
        },
        edit: {
            featureGroup: drawnItems
        }
    });
    map.addControl(drawControl);

    map.on('draw:created', function(e) {
        var layer = e.layer;
        bounds = e.layer.getBounds();
        drawnItems.addLayer(layer);
        console.log("Layer created and added to drawnItems:", layer);
    });

    map.on('draw:edited', function (e) {
        e.layers.eachLayer(function (layer) {
            if (layer instanceof L.Rectangle) {
                bounds = layer.getBounds(); // Update bounds when the rectangle is edited
                console.log("Updated bounds after editing:", bounds);
            }
        });
    });

    map.on('draw:deleted', function(e) {
        var deletedLayers = e.layers;
        deletedLayers.eachLayer(function(layer) {
            drawnItems.removeLayer(layer);
            console.log("Layer deleted and removed from drawnItems:", layer);
        });
    });
}

// Update marker position and fly to it
function updateMarker() {
    var newLatLng = [lat, long];
    if (marker) {
        marker.setLatLng(newLatLng).update();
    } else {
        marker = L.marker(newLatLng).addTo(map);
        marker.bindPopup("Camera focused here").openPopup();
    }
    map.flyTo(newLatLng, 18, { duration: 1 });
}

function isMarkerInRectangle(markerPosition, rectangleBounds) {
    const { lat, lng } = markerPosition;
    const { _southWest, _northEast } = rectangleBounds;
    return (
        lat >= _southWest.lat && lat <= _northEast.lat ||
        lng >= _southWest.lng && lng <= _northEast.lng
    );
}

function checkBounds() {
    const isInRectangle = isMarkerInRectangle({ lat, long }, bounds);
    console.log("Is marker inside rectangle?", isInRectangle);
    if (!isInRectangle) {
        notify();
    }
    console.log("Drawn Items:", drawnItems);
}

// Notification part
function notify() {
    navigator.serviceWorker.ready.then(registration => {
        registration.showNotification('Alert', {
            body: 'Device has left the predefined bounds.',
            icon: '/path/to/icon.png',
            tag: 'boundary-alert'
        });
    });
    console.log("Notification triggered");
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    } else {
        var notification = new Notification("Alert", {
            body: "Device has left the predefined bounds."
        });
    }
}

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

document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.querySelector('.toggle-btn');
    const sidebar = document.getElementById('mySidebar');
    const content = document.querySelector('.content');
    const nameOfDevice = document.querySelector('.name');

    nameOfDevice.addEventListener('click', function() {
        var newLatLng = [lat, long];
        if (marker) {
            marker.setLatLng(newLatLng).update();
        } else {
            marker = L.marker(newLatLng).addTo(map);
            marker.bindPopup("Camera focused here").openPopup();
        }
        map.flyTo(newLatLng, 18, { duration: 1 });
        marker.bindPopup("Camera focused here").openPopup();
    });

    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('closed');
        content.classList.toggle('expanded');
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('closed');
            content.classList.remove('expanded');
        }
    });
});

function editDevice(event) {
    event.preventDefault();
    const deviceElement = event.target.closest('.device');
    const name = deviceElement.querySelector('.name').textContent.trim();
    const description = deviceElement.querySelector('.description').textContent.trim();

    const newName = prompt('Enter new device name:', name);
    const newDescription = prompt('Enter new description:', description);

    if (newName !== null && newDescription !== null) {
        deviceElement.querySelector('.name').textContent = newName;
        deviceElement.querySelector('.description').textContent = newDescription;
        saveToDeviceStorage(newName, newDescription);
    }
}

function saveToDeviceStorage(name, description) {
    const deviceData = { name, description };
    localStorage.setItem('deviceData', JSON.stringify(deviceData));
}

function loadFromDeviceStorage() {
    const deviceDataJSON = localStorage.getItem('deviceData');
    if (deviceDataJSON) {
        return JSON.parse(deviceDataJSON);
    }
    return null;
}

const storedDeviceData = loadFromDeviceStorage();
if (storedDeviceData) {
    document.querySelector('.name').textContent = storedDeviceData.name;
    document.querySelector('.description').textContent = storedDeviceData.description;
}
