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
    center: [15.5994, -28.6731],
    zoom: 3
  });
  
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

function circleSize(magnitude) {
    return (magnitude*50000);
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
                //console.log(location);
                //console.log(magnitude);
                //if (location[0] !== 't' & location[1] !== 't') {
                L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
                    radius: circleSize(magnitude)
                    }).bindPopup("<h1>" + magnitude + "</h1>").addTo(myMap);
                //}// {
                    //radius: circleSize(magnitude)
                //})//.bindPopup(magnitude).addTo(myMap);  
            })

      }).catch(error => console.log(error));

    