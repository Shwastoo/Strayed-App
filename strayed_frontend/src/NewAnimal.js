import React, { Component, useEffect } from "react";
//import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

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
    formData.append("owner", this.state.owner);
    formData.append("photo", this.state.photo);
    formData.append("photo2", this.state.photo2);
    formData.append("photo3", this.state.photo3);
    formData.append("gender", this.state.gender);
    formData.append("species", this.state.species);
    formData.append("breed", this.state.breed);
    formData.append("colors", this.state.colors);
    formData.append("location", `${this.state.latitude}, ${this.state.longitude}`);
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
    this.initMap();
  }

  initMap() {
    const map = L.map("map").setView([50.061, 19.936], 13);
    this.map = map;
  
    L.Marker.prototype.options.icon = DefaultIcon;
  
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  
    const searchControl = new SearchControl({
      style: "button",
      provider: new OpenStreetMapProvider(),
      marker: DefaultIcon,
      notFoundMessage: "Przepraszamy, nie udało się znaleźć tego adresu.",
    });
  
    map.addControl(searchControl);
  
    let marker = null;
  
    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
  
      if (marker) {
        this.map.removeLayer(marker);
      }

      marker = L.marker(e.latlng).addTo(this.map);

      this.handleLocationChange(lat, lng);
    };
  
    this.mapClickHandler = handleMapClick;
    this.map.on("click", handleMapClick);
  
    const searchInput = document.querySelector(".leaflet-control-geosearch input");
    searchInput.addEventListener("change", () => {
      if (marker) {
        this.map.removeLayer(marker);
        marker = null;
      }
    });
  }
  
  render() {
    return (
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
            />
          </div>
          <div className="form-group">
            <label>Zdjęcie 3:</label>
            <input
              type="file"
              name="photo3"
              onChange={(e) => this.setState({ photo3: e.target.files[0] })}
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
              value="M"
              onChange={(e) => this.setState({ gender: e.target.value })}
              required
            />
            <label>Samica</label>
            <input
              type="radio"
              name="gender"
              value="F"
              onChange={(e) => this.setState({ gender: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Kolory (oddzielone przecinkami):</label>
            <input
              type="text"
              name="colors"
              value={this.state.colors}
              onChange={(e) => this.setState({ colors: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Wybierz lokalizację na mapie:</label>
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
    );
  }
}

export default NewAnimal;
