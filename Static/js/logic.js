// Create each Layer Group
let earthquakeData = L.layerGroup();
let volcanoData = L.layerGroup();
let tornadoData = L.layerGroup();
let tsunamiData = L.layerGroup();
let fireData = L.layerGroup();

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
        "Volcanos": volcanoData,
        "Fires": fireData,
        "Tornados": tornadoData,
        "Tsunamis": tsunamiData
    };

    // Create a map object with default layers
    let myMap = L.map("map", {
        center: [41, 35],
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
let fireURL = "/api/v1.0/fire";
let tornadoURL = "/api/v1.0/torndao";
let tsunamiURL = "/api/v1.0/tsunami";
let volcanoURL = "/api/v1.0/volcano";

// Grab earthquake data with d3
d3.json(earthquakeURL).then((data) => {
    console.log(data);
    createFeatures(data.features)
});

// Create a createColor function using depth as the argument
// the higher the depth, the darker the color
function createColor(depth) {
    return depth > 90 ? '#bd0026' :
           depth <= 90 && depth > 70 ? '#f03b20' :
           depth <= 70 && depth > 50 ? '#fd8d3c' :
           depth <= 50 && depth > 30 ? '#feb24c' :
           depth <= 30 && depth > 10 ? '#fed976' :
                                       '#ffffb2';
}

// Create function to calculate the markersize
// The higher the magnitude, the bigger the marker
function markerSize(mag) {
    return mag * 20000
}

// Create createFeatures function
function createFeatures() {

    // Create the onEachFeature function within the previous function
    // Add a popup to each marker with the place, time, and sig 
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Place: ${feature.properties.place}</h3><hr>
         <p><b>Time: </b>${new Date(feature.properties.time)}</p>
         <p><b>Significance: </b>${feature.properties.sig}</p>
         <p><b>Magnitude: </b>${feature.properties.mag}</p>
         <p><b>Depth: </b>${feature.geometry.coordinates[2]}</p>`);
    }

    // create an earthquakes object that will hold the geoJSON data
    // Add the properties: onEachFeature and pointToLayer
    let earthquakes = L.geoJSON(earthquakeData, {

        // Attatch the function from before onto onEachLayer
        onEachFeature: onEachFeature,

        // PointToLayer allows circle markers
        pointToLayer: function(feature, latlng) {

            // Color is depth and radius is mag
            let markers = {
                color: "white",
                fillColor: createColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.8,
                weight: 0.3,
                radius: markerSize(feature.properties.mag)
            }
            // Return the marker as  L.circle with latlng as a param
            return L.circle(latlng, markers);
        }

     // Add to layerGroup
    }).addTo(earthquakeData);

     // Add earthquakes object to createMap function
    createMap(earthquakes);
}

// Grab volcano data with d3
d3.json(volcanoURL).then((data) => {

    let volcanos = data
    let volcanoMarkers = [];

    for (let i =0; i < volcanos.length; i++) {
        let volcano = volcanos[i];

        let volcanoMarker = L.circle([volcano.lat, volcano.lon], {
            color: "red",
            fillColor: "red",
            fillOpacity: 0.8,
            radius: 10000
        })
          .bindPopup(`<h3>Place: ${volcano.country}</h3><hr>
          <p><b>Name: </b>${volcano.name}</p>
          <p><b>Type: </b>${volcano.type}<p/>
          <p><b>Elevation: </b>${volcano.elevation}</p>
          <p><b>Deaths: </b>${volcano.deaths}</p>`)

        volcanoMarkers.push(volcanoMarker);
    }

}).addTo(volcanoData)

// Grab fire data with d3
d3.json(fireURL).then((data) => {

    let fires = data
    let fireMarkers = [];

    for (let i =0; i < fires.length; i++) {
        let fire = fires[i];

        let fireMarker = L.circle([fire.lat, fire.lon], {
            color: "red",
            fillColor: "red",
            fillOpacity: 0.8,
            radius: 10000
        })
          .bindPopup(`<h3>Place: ${fire.location}</h3><hr>
          <p><b>Name: </b>${fire.name}</p>
          <p><b>Acres Burned: </b>${fire.acresBurned}<p/>`)

        fireMarkers.push(fireMarker);
    }

}).addTo(fireData)

// Grab tornado data with d3
d3.json(tornadoURL).then((data) => {

    let tornados = data
    let tornadoMarkers = [];

    for (let i =0; i < tornados.length; i++) {
        let tornado = tornados[i];

        let tornadoMarker = L.circle([tornado.lat, tornado.lon], {
            color: "gray",
            fillColor: "gray",
            fillOpacity: 0.8,
            radius: 10000
        })
          .bindPopup(`<h3>Date: ${tornado.date}</h3><hr>
          <p><b>Magnitude: </b>${tornado.mag}</p>
          <p><b>Width of Tornado: </b>${tornado.wid}<p/>
          <p><b>Length of Tornado: </b>${tornado.len}</p>
          <p><b>Injuries: </b>${tornado.inj}</p>
          <p><b>Fatalities: </b>${tornado.fat}</p>`)

        tornadoMarkers.push(tornadoMarker);
    }

}).addTo(tornadoData)

// Grab tsunami data with d3
d3.json(tsunamiURL).then((data) => {

    let tsunamis = data
    let tsunamiMarkers = [];

    for (let i =0; i < tsunamis.length; i++) {
        let tsunami = tsunamis[i];

        let tsunamiMarker = L.circle([tsunami.lat, tsunami.lon], {
            color: "blue",
            fillColor: "blue",
            fillOpacity: 0.8,
            radius: 10000
        })
          .bindPopup(`<h3>Country: ${tsunami.country}</h3><hr>
          <p><b>Year: </b>${tsunami.year}</p>
          <p><b>Cause of Tsunami: </b>${tsunami.cause}<p/>`)

        tsunamiMarkers.push(tsunamiMarker);
    }

}).addTo(tsunamiData) 