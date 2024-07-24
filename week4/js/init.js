function createCustomIcon (caption, latlng, color) {
    // Create a DOM element for the marker
    const el = document.createElement('div');
    el.style.backgroundImage = 'url(images/my-icon.png)';
    el.style.backgroundSize = '50px';
    el.style.width = '50px'; // iconSize width
    el.style.height = '50px'; // iconSize height
    el.style.display = 'block';
    el.style.borderRadius = '50%'; // Optional: makes the icon circular
    el.style.border = "2px solid";
    el.style.borderColor = color;
    el.style.backgroundColor = color;
    //el.style.boxShadow = '0px 0px 20px rgba(0, 0, 0, 0.5)'; // Optional: adds shadow effect
    
    return new maplibregl.Marker({element: el})
        .setLngLat(latlng)
        .setPopup(new maplibregl.Popup({ offset: 25 }) // Add popups
        .setHTML(caption));
}

function checkZipcode(zipcode) {
    if(zipcodes.has(zipcode)) {
        clusters[zipcode] = clusters[zipcode] + 1;
    }
    else {
        zipcodes.add(zipcode);
        clusters[zipcode] = 0;
    }
}

function Place(zipcode, freq, show_stories, exp, dest, lat, lon) {
    checkZipcode(zipcode);
    let offset = clusters[zipcode];
    lat = Number(lat) + 0.01 * offset * Math.sin(offset * Math.PI/4);
    lon = Number(lon) + 0.01 * offset * Math.cos(offset * Math.PI/4);

    let stories = "";
    if (show_stories === "Yes") {
        stories = `<p style="font-weight:bold;">Where do you usually ride BART to? (e.g. school, work, errands, etc.) <\p>
                    <p>${dest}</p>
                    <br>
                    <p style="font-weight:bold;">What has your experience with BART been like? </p>
                    <p>${exp}</p>`;
    }
    else {
        stories = "<p>No other info.</p>";
    }
    this.caption = `<div class="mapPopup">
                        <div class="popupTitle">
                            <h2 style="font-size:16px;">Response from ZIP ${zipcode}</h2>
                        </div>
                        <p style="margin-top: 7px;">${stories}</p>
                    </div>`;
    this.coords = [lon, lat];
    this.category_color = legend_colors[freq];
}

function processData(data) {
    let places = [];
    for (let i = 0; i < data.length; i++) {
        let tmp = data[i];
        let show = tmp["Do you live in one of the following counties in the San Francisco Bay Area: San Francisco, San Mateo, Alameda, Contra Costa, and Santa Clara ?"];        
        if (show === "Yes") {    
            places.push(new Place(tmp["What is your home ZIP code?"],
                                        tmp["In an average week, how often do you ride BART?"],
                                        tmp["Would you be comfortable with sharing your story publicly?"],
                                        tmp["What has your experience with BART been like?"],
                                        tmp["Where do you usually ride BART to? (e.g. school, work, errands, etc.)"],
                                        tmp.lat,
                                        tmp.lng
                ));
        }
    }
    places.forEach(place => createCustomIcon(place.caption, place.coords, place.category_color).addTo(map));
}

// Declare data structures
const legend_colors = {
    "I rarely/never use BART" : "#bfd7ed",
    "1-2 times a week": "#60a3d9",
    "3-4 times a week" : "#0074b7",
    "5 or more times a week": "#003b73",
}
  
const zipcodes = new Set();
let clusters = new Object();

// Declare variables
let mapZoom = {
    "lat": 37.589186744460186, 
    "lon": -122.11754792252312,
    "zoom": 9
}

// Create map and add markers
const map = new maplibregl.Map({
    container: 'map', // container ID
    style: 'https://api.maptiler.com/maps/dataviz/style.json?key=aRyJfnj25CKYN2noi9Wt', // Your style URL
    center: [mapZoom.lon, mapZoom.lat], // Starting position [lng, lat]
    zoom: mapZoom.zoom // Starting zoom level
});

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQplJGy7A8Z3Gu3MC6jLFxWHJvyId4_eYwHB2C0WRjDIVMSpj8b_X0R7sAOT0DaACs_PCk5EdbE4VUi/pub?output=csv"

// When the map is fully loaded, start adding GeoJSON data
map.on('load', function() {
    // Use PapaParse to fetch and parse the CSV data from a Google Forms spreadsheet URL
    Papa.parse(dataUrl, {
        download: true, // Tells PapaParse to fetch the CSV data from the URL
        header: true, // Assumes the first row of your CSV are column headers
        complete: function(results) {
            // Process the parsed data
            processData(results.data); // Use a new function to handle CSV data
        }
    });
});

let legend = `<div><p style="font-weight: bold; margin-bottom:10px;">Measure of Usage</p></div>`;
for (const [key, value] of Object.entries(legend_colors)) {
    legend = legend.concat(`<div class="legend-item">
                                <span class="dot" style="background-color:${value}"></span>
                                <p>${key}</p>
                            </div>`);
}
document.getElementById("legend").innerHTML = legend;
