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
    const hamberguer = document.querySelector('.hamberguer');
    const sidebar = document.querySelector('.sidebar');

    hamberguer.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });
});