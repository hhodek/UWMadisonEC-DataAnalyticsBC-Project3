# Import Dependencies
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import sqlite3
import json
import pandas as pd
import plotly.express as px

from flask import Flask, jsonify, render_template, Response, request

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/weather.sqlite")

# Reflect an existing database into a new model
Base = automap_base()

# Reflect the tables
Base.prepare(autoload_with=engine)

# Save references to each table
Dailey_weather = Base.classes.daily_weather
Events = Base.classes.events
Volcano = Base.classes.volcanos
Fire = Base.classes.fires
Tsunami = Base.classes.tsunamis
Tornado = Base.classes.tornados

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

# Home route
@app.route("/")
def Home():
    return render_template('index.html')

@app.route("/chart")
def chart():
    return render_template('chart.html')

@app.route("/get_columns", methods=["POST"])
def get_columns():
    endpoint = request.form.get("endpoint")
    
    if endpoint == "volcano":
        df = pd.read_sql("SELECT * FROM volcanos", engine)
    elif endpoint == "fire":
        df = pd.read_sql("SELECT * FROM fires", engine)
    elif endpoint == "tsunami":
        df = pd.read_sql("SELECT * FROM tsunamis", engine)
    elif endpoint == "tornado":
        df = pd.read_sql("SELECT * FROM tornados", engine)
    elif endpoint == "temp":
        df = pd.read_sql("SELECT * FROM daily_weather", engine)
    else:
        return jsonify({"error": "Invalid endpoint"})
    
    columns = df.columns.tolist()
    return jsonify({"columns": columns})

@app.route("/plot_chart", methods=["POST"])
def plot_chart():
    endpoint = request.form.get("endpoint")
    x_var = request.form.get("x_var")
    y_var = request.form.get("y_var")
    chart_type = request.form.get("chart_type")
    
    if endpoint == "volcano":
        df = pd.read_sql("SELECT * FROM volcanos", engine)
    elif endpoint == "fire":
        df = pd.read_sql("SELECT * FROM fires", engine)
    elif endpoint == "tsunami":
        df = pd.read_sql("SELECT * FROM tsunamis", engine)
    elif endpoint == "tornado":
        df = pd.read_sql("SELECT * FROM tornados", engine)
    elif endpoint == "temp":
        df = pd.read_sql("SELECT * FROM daily_weather", engine)
    else:
        return jsonify({"error": "Invalid endpoint"})
    
    if chart_type == "scatter":
        fig = px.scatter(df, x=x_var, y=y_var, title=f"{x_var} vs {y_var}")
    elif chart_type == "bar":
        fig = px.bar(df, x=x_var, y=y_var, title=f"{x_var} vs {y_var}")
    else:
        return jsonify({"error": "Invalid chart type"})
    
    graph_json = json.loads(fig.to_json())
    return jsonify(graph_json)


# Create Volcano Route
@app.route("/api/v1.0/volcano")
def volcano():

    session = Session(engine)

    results = session.query(Volcano.Name, Volcano.Country, Volcano.Latitude, Volcano.Longitude, \
                            Volcano.Elevation, Volcano.Type, Volcano.DEATHS)
    session.close()

    volcano_data = []
    for Name, Country, Latitude, Longitude, Elevation, Type, DEATHS in results:
        volcano_dict = {}
        volcano_dict["name"] = Name
        volcano_dict["country"] = Country
        volcano_dict["lat"] = Latitude
        volcano_dict["long"] = Longitude
        volcano_dict["elevation"] = Elevation
        volcano_dict["type"] = Type
        volcano_dict["deaths"] = DEATHS
        volcano_data.append(volcano_dict)


    return jsonify(volcano_data)

# Create Fire Route
@app.route("/api/v1.0/fire")
def fire():

    session = Session(engine)

    results = session.query(Fire.AcresBurned, Fire.Extinguished, Fire.Injuries, Fire.Latitude, \
                            Fire.Location, Fire.Longitude, Fire.Name)
    session.close()

    fire_data = []
    for AcresBurned, Extinguished, Injuries, Latitude, Location, Longitude, Name in results:
        fire_dict = {}
        fire_dict["acresBurned"] = AcresBurned
        fire_dict["extinguished"] = Extinguished
        fire_dict["injuries"] = Injuries
        fire_dict["lat"] = Latitude
        fire_dict["location"] = Location
        fire_dict["lon"] = Longitude
        fire_dict["name"] = Name
        fire_data.append(fire_dict)


    return jsonify(fire_data)

