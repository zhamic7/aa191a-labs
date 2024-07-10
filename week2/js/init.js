function createButtons(label, lat, lon, zoom){
    const newButton = document.createElement("button"); 
    newButton.className = "zoom";
    //newButton.id = "button" + label; 
    newButton.innerHTML = `<p class="zoom-label">${label.toUpperCase()}</p>`; 
    newButton.setAttribute("lat", lat); 
    newButton.setAttribute("lon", lon); 
    newButton.addEventListener('click', function(){
        map.flyTo({
            center: [lon, lat], 
            zoom: zoom,
        });
    });
    document.getElementById("buttons").appendChild(newButton); 
}

function createCustomIcon (caption, latlng) {
    // Create a DOM element for the marker
    const el = document.createElement('div');
    el.style.backgroundImage = 'url(images/my-icon.png)';
    el.style.backgroundSize = '50px';
    el.style.width = '50px'; // iconSize width
    el.style.height = '50px'; // iconSize height
    el.style.display = 'block';
    el.style.borderRadius = '50%'; // Optional: makes the icon circular
    el.style.border = "2px solid #ec3c63";
    //el.style.boxShadow = '0px 0px 20px rgba(0, 0, 0, 0.5)'; // Optional: adds shadow effect
    
    return new maplibregl.Marker({element: el})
        .setLngLat(latlng)
        .setPopup(new maplibregl.Popup({ offset: 25 }) // Add popups
        .setHTML(caption));
}

function Place(place_name, place_district, place_city, place_desc, lat, lon) {
    this.caption = `<div class="mapPopup">
                        <div class="popupTitle">
                            <h2 style="font-size:16px;">${place_name}, ${place_district}, ${place_city}</h2>
                        </div>
                        <p style="font-size:15px;">${place_desc}</p>
                    </div>`;
    this.coords = [lon, lat];
    createButtons(place_city, lat, lon, 9);
}

const places = [
    new Place(
        'Zhujiajiao',
        'Qingpu District',
        'Shanghai', 
        'Super pretty water town with lots of historic architecture and yummy food.',
        31.113630863554462,
        121.05345698483865
    ),
    new Place(
        'Leifeng Pagoda',
        'Xihu District',
        'Hangzhou',
        'Originally a Buddhist tower that has been rebuilt over the years. \
            I sadly didn\'t have time to go see the view from the topmost level.',
        30.231512056688324,
        120.149705725118
    ),
    new Place(
        'Classical Gardens of Suzhou',
        'Gusu District',
        'Suzhou',
        'Collection of gardens. The lotus ponds were really pretty!',
        31.372395575344928,
        120.62852505160254
    ),
    new Place(
        'Nanjing Fuzimiao',
        'Qinhuai District',
        'Nanjing',
        'A Confucius Temple where the imperial exam was held. \
            There\'s a museum on the same street with a cheatsheet from the Qing Dynasty \
            on display. As expected, the handwriting is tiny, haha.',
        32.02184144417682,
        118.79184414016119
    ),
]

// Create map and add markers
const map = new maplibregl.Map({
    container: 'map', // container ID
    style: 'https://api.maptiler.com/maps/dataviz/style.json?key=aRyJfnj25CKYN2noi9Wt', // Your style URL
    center: [120.10623118282591, 31.204359154022054], // Starting position [lng, lat]
    zoom: 7 // Starting zoom level
});
createButtons("Default View", 31.204359154022054, 120.10623118282591, 7);

let markers = [];
for (let i = 0; i < places.length; i++) {
    markers.push(createCustomIcon(places[i].caption, places[i].coords));
}
markers.forEach((marker) => marker.addTo(map)); // Ensure the order is longitude, latitude