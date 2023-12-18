import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function Details({ username }) {
  const [animal, setAnimal] = useState(null);
  const { slug } = useParams();
  const [photos, setPhotos] = useState([]);
  const [map, setMap] = useState(null);
  const [user, setUser] = useState(username);
  const [editMode, setEditMode] = useState(false);
  const [editAnimal, setEditAnimal] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [status, setStatus] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [photo3, setPhoto3] = useState(null);
  const [species, setSpecies] = useState(null);
  const [breed, setBreed] = useState(null);
  const [gender, setGender] = useState(null);
  const [colors, setColors] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    console.log("fetchowanie danych");
    if (!animal) {
      axios
        .get(`/api/animals/${slug}`)
        .then((response) => {
          setAnimal(response.data);
          setEditAnimal(response.data);
          /*
          setTitle(response.data.title);
          setDesc(response.data.desc);
          setStatus(response.data.status);
          setPhoto(response.data.photo);
          setPhoto2(response.data.photo2);
          setPhoto3(response.data.photo3);
          setSpecies(response.data.species);
          setBreed(response.data.breed);
          setGender(response.data.gender);
          setColors(response.data.colors);
          setLocation(response.data.location);
          */
          //console.log(response.data);
          initPhotoList(response.data);
          //console.log(phlist);
        })
        .catch((error) => {
          console.error("Błąd pobierania danych zwierzęcia:", error);
        });
    }
  }, [slug]);

  const initPhotoList = (data) => {
    var phlist = [data.photo];
    if (data.photo2 !== null && data.photo2 !== undefined)
      phlist.push(data.photo2);
    if (data.photo3 !== null && data.photo3 !== undefined)
      phlist.push(data.photo3);
    setPhotos(phlist);
  };

  const resetEdit = () => {
    if (animal) {
      setTitle(animal.title);
      setDesc(animal.desc);
      setStatus(animal.status);
      setPhoto(animal.photo);
      setPhoto2(animal.photo2);
      setPhoto3(animal.photo3);
      setSpecies(animal.species);
      setBreed(animal.breed);
      setGender(animal.gender);
      setColors(animal.colors);
      setLocation(animal.location);
      initPhotoList(animal);
      console.log(animal.photo, animal.photo2, animal.photo3);
    }
  };

  useEffect(() => {
    console.log(animal);
    initMap();
  }, [animal]);

  const initMap = () => {
    console.log("wczytanie mapki");
    if (animal) {
      const [latitude, longitude] = animal.location.split(", ").map(parseFloat);

      const newMap = L.map("map").setView(
        isNaN(latitude) || isNaN(longitude)
          ? [50.061, 19.936]
          : [latitude, longitude],
        13
      );
      setMap(newMap);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(newMap);

      L.Marker.prototype.options.icon = DefaultIcon;

      if (!isNaN(latitude) && !isNaN(longitude)) {
        const locationMarker = L.marker([latitude, longitude]).addTo(newMap);
        locationMarker.bindPopup("Miejsce zaginięcia", {
          offset: L.point(0, -30),
        });

        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        )
          .then((response) => response.json())
          .then((data) => {
            const address = data.display_name;
            //console.log("Reverse Geocode Address:", address);

            // Dodaj popup z adresem
            locationMarker
              .bindPopup(`Miejsce zaginięcia: ${address}`, {
                offset: L.point(0, -30),
              })
              .openPopup();
          })
          .catch((error) => {
            console.error("Błąd podczas uzyskiwania adresu:", error);
          });
      }
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    resetEdit();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    /*
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

  return (
    <div>
      {animal && editAnimal ? (
        <div>
          {!editMode ? (
            <div>
              {animal.owner == user ? (
                <div className="animal-controls">
                  <Link onClick={toggleEditMode} className="submit-button1">
                    Edytuj
                  </Link>
                  <Link
                    to={`/editanimal/${animal.slug}`}
                    className="submit-button1 delete"
                  >
                    Usuń
                  </Link>
                </div>
              ) : (
                <div></div>
              )}
              <h1 className="animal-status">
                Zwierzę&nbsp;
                <span
                  className={
                    animal.status == "Zaginione"
                      ? "animal-lost"
                      : "animal-found"
                  }
                >
                  {animal.status == "Zaginione" ? "zaginione" : "znalezione"}
                </span>
              </h1>

              <h1>{animal.title}</h1>
              <p>{animal.desc}</p>
              <p>Gatunek: {animal.species}</p>
              <p>Rasa: {animal.breed}</p>
              <p>Umaszczenie (kolory): {animal.colors}</p>
              <p>Płeć: {animal.gender}</p>
              <p>
                Właściciel:{" "}
                <Link to={`/user/${animal.owner}`}>{animal.owner}</Link>
              </p>
              <p>
                Data ostatniej aktualizacji:{" "}
                {new Date(animal.date_created).toLocaleDateString([], {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
              <div>
                <p>Zdjęcia:</p>
                {photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={"Zdjęcie " + { index }}
                    className="animal-image"
                  />
                ))}
              </div>

              <div style={{ height: "20px" }}></div>
              <p>
                Miejsce{" "}
                {animal.status == "Zaginione" ? "zaginięcia" : "znalezienia"}:
              </p>
              <div id="map"></div>
            </div>
          ) : (
            <div>
              {animal.owner == user ? (
                <div className="animal-controls">
                  <Link onClick={toggleEditMode} className="submit-button1">
                    Anuluj
                  </Link>
                  <Link
                    to={`/editanimal/${animal.slug}`}
                    className="submit-button1 delete"
                  >
                    Usuń
                  </Link>
                </div>
              ) : (
                <div></div>
              )}
              <div className="registration-form">
                <h2>Edytuj ogłoszenie</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="form-group">
                    <label>Tytuł ogłoszenia:</label>
                    <input
                      type="text"
                      name="title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Opis:</label>
                    <input
                      type="text"
                      name="desc"
                      value={desc}
                      onChange={(e) => {
                        setDesc(e.target.value);
                      }}
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
                      onChange={(e) => {
                        setStatus(e.target.value);
                      }}
                      checked={status == "Zaginione"}
                      required
                    />
                    <label>Znalezione</label>
                    <input
                      type="radio"
                      name="status"
                      value="Znalezione"
                      onChange={(e) => {
                        setStatus(e.target.value);
                      }}
                      checked={status == "Znalezione"}
                      required
                    />
                  </div>
                  {!photo ? (
                    <div className="form-group">
                      <label>Zdjęcie 1:</label>
                      <input
                        type="file"
                        name="photo"
                        onChange={(e) => {
                          setPhoto(e.target.files[0]);
                        }}
                        required
                      />
                    </div>
                  ) : (
                    <div className="form-group">
                      <img
                        src={photo}
                        alt={"Zdjęcie"}
                        className="animal-image edit-photo"
                      />
                      <button
                        onClick={() => setPhoto(null)}
                        className="clear-button"
                      >
                        Wyczyść zdjęcie
                      </button>
                    </div>
                  )}
                  {!photo2 ? (
                    <div className="form-group">
                      <label>Zdjęcie 2:</label>
                      <input
                        type="file"
                        name="photo2"
                        onChange={(e) => {
                          setPhoto2(e.target.files[0]);
                        }}
                        disabled={photo == null}
                      />
                    </div>
                  ) : (
                    <div className="form-group">
                      <label>Zdjęcie 2:</label>
                      <img
                        src={photo2}
                        alt={"Zdjęcie"}
                        className="animal-image edit-photo"
                      />
                      <button
                        onClick={() => setPhoto2(null)}
                        className="clear-button"
                      >
                        Wyczyść zdjęcie
                      </button>
                    </div>
                  )}
                  {!photo3 ? (
                    <div className="form-group">
                      <label>Zdjęcie 3:</label>
                      <input
                        type="file"
                        name="photo3"
                        onChange={(e) => {
                          setPhoto3(e.target.files[0]);
                        }}
                        disabled={photo == null || photo2 == null}
                      />
                    </div>
                  ) : (
                    <div className="form-group">
                      <img
                        src={photo3}
                        alt={"Zdjęcie"}
                        className="animal-image edit-photo"
                      />
                      <button
                        onClick={() => setPhoto3(null)}
                        className="clear-button"
                      >
                        Wyczyść zdjęcie
                      </button>
                    </div>
                  )}
                  <div className="form-group">
                    <label>Gatunek:</label>
                    <input
                      type="text"
                      name="species"
                      value={species}
                      onChange={(e) => {
                        setSpecies(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Rasa:</label>
                    <input
                      type="text"
                      name="breed"
                      value={breed}
                      onChange={(e) => {
                        setBreed(e.target.value);
                      }}
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
                      onChange={(e) => {
                        setGender(e.target.value);
                      }}
                      checked={gender == "Samiec"}
                      required
                    />
                    <label>Samica</label>
                    <input
                      type="radio"
                      name="gender"
                      value="Samica"
                      onChange={(e) => {
                        setGender(e.target.value);
                      }}
                      checked={gender == "Samica"}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Umaszczenie (kolory):</label>
                    <input
                      type="text"
                      name="colors"
                      value={colors}
                      onChange={(e) => {
                        setColors(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Wybierz lokalizację{" "}
                      {editAnimal.status == "L" ? "zaginięcia" : "znalezienia"}{" "}
                      na mapie:
                    </label>
                    <div
                      id="map"
                      style={{ width: "100%", height: "500px" }}
                    ></div>
                  </div>
                  <div className="form-group">
                    <input
                      type="submit"
                      value="Wyślij"
                      className="login-button"
                    />
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Ładowanie danych...</p>
      )}
    </div>
  );
}

export default Details;
