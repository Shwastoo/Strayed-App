import React, { useState, useEffect } from "react";
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

const cookies = new Cookies();

function App() {
  const [csrf, setCsrf] = useState("");
  const [username, setUsername] = useState(null);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionCheck, setSessionCheck] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionCheck) checkIfUserLoggedIn();
  });

  const getCSRF = async () => {
    await fetch("http://localhost:8000/csrf/", {
      credentials: "include",
    })
      .then((res) => {
        let csrfToken = res.headers.get("X-CSRFToken");
        setLoading(false);
        console.log(csrfToken);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const isResponseOk = (response) => {
    console.log(csrf);
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  };

  const checkIfUserLoggedIn = async () => {
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
    setSessionCheck("true");
    await fetch("http://localhost:8000/session/", {
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
        setCsrf(cookies.get("csrftoken"));
        axios.defaults.xsrfCookieName = "csrftoken";
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios.defaults.withcredentials = true;
        console.log(isAuthenticated, error);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const whoami = async () => {
    await fetch("http://localhost:8000/whoami/", {
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogin = async (username, password) => {
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
    await fetch("http://localhost:8000/login/", {
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

  const handleLogout = async () => {
    /*
    try {
      const response = await axios.post("/logout/");
      console.log(response.data);
      this.setState({ sessionUser: null });
    } catch (error) {
      console.error("Błąd wylogowania:", error);
    }
    */
    await fetch("http://localhost:8000/logout/", {
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

  const addAnimal = async (data) => {
    await axios
      .post("/api/animals/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrf,
        },
      })
      .then((response) => {})
      .catch((error) => {
        console.error("Błąd dodawania ogłoszenia:", error);
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      });

    /*
    await fetch("http://localhost:8000/api/animals/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf,
      },
      credentials: "include",
      body: data,
    })
      .then(isResponseOk)
      .then((data) => {})
      .catch((err) => {
        console.log(err);
        setError("Couldn't add animal");
      });
      */
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
            {username && (
              <Route
                path="/newanimal"
                element={<NewAnimal addAnimal={addAnimal} />}
              />
            )}
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

  const fetchStrayedAnimals = async () => {
    await axios
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
