import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

//import { Heading } from './components/Heading/Heading';
//import { Footer } from './components/Footer/Footer';
import Login from "./Login";
import Register from "./Register";
import Details from "./Details";
import NewAnimal from "./NewAnimal";
import Logout from "./Logout";

const cookies = new Cookies();
function App() {
  const [csrf, setCsrf] = useState("");
  const [username, setUsername] = useState(null);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState("false");
  const [loading, setLoading] = useState("true");

  const navigate = useNavigate();

  useEffect(() => {
    console.log(username);
    if (loading) checkIfUserLoggedIn();
  });

  const getCSRF = () => {
    fetch("http://localhost:8000/csrf/", {
      credentials: "include",
    })
      .then((res) => {
        let csrfToken = res.headers.get("X-CSRFToken");
        setCsrf(csrfToken);
        setLoading(false);
        console.log(csrfToken);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const isResponseOk = (response) => {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  };

  const checkIfUserLoggedIn = () => {
    /*
    try {
      const response = await axios.get("/userAuth/");
      const { user } = response.data;
      console.log("Stan zalogowania:", user);
      this.setState({ sessionUser: user });
    } catch (error) {
      console.error("Błąd sprawdzania stanu sesji:", error);
    }
    */
    fetch("http://localhost:8000/session/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.isAuthenticated) {
          whoami();
        } else {
          setIsAuthenticated(false);
          getCSRF();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const whoami = () => {
    fetch("http://localhost:8000/whoami/", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("You are logged in as: " + data.username);
        setIsAuthenticated(true);
        setUsername(data.username);
        setLoading(false);
        console.log(this.state);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogin = (username, password) => {
    /*
    try {
      const response = await axios.post("/userAuth/", {
        un: username,
        pw: password,
      });
      if (response.data.success) {
        this.setState({ sessionUser: response.data.user });
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.error("Błąd logowania:", error);
    }
    */
    fetch("http://localhost:8000/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf,
      },
      credentials: "include",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        setIsAuthenticated(true);
        setUsername(username);
        setError("");
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setError("Wrong username or password.");
      });
  };

  const handleLogout = () => {
    /*
    try {
      const response = await axios.post("/logout/");
      console.log(response.data);
      this.setState({ sessionUser: null });
    } catch (error) {
      console.error("Błąd wylogowania:", error);
    }
    */
    fetch("http://localhost:8000/logout/", {
      credentials: "include",
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        setIsAuthenticated(false);
        setUsername(null);
        getCSRF();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {!loading ? (
        <div className="App">
          <div className="header">
            <p id="title">STRAYED</p>
            {username != null ? (
              <div className="user-section user-panel">
                <p>Witaj {username}</p>
                <Link to="" onClick={handleLogout}>
                  Wyloguj się
                </Link>
              </div>
            ) : (
              <div className="guest-section user-panel">
                <span>Nie jesteś zalogowany. </span>
                <Link to="/login">Zaloguj się</Link>
                <br />
                <span>Nie masz konta? </span>
                <Link to="/register">Zarejestruj się</Link>
              </div>
            )}
          </div>

          <Routes>
            <Route path="/" element={<Index username={username} />} />
            <Route
              path="/login"
              element={<Login handleLogin={handleLogin} />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/details/:slug" element={<Details />} />
            {username && <Route path="/newanimal" element={<NewAnimal />} />}
          </Routes>

          <div className="footer">
            © Strayed_App by Jakub Szwast & Julia Politowska | 2023
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
export default App;

function Index({ username }) {
  const [strayedAnimals, setStrayedAnimals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!strayedAnimals) fetchStrayedAnimals();
  });

  const fetchStrayedAnimals = () => {
    axios
      .get("/api/animals")
      .then((response) => {
        setStrayedAnimals(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Błąd pobierania danych zwierząt:", error);
      });
  };

  return (
    <div>
      {!loading ? (
        <div className="index-content">
          {strayedAnimals && strayedAnimals.length > 0 ? (
            <ul className="animal-list">
              {strayedAnimals.map((a) => (
                <li key={a.slug} className="animal-item">
                  <Link to={`/details/${a.slug}`} className="animal-link">
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Brak danych o zwierzętach</p>
          )}

          {username != null ? (
            <div className="new-entry">
              <Link to="/newAnimal">Dodaj ogłoszenie</Link>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      ) : (
        <div>
          <p>Ładowanie...</p>
        </div>
      )}
    </div>
  );
}
