# Import Dependencies
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import sqlite3

from flask import Flask, jsonify, render_template

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///../Resources/weather.sqlite")

# Reflect an existing database into a new model
Base = automap_base()

# Reflect the tables
Base.prepare(autoload_with=engine)

# Save references to each table
Earthquakes = Base.classes.earthquakes

Dailey_weather = Base.classes.daily_weather

Events = Base.classes.events

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
    return (
        f"Events: /api/v1.0/events"
        f"<br>"
        f"Earthquakes: /api/v1.0/earthquakes"
        f"<br>"
        f"Temp: /api/v1.0/temp"
        f"<br>"
        f"Precipitation: /api/v1.0/precip"
    )

@app.route("/api/v1.0/events")
def events():

    session = Session(engine)

    results = session.query(Events.type, Events.description, Events.eventLatitude, Events.eventLongitude).all()

    session.close()

    event_data = []
    for type, description, eventLatitude, eventLongitude in results:
        event_dict = {}
        event_dict["type"] = type
        event_dict["description"] = description
        event_dict["lat"] = eventLatitude
        event_dict["long"] = eventLongitude
        event_data.append(event_dict)


    return jsonify(event_data)

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

@app.route("/api/v1.0/earthquakes")
def status():
    conn = sqlite3.connect('../Resources/earthquake.sqlite')
    conn.row_factory = sqlite3.Row
    db = conn.cursor()
    rows = db.execute('''
    SELECT * from earthquakes
    ''').fetchall()

    conn.commit()
    conn.close()

    json_format = [dict(ix) for ix in rows]
    geojson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                 "properties" : {
                    'mag': data['properties/mag'],
                    'place': data['properties/place'],
                    'time': data['properties/time'],
                    'sig': data['properties/sig']
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [data["geometry/coordinates/0"], data["geometry/coordinates/1"], data["geometry/coordinates/2"] ],     
                }
            } for data in json_format]
    }

    return jsonify(geojson)


# Run debugger
if __name__ == '__main__':
    app.run(debug=True)

