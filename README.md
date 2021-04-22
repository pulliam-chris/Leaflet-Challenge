# Leaflet-Challenge
Using Leaflet to visualize USGS Earthquake data

**Primary files**
* static\js\logic.js - This file places the API call to collected earthquake data for the previous 7 days.  The data is then parsed to collect the coordinates, depth, magnitude, and place description.  

  * Circles are placed based on the recieved lat, lng coordinates.
  * The circles relative size represents the magnitude and the color shading represents the quake's depth in miles.
  * A popup is bound to list the magnitude, depth, and place descriptiion.
  * HTML is used to create a legend in the bottom right of the image to articulate the depth color scheme. 

* index.html - Only used to display the map at 100% of height.

![USGS - Earthquake Activity Past 7 Days](images/Leaflet_USGS.png)!

