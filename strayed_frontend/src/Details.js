import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import L from "leaflet"; 
import "leaflet/dist/leaflet.css";

function Details() {
  const [animal, setAnimal] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    axios
      .get(`/api/animals/${slug}`)
      .then((response) => {
        setAnimal(response.data);
      })
      .catch((error) => {
        console.error("Błąd pobierania danych zwierzęcia:", error);
      });
  }, [slug]);

  useEffect(() => {
    if (animal) {
      const map = L.map("map").setView([51.505, -0.09], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

      if (animal.location && animal.location.lat && animal.location.lng) {
        const locationMarker = L.marker([animal.location.lat, animal.location.lng]).addTo(map);
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
          {animal.static_urls && animal.static_urls.length > 0 && (
            <div>
              <p>Zdjęcia:</p>

              <img key="0" src={animal.photo} alt={`Zdjęcie 1`} className="animal-image"/>
            </div>
          )}
          
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
