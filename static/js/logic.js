// Create a map object
const myMap = L.map("map", {
    center: [34.000, -100.000],
    zoom: 3
  });
  
// Standard light base tile
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }).addTo(myMap);

// Function that returns a generate size based on magnitude
function circleSize(magnitude) {
    return (magnitude*50000);
  }

// Color range courtesy of Colorbrewer.org "6-class YlOrRd"
function circleColor(depth) {
  return   depth > 90  ? '#a50f15' :
           depth > 70  ? '#fc9272' :
           depth > 50  ? '#fb6a4a' :
           depth > 30  ? '#feb24c' :
           depth > 10  ? '#fed976' :
                         '#ffffb2';            
}

// If wanting to draw tectonic plate boundaries
Promise.all(
        [
            d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"),
            //d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
        ]
      ).then( ([data]) => {

            // Parse out quake feature data
            let quakes = data.features;

            quakes.forEach(quake => {
                // Collect targeted info
                let magnitude = quake.properties.mag;
                let depth = quake.geometry.coordinates[2];
                let place = quake.properties.place; 
         
                // Create a circle at the given Lat Lng
                L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
                    radius: circleSize(magnitude),
                    fillOpacity: 0.75,
                    stroke: false,
                    fillColor: circleColor(depth),
                    }).bindPopup("Magnitude: " + magnitude + "<br>" + "Depth: " + depth + "<br>" + "Place: " + place).addTo(myMap);
            })

            // Set up the legend
            const legend = L.control({ position: "bottomright" });
            legend.onAdd = function() {
            const div = L.DomUtil.create("div", "info legend");
            const limits = ["<10","11-30","31-50","51-70","71-90", ">90"];
            // Colors match circleColor function()
            const colors = ['#ffffb2', '#fed976', '#feb24c', '#fb6a4a', '#fc9272', '#a50f15'];
            const labels = [];
            
            // Set title for the legend
            div.innerHTML = `<h3>Earthquake Depth (miles)</h3>`;

            // Build a list with the ranges and set their background color (removing default bullets)
            limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + ";list-style-type: none" + "\" >" + limits[index] + "</li>");
            });
            
            // Return  the result
            div.innerHTML += labels.join("");
            return div;
            };

            // Adding legend to the map
            legend.addTo(myMap);
      
      
}).catch(error => console.log(error));




    