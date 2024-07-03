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
            .setHTML(caption))
        .addTo(map); // Ensure the order is longitude, latitude
}

const map = new maplibregl.Map({
    container: 'map', // container ID
    style: 'https://api.maptiler.com/maps/dataviz/style.json?key=aRyJfnj25CKYN2noi9Wt', // Your style URL
    center: [120.10623118282591, 31.204359154022054], // Starting position [lng, lat]
    zoom: 7 // Starting zoom level
});

// Add a marker to the map
this.places = [
    {
        caption: '<div class="mapPopup">\
            <b>Zhujiajiao (Qingpu District), Shanghai</b>: \
            Super pretty water town with lots of historic architecture and yummy food.\
            </div>',
        coords: [121.05345698483865, 31.113630863554462]
    },
    {
        caption: '<div class="mapPopup">\
            <b>Leifeng Pagoda (Xihu District), Hangzhou</b>: \
            Originally a Buddhist tower that has been rebuilt over the years. \
            I sadly didn\'t have time to go see the view from the topmost level. :(\
            </div>',
        coords: [120.149705725118, 30.231512056688324]
    },
    {
        caption: '<div class="mapPopup">\
            <b>Classical Gardens of Suzhou, Suzhou</b>: \
            Collection of gardens. The lotus ponds were really pretty!\
            </div>',
        coords: [120.62852505160254, 31.372395575344928]
    },
    {
        caption: '<div class="mapPopup">\
            <b>Nanjing Fuzimiao, Nanjing</b>: \
            A Confucius Temple where the imperial exam was held. \
            There\'s a museum on the same street with a cheatsheet from the Qing Dynasty \
            on display. As expected, the handwriting is tiny, haha.\
            </div>',
        coords: [118.79184414016119, 32.02184144417682]
    },
]

for (let i = 0; i < 4; i++) {
    createCustomIcon(this.places[i].caption, this.places[i].coords)
}