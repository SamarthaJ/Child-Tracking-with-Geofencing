let lat = 12.99;
let long = 75.34;

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
    var type = e.layerType;
    var layer = e.layer;
    console.log(e)
    var boundary= e.layer._bounds;
    bounds = JSON.stringify(boundary);
    bounds = JSON.parse(bounds);
    // console.log(bounds);
    drawnItems.addLayer(layer);
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

    console.log(_southWest);

    return (
        lat >= _southWest.lat.toFixed(5) &&
        lat <= _northEast.lat.toFixed(5) ||
        lng >= _southWest.lng.toFixed(5) &&
        lng <= _northEast.lng.toFixed(5)
    );
}

// Example usage
function check(){
    const isInRectangle = isMarkerInRectangle({lat,long}, bounds);
    // alert("Is marker inside rectangle?", isInRectangle);
    console.log("Is marker inside rectangle?", isInRectangle);
    console.log("Drawn Items: ",drawnItems);
}



function edit(event){
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
        var newLatLng = [12.99218, 75.3403]; // New marker position
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


// // Create a div to display the coordinates
// var coordinatesDiv = document.getElementById('coordinates');

// // Add mousemove event listener to the map
// map.on('mousemove', function(e) {
//     var latlng = e.latlng;
//     coordinatesDiv.innerHTML = `Latitude: ${latlng.lat.toFixed(5)}, Longitude: ${latlng.lng.toFixed(5)}`;
// });