import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function User({ username, handlePassChange }) {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [notFound, setNotFound] = useState(false);
  const [loggedUser, setLoggedUser] = useState(username);
  const [editMode, setEditMode] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    axios
      .get(`/api/users/${id}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Błąd pobierania usera:", error);
        setNotFound(true);
      });
  }, [id]);

  const changePassword = (e) => {
    e.preventDefault();
    var data = {
      username: loggedUser,
      oldPass: oldPassword,
      newPass: newPassword,
      confPass: confirmPassword,
    };
    handlePassChange(data);
  };

  return (
    <div>
      {!notFound ? (
        <div>
          {user ? (
            <div>
              <h1>{user.username}</h1>
              {loggedUser == user.username ? (
                <div>
                  <Link
                    onClick={() => setEditMode(!editMode)}
                    className="submit-button"
                  >
                    {editMode ? "Anuluj" : "Zmień hasło"}
                  </Link>
                </div>
              ) : (
                <div></div>
              )}
              {editMode ? (
                <div className="registration-form">
                  <form onSubmit={changePassword}>
                    <div className="form-group">
                      <label>Stare hasło</label>
                      <input
                        type="password"
                        name="oldpassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Stare hasło"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Nowe hasło</label>
                      <input
                        type="password"
                        name="newpassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nowe hasło"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Powtórz nowe hasło</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Powtórz nowe hasło"
                        required
                      />
                    </div>
                    <button type="submit" className="login-button">
                      Zapisz zmiany
                    </button>
                  </form>
                </div>
              ) : (
                <div></div>
              )}
              <p>
                Imię i nazwisko: {user.first_name} {user.last_name}
              </p>
              <Link to={`/chat/${user.username}`} className="submit-button">
                Otwórz czat
              </Link>
              <br />
              <br />
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
      ) : (
        <div>
          <p>Nie znaleziono użytkownika.</p>
          <Link to="/" className="submit-button1">
            Przejdź do strony głównej
          </Link>
        </div>
      )}
    </div>
  );
}

export default User;
