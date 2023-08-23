let earthquakeData = L.layerGroup();
let weatherType = L.layerGroup();

// Create the createMap function
function createMap() {

    // Open street map tilelayer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Add baseMap object
    let baseMap = {
        "Street": street
    };

    // Add overlayMaps object
    let overlayMaps = {
        "Earthquakes": earthquakeData,
        "Weather Type": weatherType
    };

    // Create a map object with default layers
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5, 
        layers: [street, earthquakeData]
    });

    // Create control layer
    L.control.layers(baseMap, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}

// Store API to variables
let earthquakeURL = "/api/v1.0/earthquakes";
let weatherURL = "/api/v1.0/events";

// Grab earthquake data with d3
d3.json(earthquakeURL).then((data) => {
    console.log(data);
    createFeatures(data)
});

// Create createFeatures function
function createFeatures() {

    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Place: ${feature.place}</h3><hr>
        <p><b>Magnitude: </b>${feature.mag}</p>`);
    }

    let earthquakes = L.geoJSON(earthquakeData, {

        onEachFeature: onEachFeature,

        pointToLayer: function(feature, latlng) {

            let markers = {
                color: "green",
                fillColor: "green",
                fillOpacity: 0.8,
                weight: 0.3, 
                radius: 500
            }

            return L.circle(latlng, markers);
        }
    }).addTo(earthquakeData);

    createMap(earthquakes);
}

// // grab weather data with d3
// d3.json(weatherURL).then((response) => {



// })