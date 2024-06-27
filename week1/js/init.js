// Initialize the map
const map = new maplibregl.Map({
    container: 'map', // container ID
    style: 'https://api.maptiler.com/maps/streets/style.json?key=Oo1CDYXThbnZ95OKpxHl', // Your style URL
    center: [-121.9622, 37.5489], // Starting position [lng, lat]
    zoom: 15 // Starting zoom level
});

// Add a marker to the map
new maplibregl.Marker()
    .setLngLat([-121.9622, 37.5489])
    .setPopup(new maplibregl.Popup({ offset: 25 }) // Add popups
        .setHTML('Lake Elizabeth -- the local lake + city park!'))
    .addTo(map);