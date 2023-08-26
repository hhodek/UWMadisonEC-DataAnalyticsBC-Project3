// Create each Layer Group
let earthquakeData = new L.layerGroup();
let volcanoData = new L.layerGroup();
let tornadoData = new L.layerGroup();
let fireData = new L.layerGroup();
let tsunamiData = new L.layerGroup();

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
    "Tornados": tornadoData,
    "Fires": fireData,
    "Tsunamis": tsunamiData
};

// Create a map object with default layers
let myMap = L.map("map", {
    center: [27.133702, -95.077545],
    zoom: 3.5, 
    layers: [street, earthquakeData]
});

// Create control layer
L.control.layers(baseMap, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// Store API to variables
let earthquakeURL = "/api/v1.0/earthquake";
let fireURL = "/api/v1.0/fire";
let tornadoURL = "/api/v1.0/tornado";
let tsunamiURL = "/api/v1.0/tsunami";
let volcanoURL = "/api/v1.0/volcano";

// Create a createColor function using depth as the argument
function createEarthquakeColor(depth) {
    return depth > 90 ? '#006837' :
           depth <= 90 && depth > 70 ? '#31a354' :
           depth <= 70 && depth > 50 ? '#78c679' :
           depth <= 50 && depth > 30 ? '#addd8e' :
           depth <= 30 && depth > 10 ? '#d9f0a3' :
                                       '#ffffcc';
}
// Create function to calculate the markersize
function markerSizeEarthquake(mag) {
    return mag * 20000
}
// Define the onEachFeature function for earthquake markers
function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Place: ${feature.properties.place}</h3><hr>  
         <p><b>Time: </b>${new Date(feature.properties.time)}</p>
         <p><b>Significance: </b>${feature.properties.sig}</p>
         <p><b>Magnitude: </b>${feature.properties.mag}</p>
         <p><b>Depth: </b>${feature.geometry.coordinates[2]}</p>`);
} 

// Grab the earthquake data with D3 and add to the earthquakeLayer
d3.json(earthquakeURL).then((data) => {
    console.log(data);

    // Create an earthquakes object that will hold the geoJSON data
    // Add the properties: onEachFeature and pointToLayer
    const earthquakeMarkers = [];
    const earthquakeLayer = L.geoJSON(data, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            const marker = L.circle(latlng, {
                color: "white",
                fillColor: createEarthquakeColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.8,
                weight: 0.3,
                radius: markerSizeEarthquake(feature.properties.mag),
                depth: feature.geometry.coordinates[2], // Store depth for animation
                mag: feature.properties.mag // Store magnitude for animation
            }).addTo(earthquakeData);

            marker.on('click', function () {
                myMap.setView(marker.getLatLng(), 7); // Add zoom to each marker when clicked
            });

            earthquakeMarkers.push(marker); // Store the marker in the array
            animateMarker(marker); // Start animation for this marker
            return marker;
        }
    }).addTo(earthquakeData);


});

// Define a function for earthquake marker animation
function animateMarker(marker) {
    let animationStep = 0;

    setInterval(() => {
        animationStep = (animationStep + 0.1) % 2; // Varies from 0 to 2

        // Modify marker properties based on animationStep
        marker.setRadius(markerSizeEarthquake(marker.options.mag) * (1 + animationStep * 0.2));
        marker.setStyle({
            fillOpacity: 0.5 + animationStep * 0.2,
            color: createEarthquakeColor(marker.options.depth),
            fillColor: createEarthquakeColor(marker.options.depth)
        });
    }, 100); // Adjust the interval for desired animation speed
}

// Create the colors for the volcano markers
function createVolcanoColor(elevation) {
    return elevation > 5700 ? '#bd0026' :
    elevation <= 5700 && elevation > 4750 ? '#f03b20' :
    elevation <= 4750 && elevation > 3800 ? '#fd8d3c' :
    elevation <= 3800 && elevation > 2850 ? '#feb24c' :
    elevation <= 2850 && elevation > 1900 ? '#fed976' :
                                          '#ffffb2';
}

// Create the size for each volcano marker
function markerSizeVolcano(elevation) {
    if (typeof elevation !== 'number' || isNaN(elevation)) {
        return 10000; // Set a default value
    }
    return elevation * 50;
}

// Define a function for volcano marker animation
function animateVolcanoMarker(marker) {
    let animationStep = 0;

    setInterval(() => {
        animationStep = (animationStep + 0.1) % 2; // Varies from 0 to 2

        // Modify marker properties based on animationStep
        marker.setRadius(markerSizeVolcano(marker.options.elevation) * (1 + animationStep * 0.2));
        marker.setStyle({
            fillOpacity: 0.5 + animationStep * 0.2,
            color: createVolcanoColor(marker.options.elevation),
            fillColor: createVolcanoColor(marker.options.elevation)
        });
    }, 100); // Adjust the interval for desired animation speed
}

// Grab volcano data with d3
d3.json(volcanoURL).then((data) => {
    console.log(data);

    for (let i = 0; i < data.length; i++) {
        let volcano = data[i];

        const marker = L.circle([volcano.lat, volcano.long], {
            color: createVolcanoColor(volcano.elevation),
            fillColor: createVolcanoColor(volcano.elevation),
            fillOpacity: 0.8,
            radius: markerSizeVolcano(volcano.elevation),
            elevation: volcano.elevation
        }).bindPopup(`<h3>Place: ${volcano.country}</h3><hr>
            <p><b>Name: </b>${volcano.name}</p>
            <p><b>Type: </b>${volcano.type}<p/>
            <p><b>Elevation: </b>${volcano.elevation}</p>
            <p><b>Deaths: </b>${volcano.deaths}</p>`);

        marker.on('click', function () {
            myMap.setView(marker.getLatLng(), 5); // Add zoom to each marker when clicked
        });

        marker.addTo(volcanoData);;
        animateVolcanoMarker(marker);
    }
});

// Create the colors for the tornado markers
function createTornadoColor(mag) {
    return mag > 4 ? '#045a8d' :
    mag <= 4 && mag > 3 ? '#2b8cbe' :
    mag <= 3 && mag > 2 ? '#74a9cf' :
    mag <= 2 && mag > 1 ? '#a6bddb' :
    mag <= 1 && mag > 0 ? '#d0d1e6' :
                          '#f1eef6';
}

// Create the size for the tornado markers
function markerSizeTornado(mag) {
    if (typeof mag !== 'number' || isNaN(mag) || mag < 0) {
        return 10000; // Set a default value
    }
    return mag * 20000;
}

// Define a function for tornado marker animation
function animateTornadoMarker(marker) {
    let animationStep = 0;

    setInterval(() => {
        animationStep = (animationStep + 0.1) % 2; // Varies from 0 to 2

        // Modify marker properties based on animationStep
        marker.setRadius(markerSizeTornado(marker.options.mag) * (1 + animationStep * 0.2));
        marker.setStyle({
            fillOpacity: 0.5 + animationStep * 0.2,
            color: createTornadoColor(marker.options.mag),
            fillColor: createTornadoColor(marker.options.mag)
        });
    }, 100); // Adjust the interval for desired animation speed
}

// Grab tornado data with d3
d3.json(tornadoURL).then((data) => {
    console.log(data);

    for (let i = 0; i < data.length; i++) {
        let tornado = data[i];

        const marker = L.circle([tornado.lat, tornado.lon], {
            color: createTornadoColor(tornado.mag),
            fillColor: createTornadoColor(tornado.mag),
            fillOpacity: 0.8,
            radius: markerSizeTornado(tornado.mag),
            mag: tornado.mag // Store magnitude for animation
        }).bindPopup(`<h3>Date: ${tornado.date}</h3><hr>
            <p><b>Magnitude: </b>${tornado.mag}</p>
            <p><b>Width of Tornado: </b>${tornado.wid}<p/>
            <p><b>Length of Tornado: </b>${tornado.len}</p>
            <p><b>Injuries: </b>${tornado.inj}</p>
            <p><b>Fatalities: </b>${tornado.fat}</p>`).addTo(tornadoData);

        marker.on('click', function () {
            myMap.setView(marker.getLatLng(), 7); // Add zoom to each marker when clicked
        });

        animateTornadoMarker(marker); // Start animation for this marker
    }
});

// Create the colors for fire markers
function createFireColor(acres) {
    return acres > 400000 ? '#a50f15' :
           acres <= 400000 && acres > 300000 ? '#de2d26' :
           acres <= 300000 && acres > 200000 ? '#fb6a4a' :
           acres <= 200000 && acres > 100000 ? '#fc9272' :
           acres <= 100000 && acres > 1000 ? '#fcbba1' :
                                       '#fee5d9';
}

// Create the size for the fire markers
function markerSizeFire(acre) {
    if (typeof acre !== 'number' || isNaN(acre)) {
        return 10000; // Set a default value
    }
    return acre * 0.5;
}

// Define a function for fire marker animation
function animateFireMarker(marker) {
    let animationStep = 0;

    setInterval(() => {
        animationStep = (animationStep + 0.1) % 2; // Varies from 0 to 2

        // Modify marker properties based on animationStep
        marker.setRadius(markerSizeFire(marker.options.acresBurned) * (1 + animationStep * 0.2));
        marker.setStyle({
            fillOpacity: 0.5 + animationStep * 0.2,
            color: createFireColor(marker.options.acresBurned),
            fillColor: createFireColor(marker.options.acresBurned)
        });
    }, 100); // Adjust the interval for desired animation speed
}

// Grab fire data with d3
d3.json(fireURL).then((data) => {
    console.log(data);

    let fireMarkers = L.markerClusterGroup(); // Create a cluster group for fire markers

    for (let i = 0; i < data.length; i++) {
        let fire = data[i];

        const marker = L.circle([fire.lat, fire.lon], {
            color: createFireColor(fire.acresBurned),
            fillColor: createFireColor(fire.acresBurned),
            fillOpacity: 0.8,
            radius: markerSizeFire(fire.acresBurned),
            acresBurned: fire.acresBurned // Store acresBurned for animation
        }).bindPopup(`<h3>Place: ${fire.location}</h3><hr>
        <p><b>Name: </b>${fire.name}</p>
        <p><b>Acres Burned: </b>${fire.acresBurned}<p/>`);

        fireMarkers.addLayer(marker); // Add marker to the cluster group
        animateFireMarker(marker); // Start animation for this marker
    }

    fireMarkers.addTo(fireData); // Add the cluster group to the fireData layer group
});

// Create the colors for the tsunami markers
function createTsunamiColor(eqmag) {
    return eqmag > 7.5 ? '#253494' :
    eqmag <= 7.5 && eqmag > 7.2 ? '#2c7fb8' :
    eqmag <= 7.2 && eqmag > 6.8 ? '#41b6c4' :
    eqmag <= 6.8 && eqmag > 6.4 ? '#7fcdbb' :
    eqmag <= 6.4 && eqmag > 6 ? '#c7e9b4' :
                          '#ffffcc';
}

// Create the size for the tsunami markers
function markerSizeTsunami(eqmag) {
    if (eqmag == isNaN(eqmag)) {
        return 10000; // Set a default value
    }
    return eqmag * 30000;
}

// Define a function for tsunami marker animation
function animateTsunamiMarker(marker) {
    let animationStep = 0;

    setInterval(() => {
        animationStep = (animationStep + 0.1) % 2; // Varies from 0 to 2

        // Modify marker properties based on animationStep
        marker.setRadius(markerSizeTsunami(marker.options.eqMag) * (1 + animationStep * 0.2));
        marker.setStyle({
            fillOpacity: 0.5 + animationStep * 0.2,
            color: createTsunamiColor(marker.options.eqMag),
            fillColor: createTsunamiColor(marker.options.eqMag)
        });
    }, 100); // Adjust the interval for desired animation speed
}

// Grab tsunami data with d3
d3.json(tsunamiURL).then((data) => {
    console.log(data);

    for (let i = 0; i < data.length; i++) {
        let tsunami = data[i];

        const marker = L.circle([tsunami.lat, tsunami.lon], {
            color: createTsunamiColor(tsunami.eqMag),
            fillColor: createTsunamiColor(tsunami.eqMag),
            fillOpacity: 0.8,
            radius: markerSizeTsunami(tsunami.eqMag),
            eqMag: tsunami.eqMag
        }).bindPopup(`<h3>Country: ${tsunami.country}</h3><hr>
            <p><b>Year: </b>${tsunami.year}</p>
            <p><b>Cause of Tsunami: </b>${tsunami.cause}<p/> 
            <p><b>Earthquake Magnitude: </b>${tsunami.eqMag}</p>`);

        marker.on('click', function () {
            myMap.setView(marker.getLatLng(), 6); // Add zoom to each marker when clicked
        });

        marker.addTo(tsunamiData); // Add marker to the tsunamiData
        animateTsunamiMarker(marker); // Start animation for this marker
    }
});




