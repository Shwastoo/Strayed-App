import React, { Component, useEffect } from "react";
//import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

class NewAnimal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      desc: "",
      status: "",
      owner: this.props.username,
      photo: null,
      photo2: null,
      photo3: null,
      species: "",
      breed: "",
      gender: "",
      colors: "",
      location: "",
      submittedAnimal: null,
      latitude: 0,
      longitude: 0,
      marker: null,
      address: "",
    };
  }

  handleLocationChange = (lat, lng) => {
    this.setState({
      latitude: lat,
      longitude: lng,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    var formData = new FormData();
    formData.append("title", this.state.title);
    formData.append("desc", this.state.desc);
    formData.append("status", this.state.status);
    formData.append("owner", this.state.owner);
    formData.append("photo", this.state.photo);
    formData.append("photo2", this.state.photo2);
    formData.append("photo3", this.state.photo3);
    formData.append("gender", this.state.gender);
    formData.append("species", this.state.species);
    formData.append("breed", this.state.breed);
    formData.append("colors", this.state.colors);
    formData.append(
      "location",
      `${this.state.latitude}, ${this.state.longitude}`
    );
    formData.append("location_name", this.state.address);
    this.props.addAnimal(formData);
    /*
    axios
      .post("/api/animals/", formData)
      .then((response) => {
        this.setState({ submittedAnimal: response.data });
      })
      .catch((error) => {
        console.error("Błąd dodawania ogłoszenia:", error);
      });
      */
  };

  componentDidMount() {
    if (this.state.owner) {
      window.scrollTo(0, 0);
      this.initMap();
    }
  }

  initMap() {
    const map = L.map("map").setView([50.061, 19.936], 13);
    this.map = map;

    L.Marker.prototype.options.icon = DefaultIcon;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const searchControl = new GeoSearchControl({
      style: "button",
      provider: new OpenStreetMapProvider(),
      marker: DefaultIcon,
      notFoundMessage: "Przepraszamy, nie udało się znaleźć tego adresu.",
    });

    this.map.addControl(searchControl);

    const removeMarkers = () => {
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          this.map.removeLayer(layer);
        }
      });
    };

    this.map.addEventListener("geosearch/showlocation", (e) => {
      removeMarkers();

      if (e.location && e.location.raw) {
        const locationData = e.location.raw;

        const latitude = parseFloat(locationData.lat);
        const longitude = parseFloat(locationData.lon);

        if (!isNaN(latitude) && !isNaN(longitude)) {
          const latLng = L.latLng(latitude, longitude);
          const marker = L.marker(latLng).addTo(this.map);

          this.handleLocationChange(latitude, longitude);

          this.setState({
            marker: marker,
          });

          this.reverseGeocodeAndAddPopup(latLng);
        } else {
          console.error("Invalid latitude or longitude:", locationData);
        }
      } else {
        console.error("Invalid location:", e.location);
      }
    });

    this.mapClickHandler = (e) => {
      removeMarkers();

      const { lat, lng } = e.latlng;
      const marker = L.marker(e.latlng).addTo(this.map);

      this.handleLocationChange(lat, lng);

      this.setState({
        marker: marker,
      });

      this.reverseGeocodeAndAddPopup(e.latlng);
    };

    this.map.on("click", this.mapClickHandler);
  }

  reverseGeocodeAndAddPopup(latlng) {
    const { lat, lng } = latlng;

    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    )
      .then((response) => response.json())
      .then((data) => {
        const address = data.display_name;
        console.log("Reverse Geocode Address:", address);

        const marker = L.marker(latlng).addTo(this.map);
        marker
          .bindPopup(address, {
            offset: L.point(0, -30),
          })
          .openPopup();
        this.handleLocationChange(lat, lng);

        this.setState({
          marker: marker,
          address: address,
        });
      })
      .catch((error) => {
        console.error("Błąd podczas uzyskiwania adresu:", error);
      });
  }

  render() {
    return (
      <div>
        {this.state.owner ? (
          <div className="registration-form">
            <h2>Dodaj nowe zwierzę</h2>
            <form onSubmit={this.handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label>Tytuł ogłoszenia:</label>
                <input
                  type="text"
                  name="title"
                  value={this.state.title}
                  onChange={(e) => this.setState({ title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Opis:</label>
                <input
                  type="text"
                  name="desc"
                  value={this.state.desc}
                  onChange={(e) => this.setState({ desc: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <br />
                <label>Zaginione</label>
                <input
                  type="radio"
                  name="status"
                  value="Zaginione"
                  onChange={(e) => this.setState({ status: e.target.value })}
                  required
                />
                <label>Znalezione</label>
                <input
                  type="radio"
                  name="status"
                  value="Znalezione"
                  onChange={(e) => this.setState({ status: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Zdjęcie 1:</label>
                <input
                  type="file"
                  name="photo"
                  onChange={(e) => this.setState({ photo: e.target.files[0] })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Zdjęcie 2:</label>
                <input
                  type="file"
                  name="photo2"
                  onChange={(e) => this.setState({ photo2: e.target.files[0] })}
                  disabled={this.state.photo == null}
                />
              </div>
              <div className="form-group">
                <label>Zdjęcie 3:</label>
                <input
                  type="file"
                  name="photo3"
                  onChange={(e) => this.setState({ photo3: e.target.files[0] })}
                  disabled={
                    this.state.photo2 == null || this.state.photo == null
                  }
                />
              </div>
              <div className="form-group">
                <label>Gatunek:</label>
                <input
                  type="text"
                  name="species"
                  value={this.state.species}
                  onChange={(e) => this.setState({ species: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rasa:</label>
                <input
                  type="text"
                  name="breed"
                  value={this.state.breed}
                  onChange={(e) => this.setState({ breed: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Płeć:</label>
                <br />
                <label>Samiec</label>
                <input
                  type="radio"
                  name="gender"
                  value="Samiec"
                  onChange={(e) => this.setState({ gender: e.target.value })}
                  required
                />
                <label>Samica</label>
                <input
                  type="radio"
                  name="gender"
                  value="Samica"
                  onChange={(e) => this.setState({ gender: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Umaszczenie (kolory):</label>
                <input
                  type="text"
                  name="colors"
                  value={this.state.colors}
                  onChange={(e) => this.setState({ colors: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  Wybierz lokalizację{" "}
                  {this.state.status == "Zaginione"
                    ? "zaginięcia"
                    : "znalezienia"}{" "}
                  na mapie:
                </label>
                <div id="map" style={{ width: "100%", height: "500px" }}></div>
              </div>
              <div className="form-group">
                <input type="submit" value="Wyślij" className="login-button" />
              </div>
            </form>
            {this.state.submittedAnimal && (
              <div>
                <h2>Nowe ogłoszenie:</h2>
                <p>Tytuł: {this.state.submittedAnimal.title}</p>
                <p>Opis: {this.state.submittedAnimal.desc}</p>
                <p>Gatunek: {this.state.submittedAnimal.species}</p>
                <p>Rasa: {this.state.submittedAnimal.breed}</p>
                <p>Kolory: {this.state.submittedAnimal.colors}</p>
                <p>Wiek: {this.state.submittedAnimal.age}</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p>Aby dodać ogłoszenie musisz się zalogować.</p>
            <Link to="/login" className="submit-button1">
              Zaloguj się
            </Link>
          </div>
        )}
      </div>
    );
  }
}

export default NewAnimal;
