import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function User() {
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`/api/users/${id}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Błąd pobierania usera:", error);
      });
  }, [id]);

  return (
    <div>
      {user ? (
        <div>
          <h1>{user.username}</h1>
          <p>
            Imię i nazwisko: {user.first_name} {user.last_name}
          </p>
          <Link to="/chat">Otwórz czat</Link>
          <p>Ogłoszenia:</p>
          <div className="animal-list">
            {user.animals.map((a, index) => (
              <li key={a.slug} className="animal-item">
                <Link to={`/details/${a.slug}`} className="animal-link">
                  <div className="animal-content">
                    <span className="animal-title">{a.title}</span>
                    {a.photo && (
                      <img
                        src={a.photo}
                        alt={`Zdjęcie ${a.title}`}
                        className="animal-thumbnail"
                      />
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </div>
        </div>
      ) : (
        <p>Ładowanie danych...</p>
      )}
    </div>
  );
}

export default User;
