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

function Place(index, place_name, place_district, place_city, place_desc, lat, lon) {
    let image_url = "gallery.html#image_" + index;
    this.caption = `<div class="mapPopup">
                        <div class="popupTitle">
                            <h2 style="font-size:16px;">${place_name}, ${place_district}, ${place_city}</h2>
                        </div>
                        <a style="font-size: 13px;" href="${image_url}"}>View Image >></a>
                        <p style="margin-top: 7px; font-size: 15px;">${place_desc}</p>
                    </div>`;
    this.coords = [lon, lat];
    createButtons(place_city, lat, lon, 9);
}

function processData (data) {
    let places = [];
    for (let i = 0; i < data.features.length; i++) {
        let tmp = data.features[i];
        places.push(new Place(i + 1,
                                tmp.properties.name,
                                tmp.properties.district,
                                tmp.properties.city,
                                tmp.properties.desc,
                                tmp.geometry.coordinates[1],
                                tmp.geometry.coordinates[0]
        ));
    }
    places.forEach(place => createCustomIcon(place.caption, place.coords).addTo(map) );
}

let initZoom = {
    "lat": 31.204359154022054,
    "lon": 120.10623118282591,
    "zoom": 7
}

// Create map and add markers
const map = new maplibregl.Map({
    container: 'map', // container ID
    style: 'https://api.maptiler.com/maps/dataviz/style.json?key=aRyJfnj25CKYN2noi9Wt', // Your style URL
    center: [initZoom.lon, initZoom.lat], // Starting position [lng, lat]
    zoom: initZoom.zoom // Starting zoom level
});
createButtons("Default View", initZoom.lat, initZoom.lon, initZoom.zoom);

map.on("load", function() {
    fetch("map.geojson") // fetch data
    .then(data => { return data.json(); }) // check data
    .then(data => { processData(data); }) // process data
    .catch(function(error) {
        console.log("An error occurred: ", error);
    });
});