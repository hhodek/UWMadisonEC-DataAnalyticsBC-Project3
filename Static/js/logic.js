// Create each Layer Group
// let earthquakeData = new L.layerGroup();
let volcanoData = new L.layerGroup();
let tornadoData = new L.layerGroup();
let fireData = new L.layerGroup();
let tsunamiData = new L.layerGroup();

// Create the createMap function


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
    // "Earthquakes": earthquakeData,
    "Volcanos": volcanoData,
    "Tornados": tornadoData,
    "Fires": fireData,
    "Tsunamis": tsunamiData
};

// Create a map object with default layers
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5, 
    layers: [street, volcanoData]
});

// Create control layer
L.control.layers(baseMap, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// Store API to variables
// let earthquakeURL = "/api/v1.0/earthquake";
let fireURL = "/api/v1.0/fire";
let tornadoURL = "/api/v1.0/tornado";
let tsunamiURL = "/api/v1.0/tsunami";
let volcanoURL = "/api/v1.0/volcano";

// Grab volcano data with d3
d3.json(volcanoURL).then((data) => {

    console.log(data);
    for (let i =0; i < data.length; i++) {
        let volcano = data[i];

        L.circle([volcano.lat, volcano.long], {
            color: "red",
            fillColor: "red",
            fillOpacity: 0.8,
            radius: 10000
        })
        .bindPopup(`<h3>Place: ${volcano.country}</h3><hr>
        <p><b>Name: </b>${volcano.name}</p>
        <p><b>Type: </b>${volcano.type}<p/>
        <p><b>Elevation: </b>${volcano.elevation}</p>
        <p><b>Deaths: </b>${volcano.deaths}</p>`).addTo(volcanoData)

    }

});

// Grab tornado data with d3
d3.json(tornadoURL).then((data) => {

    console.log(data);

    for (let i =0; i < data.length; i++) {
        let tornado = data[i];

        L.circle([tornado.lat, tornado.lon], {
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
          <p><b>Fatalities: </b>${tornado.fat}</p>`).addTo(tornadoData)
    }
});

// Grab fire data with d3
d3.json(fireURL).then((data) => {

    console.log(data);

    for (let i =0; i < data.length; i++) {
        let fire = data[i];

        L.circle([fire.lat, fire.lon], {
            color: "red",
            fillColor: "red",
            fillOpacity: 0.8,
            radius: 10000
        })
          .bindPopup(`<h3>Place: ${fire.location}</h3><hr>
          <p><b>Name: </b>${fire.name}</p>
          <p><b>Acres Burned: </b>${fire.acresBurned}<p/>`).addTo(fireData)
    }    
});


// Grab tsunami data with d3
d3.json(tsunamiURL).then((data) => {

    console.log(data);
   for (let i =0; i < data.length; i++) {
        let tsunami = data[i];

        L.circle([tsunami.lat, tsunami.lon], {
            color: "blue",
            fillColor: "blue",
            fillOpacity: 0.8,
            radius: 10000
        })
          .bindPopup(`<h3>Country: ${tsunami.country}</h3><hr>
          <p><b>Year: </b>${tsunami.year}</p>
          <p><b>Cause of Tsunami: </b>${tsunami.cause}<p/>`).addTo(tsunamiData)
    }
});