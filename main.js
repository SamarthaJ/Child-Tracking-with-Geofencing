let lat = 12.99218;
let long = 75.3403;
var map = L.map('map').setView([lat, long], 13);
// tileLayer: OSM(open street map)
var tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//marker
var marker = L.marker([lat, long], {color:'red'}).addTo(map);

document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.querySelector('.toggle-btn');
    const sidebar = document.getElementById('mySidebar');
    const content = document.querySelector('.content');

    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('closed');
        content.classList.toggle('expanded');
    });
});
