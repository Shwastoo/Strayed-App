import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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
      const map = L.map("map").setView([50.061, 19.936], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        map
      );

      let lat = 50.061;
      let lon = 19.936;

      L.Marker.prototype.options.icon = DefaultIcon;

      L.marker([lat, lon]).addTo(map).bindPopup("Środek Krakowa");
      //.openPopup();

      if (animal.location && animal.location.lat && animal.location.lng) {
        const locationMarker = L.marker([
          animal.location.lat,
          animal.location.lng,
        ]).addTo(map);
        locationMarker.bindPopup("Miejsce zaginięcia").openPopup();
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
          <p>Kolory: {animal.colors.join(", ")}</p>
          <p>Płeć: {animal.gender}</p>
          <p>
            Właściciel: {animal.owner.first_name} {animal.owner.last_name}
          </p>
          <p>Data dodania: {animal.date_created}</p>
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
