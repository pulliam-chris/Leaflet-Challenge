/* NOTE FOR STEP 2
/  You can use the javascript Promise.all function to make two d3.json calls, 
/  and your then function will not run until all data has been retreived.
/
/ ----------------------------------------
/  Promise.all(
/    [
/        d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"),
/        d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
/    ]
/  ).then( ([data,platedata]) => {
/
/        console.log("earthquakes", data)
/        console.log("tectonic plates", platedata)
/
/    }).catch(e => console.warn(e));
/
/ ----------------------------------------*/

// Create a map object
const myMap = L.map("map", {
    center: [34.000, -100.000],
    zoom: 3
  });
  
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }).addTo(myMap);

function circleSize(magnitude) {
    return (magnitude*50000);
  }

function circleColor(depth) {
  return   depth > 90  ? '#a50f15' :
           depth > 70  ? '#fc9272' :
           depth > 50  ? '#fb6a4a' :
           depth > 30  ? '#feb24c' :
           depth > 10  ? '#fed976' :
                         '#ffffb2';            
}

Promise.all(
        [
            d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"),
            //d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
        ]
      ).then( ([data]) => {
    
            //console.log(data.features)
            //console.log("tectonic plates", platedata)

            let quakes = data.features;

            quakes.forEach(quake => {
                //let location = [quake.geometry.coordinates[0], quake.geometry.coordinates[1]];
                let magnitude = quake.properties.mag;
                let depth = quake.geometry.coordinates[2];
                let place = quake.properties.place; 
                //console.log(location);
                //console.log(magnitude);
                //if (location[0] !== 't' & location[1] !== 't') {
                L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
                    radius: circleSize(magnitude),
                    fillOpacity: 0.75,
                    //color: "black", //circleColor(depth),
                    stroke: false,
                    fillColor: circleColor(depth),
                    }).bindPopup("Magnitude: " + magnitude + "<br>" + "Depth: " + depth + "<br>" + "Place: " + place).addTo(myMap);
            })

            // Set up the legend
            const legend = L.control({ position: "bottomright" });
            legend.onAdd = function() {
            const div = L.DomUtil.create("div", "info legend");
            const limits = ["<10","11-30","31-50","51-70","71-90", ">90"];
            const colors = ['#ffffb2', '#fed976', '#feb24c', '#fb6a4a', '#fc9272', '#a50f15'];
            const labels = [];

            // Add min & max
            //const legendInfo = `<h3>Earthquake Depth</h3>
            //<div class="labels">
            //<div class="min"> ${limits[0]} </div>
            //<div class="max"> ${limits[limits.length - 1]} </div>
            //</div>`;

            div.innerHTML = `<h3>Earthquake Depth (miles)</h3>`;

            limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + ";list-style-type: none" + "\" >" + limits[index] + "</li>");
            //labels.push("<li style=\"background-color: " + colors[index] + "\" list-style-type: none >" + limits[index] + "</li>");
            //list-style-type: none;
            });
            
            div.innerHTML += labels.join("");
            return div;
            };

            // Adding legend to the map
            legend.addTo(myMap);
      
      
}).catch(error => console.log(error));




    