#Create Tsunami Route
@app.route("/api/v1.0/tsunami")
def tsunami():

    session = Session(engine)

    results = session.query(Tsunami.YEAR, Tsunami.LATITUDE, Tsunami.LONGITUDE, Tsunami.COUNTRY, \
                            Tsunami.CAUSE, Tsunami.EQ_MAGNITUDE)
    session.close()

    tsunami_data = []
    for YEAR, LATITUDE, LONGITUDE, COUNTRY, CAUSE, EQ_MAGNITUDE in results:
        tsunami_dict = {}
        tsunami_dict["year"] = YEAR
        tsunami_dict["lat"] = LATITUDE
        tsunami_dict["lon"] = LONGITUDE
        tsunami_dict["country"] = COUNTRY
        tsunami_dict["cause"] = CAUSE
        tsunami_dict["eqMag"] = EQ_MAGNITUDE
        tsunami_data.append(tsunami_dict)


    return jsonify(tsunami_data)

# Create Tornado Route
@app.route("/api/v1.0/tornado")
def tornado():

    session = Session(engine)

    results = session.query(Tornado.date, Tornado.mag, Tornado.inj, Tornado.fat, Tornado.slat, \
                            Tornado.slon, Tornado.len, Tornado.wid)
    session.close()

    tornado_data = []
    for date, mag, inj, fat, slat, slon, len, wid in results:
        tornado_dict = {}
        tornado_dict["date"] = date
        tornado_dict["mag"] = mag
        tornado_dict["inj"] = inj
        tornado_dict["fat"] = fat
        tornado_dict["lat"] = slat
        tornado_dict["lon"] = slon
        tornado_dict["len"] = len
        tornado_dict["wid"] = wid
        tornado_data.append(tornado_dict)


    return jsonify(tornado_data)

# Create Temp Route
@app.route("/api/v1.0/temp")
def temp():

    session = Session(engine)

    results = session.query(Dailey_weather.datetime, Dailey_weather.tempmax, Dailey_weather.tempmin, Dailey_weather.temp, Dailey_weather.humidity).all()

    session.close()

    temp_data = []
    for datetime, tempmax, tempmin, temp, humidity in results:
        temp_dict = {}
        temp_dict["date"] = datetime
        temp_dict["tempmax"] = tempmax
        temp_dict["tempmin"] = tempmin
        temp_dict["temp"] = temp
        temp_dict["humidity"] = humidity
        temp_data.append(temp_dict)


    return jsonify(temp_data)

# Create Precipitation Route
@app.route("/api/v1.0/precip")
def precip():

    session = Session(engine)

    results = session.query(Dailey_weather.precip, Dailey_weather.preciptype, Dailey_weather.windspeed, Dailey_weather.cloudcover, Dailey_weather.conditions).all()

    session.close()

    precip_data = []
    for precip, preciptype, windspeed, cloudcover, conditions in results:
        precip_dict = {}
        precip_dict["precip"] = precip
        precip_dict["preciptype"] = preciptype
        precip_dict["windspeed"] = windspeed
        precip_dict["cloudcover"] = cloudcover
        precip_dict["conditions"] = conditions
        precip_data.append(precip_dict)


    return jsonify(precip_data)

# Create Earthquakes Route
@app.route("/api/v1.0/earthquake")
def status():
    conn = sqlite3.connect('Resources/earthquake.sqlite')
    conn.row_factory = sqlite3.Row
    db = conn.cursor()
    rows = db.execute('SELECT * from earthquakes').fetchall()

    # conn.commit()
    conn.close()

    # json_format = [dict(ix) for ix in rows]
    geojson_features = []

    for data in rows:
        geojson_feature = {
            "type": "Feature",
            "properties" : {
                    'mag': data['properties/mag'],
                    'place': data['properties/place'],
                    'time': data['properties/time'],
                    'sig': data['properties/sig']
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            data["geometry/coordinates/0"], 
                            data["geometry/coordinates/1"], 
                            data["geometry/coordinates/2"] 
                        ]     
                }
        }
        geojson_features.append(geojson_feature)
    
    geojson = {
        "type": "FeatureCollection",
        "features": geojson_features
    }
    
    geojson_str = json.dumps(geojson)

    response = Response(geojson_str, content_type='application/geo+json')

    return response

# Run debugger
if __name__ == '__main__':
    app.run(debug=True)

