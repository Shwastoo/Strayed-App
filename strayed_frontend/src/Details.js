import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

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
              {animal.static_urls.map((url, index) => (
                <img key={index} src={url} alt={`Zdjęcie ${index + 1}`} />
              ))}
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