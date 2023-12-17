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

function Details() {
  const [animal, setAnimal] = useState(null);
  const { slug } = useParams();
  const [photos, setPhotos] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/animals/${slug}`)
      .then((response) => {
        setAnimal(response.data);
        console.log(response.data);
        var phlist = [response.data.photo];
        if (response.data.photo2 !== null && response.data.photo2 !== undefined)
          phlist.push(response.data.photo2);
        if (response.data.photo3 !== null && response.data.photo3 !== undefined)
          phlist.push(response.data.photo3);
        setPhotos(phlist);
        console.log(phlist);
      })
      .catch((error) => {
        console.error("Błąd pobierania danych zwierzęcia:", error);
      });
  }, [slug]);

  useEffect(() => {
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
            console.log("Reverse Geocode Address:", address);

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
  }, [animal]);

  return (
    <div>
      {animal ? (
        <div>
          <h1>{animal.title}</h1>
          <p>{animal.desc}</p>
          <p>Gatunek: {animal.species}</p>
          <p>Rasa: {animal.breed}</p>
          <p>Umaszczenie (kolory): {animal.colors}</p>
          <p>Płeć: {animal.gender}</p>
          <p>
            Właściciel: <Link to={`/user/${animal.owner}`}>{animal.owner}</Link>
          </p>
          <p>Data ostatniej aktualizacji: {animal.date_created}</p>
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
          <p>Miejsce zaginięcia:</p>
          <div id="map"></div>
        </div>
      ) : (
        <p>Ładowanie danych...</p>
      )}
    </div>
  );
}

export default Details;
