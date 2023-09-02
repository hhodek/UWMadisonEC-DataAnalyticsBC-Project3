# Natural Disasters

In this project, we will create a webpage showcasing an interactive map to see different types of natural  
disasters in different areas of the United States and the world. Each layer will hold data for each disaster  
type (earthquakes, fires, tornados, volcanos, and tsunamis) with animation and color/sizing for each marker. 

---

There is also an interactive graph to explore volcano variables and a "/chart" page with the full natural disaster variable interactive graph
which includes a dropdown to select which natural disaster to compare variables from. *Adding this page messed up the volcano data for the volcano chart so working on that and other fixes*

---



## About 

This project is split up into three sections:  
  * Data and Delivery
  * Back End
  * Visualizations

Although it is split up into three sections, each section should flow into the next one. You should find your
data and save it to a database. With that database, you should read in your data with Python `Flask` and create
routes for each data table. Finally, create a map to showcase your data to be more eye appealing and interactive.

---

## Getting Started

1. One person should create a new repository called `Project 3`  
2. Add each person as a contributor to the repository  
3. Each person should clone the new repo to your computer  
4. Create a HTML, JS, CSS, and Python file to start off with  
5. Continue to commit your work and push to GitHub  

---

## Usage

### Data and Delivery

Find data related to natural disasters (csv, json, etc) and save them to a database. All your data should have  
at least 100 unique records and the project is powered by a Python Flask API. Your repo should contain:    

  * HTML/CSS
  * JavaScript
  * the chosen database

### Back End

The page created to showcase data visualizations runs without error and a JS library **not covered in class**  
is used. Lastly, the project uses one of the following designs:  

  * A Leaflet or Plotly chart built from data gathered through web scraping.  
  * A dashboard page with multiple charts that all reference the same data.

**Animation**: A JS library that we found was one for marker animation. This [link](https://github.com/openplans/Leaflet.AnimatedMarker)  
shows how to set up and execute this function.  

### Visualizations

A minimum of three unique views present the data with multiple interactions included. Examples of interactions are  
dropdowns, filters, or zoom features. The visuals are clear and easy to read and the data story is easy to inerpret  
for users all all levels.

---

## Contributors

Hannah Hodek  
Peter Xiong  
Kailey Carbone  

---

## Links

  * [favicon](https://www.iconarchive.com/show/ios7-style-icons-by-iynque/Weather-icon.html)
  * [Flask geoJSON](https://stackoverflow.com/questions/53326935/flask-json-to-geojson-incorrect-format-when-using-jsonify)
  * [Animation](https://github.com/openplans/Leaflet.AnimatedMarker)
  * [Color Brewer](https://colorbrewer2.org/#type=sequential&scheme=YlOrRd&n=3)
  * [Import CSV into sqlite](https://www.sqlitetutorial.net/sqlite-import-csv/#:~:text=First%2C%20from%20the%20menu%20choose,shown%20in%20the%20picture%20below.)
  * [How to add favicon](https://www.w3schools.com/howto/howto_html_favicon.asp#:~:text=To%20add%20a%20favicon%20to,is%20%22favicon.ico%22.)
  * [Leaflet](https://leafletjs.com/)


  
