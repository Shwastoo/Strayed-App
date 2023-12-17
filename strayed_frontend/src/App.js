import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//import { Heading } from './components/Heading/Heading';
//import { Footer } from './components/Footer/Footer';
import Login from "./Login";
import Register from "./Register";
import Details from "./Details";
import NewAnimal from "./NewAnimal";
import Chat from "./Chat";
import User from "./User";
import ChatList from "./ChatList";
import PageNotFound from "./PageNotFound";

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

  /*
  const getState = () => {
    console.log(csrf, username, error, isAuthenticated, loading, sessionCheck);
  };
  */

  const getCSRF = async () => {
    await fetch("http://localhost:8000/csrf/", {
      credentials: "include",
    })
      .then((res) => {
        let csrfToken = res.headers.get("X-CSRFToken");
        setCsrf(csrfToken);
        console.log("Tokeny:");
        console.log(csrf);
        console.log(cookies.get("csrftoken"));
        console.log(cookies.get("CSRFtoken"));
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
        //console.log(data);
        if (data.isAuthenticated) {
          whoami();
        } else {
          setIsAuthenticated(false);
          setLoading(false);
          //getCSRF();
        }
        //axios.defaults.xsrfCookieName = "CSRFtoken";
        //axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        //axios.defaults.withcredentials = true;
        //console.log(isAuthenticated, error, csrf);
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
        //console.log("You are logged in as: " + data.username);
        //setCsrf(cookies.get("csrftoken"));
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
    await fetch("http://localhost:8000/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      */
    var data = { username: username, password: password };
    const loginStatus = toast.loading("Logowanie...", {
      position: toast.POSITION.TOP_CENTER,
    });
    await axios
      .post("/login/", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setIsAuthenticated(true);
        setUsername(username);
        setError("");
        navigate("/");
        toast.update(loginStatus, {
          render: "Zalogowano pomyślnie!",
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.SUCCESS,
          autoClose: 3000,
          closeButton: true,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        var errorText = "Błąd logowania.";
        if (error.response.data.detail === "Invalid credentials.")
          errorText = "Nieprawidłowy login lub hasło.";
        toast.update(loginStatus, {
          render: errorText,
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.ERROR,
          autoClose: 3000,
          closeButton: true,
          isLoading: false,
        });
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
    const logoutStatus = toast.loading("Wylogowywanie...", {
      position: toast.POSITION.TOP_CENTER,
    });
    await fetch("http://localhost:8000/logout/", {
      credentials: "include",
    })
      .then(isResponseOk)
      .then((data) => {
        //console.log(data);
        setIsAuthenticated(false);
        setUsername(null);
        toast.update(logoutStatus, {
          render: "Wylogowano pomyślnie!",
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.SUCCESS,
          autoClose: 3000,
          closeButton: true,
          isLoading: false,
        });
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        toast.update(logoutStatus, {
          render: "Wystąpił nieoczekiwany błąd.",
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.ERROR,
          autoClose: 3000,
          closeButton: true,
          isLoading: false,
        });
      });
  };

  const handleRegister = async (data) => {
    const { username, password, confirm_password } = data;
    //console.log(username);
    if (username.includes("~")) {
      toast.error('Znak "~" jest niedozwolony w nazwie użytkownika.', {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    if (password !== confirm_password) {
      toast.error("Hasła nie są takie same.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    const registerStatus = toast.loading("Rejestrowanie...", {
      position: toast.POSITION.TOP_CENTER,
    });
    await axios
      .post("/register/", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        navigate("/login");
        toast.update(registerStatus, {
          render: "Zarejestrowano! Możesz się zalogować.",
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.SUCCESS,
          autoClose: 3000,
          closeButton: true,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        var errorText = "Nie udało się zarejestrować.";
        if (error.response.data === "Username unavailable.")
          errorText = "Ten login jest już zajęty.";
        else if (error.response.data === "Email already used.")
          errorText = "Na ten email zostało już założone konto.";
        toast.update(registerStatus, {
          render: errorText,
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.ERROR,
          autoClose: 3000,
          closeButton: true,
          isLoading: false,
        });
      });
    /*
    try {
      const response = await axios.post("/userRegister/", {
        pw: this.state.password,
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        login: this.state.login,
        email: this.state.email,
      });

      if (response.data.success) {
        this.props.navigate("/login");
      } else {
        this.setState({ errorReg: response.data.error });
      }
    } catch (error) {
      console.error("Błąd rejestracji:", error);
    }
    */
  };

  const addAnimal = async (data) => {
    //await getCSRF();
    //console.log("Po tokenach:");
    //axios.defaults.headers.post["X-CSRF-Token"] = cookies.get("CSRFtoken");
    //console.log(axios.defaults.headers.post["X-CSRF-Token"]);
    const addingStatus = toast.loading("Dodawanie ogłoszenia...", {
      position: toast.POSITION.TOP_CENTER,
    });
    await axios
      .post("/api/animals/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": cookies.get("csrftoken"),
        },
      })
      .then((response) => {
        //console.log(response);
        navigate("/details/" + response.data.slug);
        toast.update(addingStatus, {
          render: "Ogłoszenie zostało dodane!",
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.SUCCESS,
          autoClose: 3000,
          closeButton: true,
          isLoading: false,
        });
      })
      .catch((error) => {
        //console.error("Błąd dodawania ogłoszenia:", error);
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        toast.update(addingStatus, {
          render: "Wystąpił błąd podczas dodawania ogłoszenia.",
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.ERROR,
          autoClose: 3000,
          closeButton: true,
          isLoading: false,
        });
      });

    /*
    console.log(data);
    await fetch("http://localhost:8000/api/animals/", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": cookies.get("csrftoken"),
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

  const sendChatImage = async (data) => {
    await axios
      .post("/api/chatImages/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": cookies.get("csrftoken"),
        },
      })
      .then((response) => {
        //console.log(response);
      })
      .catch((error) => {
        //console.error("Błąd dodawania ogłoszenia:", error);
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      });
  };

  return (
    <div>
      {!loading ? (
        <div className="App">
          <div className="header">
            <ToastContainer />
            <div id="title" className="logo-container">
              <Link to="/" className="logo-link">
                <img
                  src="/media/images/app_logo.png"
                  alt="Logo"
                  style={{ width: "80px", height: "auto" }}
                  className="logo-img"
                />
                <span className="logo-text">STRAYED</span>
              </Link>
            </div>
            {username != null ? (
              <div className="user-section user-panel">
                <p>
                  Witaj <Link to={`/user/${username}`}>{username}</Link>
                </p>
                <Link to="/chatlist" className="submit-button1">
                  Wiadomości
                </Link>
                <br />
                <Link onClick={handleLogout} className="submit-button1">
                  Wyloguj się
                </Link>
                <br />
                <p className="report-link">
                  Coś nie działa? Chcesz coś zgłosić?{" "}
                  <Link to="/chat/unstrayer">Napisz do nas!</Link>
                </p>
              </div>
            ) : (
              <div className="guest-section user-panel">
                <span>Nie jesteś zalogowany. </span>
                <Link to="/login" className="submit-button1">
                  Zaloguj się
                </Link>
                <br />
                <span>Nie masz konta? </span>
                <Link to="/register" className="submit-button1">
                  Zarejestruj się
                </Link>
              </div>
            )}
          </div>

          <Routes>
            <Route path="/" element={<Index username={username} />} />
            <Route
              path="/login"
              element={<Login username={username} handleLogin={handleLogin} />}
            />
            <Route
              path="/register"
              element={
                <Register username={username} handleRegister={handleRegister} />
              }
            />
            <Route
              path="/details/:slug"
              element={<Details username={username} />}
            />
            <Route
              path="/newanimal"
              element={<NewAnimal addAnimal={addAnimal} username={username} />}
            />
            <Route
              path="/chat/:user"
              element={
                <Chat username={username} sendChatImage={sendChatImage} />
              }
            />
            <Route
              path="/chatlist"
              element={<ChatList username={username} />}
            />
            <Route path="/user/:id" element={<User username={username} />} />
            <Route path="*" element={<PageNotFound />} />
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
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filteredAnimals, setFilteredAnimals] = useState(null);
  const [showLost, setShowLost] = useState(true);
  const [showFound, setShowFound] = useState(true);

  useEffect(() => {
    if (!strayedAnimals) {
      fetchStrayedAnimals();
    } else {
      applyFilter();
    }
  }, [filterKeyword, strayedAnimals, showLost, showFound]);

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

  const applyFilter = () => {
    const filtered = strayedAnimals.filter((animal) => {
      const titleMatch = animal.title
        .toLowerCase()
        .includes(filterKeyword.toLowerCase());
      const descriptionMatch = animal.desc
        .toLowerCase()
        .includes(filterKeyword.toLowerCase());
      const speciesMatch = animal.species
        .toLowerCase()
        .includes(filterKeyword.toLowerCase());
      const breedMatch = animal.breed
        .toLowerCase()
        .includes(filterKeyword.toLowerCase());
      const colorsMatch = animal.colors
        .toLowerCase()
        .includes(filterKeyword.toLowerCase());
      const genderMatch = animal.gender
        .toLowerCase()
        .includes(filterKeyword.toLowerCase());
      const dateMatch = animal.date_created
        .toLowerCase()
        .includes(filterKeyword.toLowerCase());
      const statusMatch =
        (animal.status == "Zaginione" && showLost) ||
        (animal.status == "Znalezione" && showFound);

      return (
        (titleMatch ||
          descriptionMatch ||
          speciesMatch ||
          breedMatch ||
          colorsMatch ||
          genderMatch ||
          dateMatch) &&
        statusMatch
      );
    });
    setFilteredAnimals(filtered);
  };

  const clearFilter = () => {
    setFilterKeyword("");
    setFilteredAnimals(null);
  };

  const displayedAnimals = filteredAnimals || strayedAnimals;

  return (
    <div>
      {!loading ? (
        <div className="index-content">
          <div className="filter-container">
            <label className="filter-label" htmlFor="filterKeyword">
              Filtruj ogłoszenia:{" "}
            </label>
            <input
              className="filter-input"
              type="text"
              id="filterKeyword"
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
            />
            <button className="clear-button" onClick={clearFilter}>
              Wyczyść
            </button>
            <label>Pokaż: </label>
            <label>Zaginione </label>
            <input
              type="checkbox"
              name="statusL"
              value="Zaginione"
              className="status-cb"
              onChange={(e) => {
                setShowLost(e.target.checked);
              }}
              checked={showLost}
            ></input>
            <label>Znalezione </label>
            <input
              type="checkbox"
              name="statusF"
              value="Znalezione"
              className="status-cb"
              onChange={(e) => {
                setShowFound(e.target.checked);
              }}
              checked={showFound}
            ></input>
          </div>
          {displayedAnimals && displayedAnimals.length > 0 ? (
            <ul className="animal-list">
              {displayedAnimals.map((a) => (
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
            </ul>
          ) : (
            <p>Brak danych o zwierzętach</p>
          )}

          {username != null ? (
            <div className="new-entry">
              <Link to="/newAnimal" className="submit-button">
                Dodaj ogłoszenie
              </Link>
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
