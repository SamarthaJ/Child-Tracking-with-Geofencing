let lat = 12.99500;
let long = 75.3403;
var map = L.map('map').setView([lat, long], 13);
// tileLayer: OSM(open street map)
var tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = null;
//marker
// var marker = L.marker([lat, long], {color:'red'}).addTo(map);

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

$('.device').on('click', function() {
    // Assuming map is already initialized
    map.setView([12.99218, 75.3403], 15); // Set view to the specified location with a zoom level (15 in this case)

    // Create a marker at the specified location
    var marker = L.marker([12.99218, 75.3403]).addTo(map);
    marker.bindPopup("Camera focused here").openPopup(); // Optional popup message
});


