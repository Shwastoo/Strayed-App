import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Cookies from "universal-cookie";

//import { Heading } from './components/Heading/Heading';
//import { Footer } from './components/Footer/Footer';
import Login from "./Login";
import Register from "./Register";
import Details from "./Details";
import NewAnimal from "./NewAnimal";
import Logout from "./Logout";

const cookies = new Cookies();
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      csrf: "",
      username: null,
      error: "",
      isAuthenticated: false,
      loading: true,
    };
  }
  async componentDidMount() {
    this.checkIfUserLoggedIn();
  }

  getCSRF = () => {
    fetch("http://localhost:8000/csrf/", {
      credentials: "include",
    })
      .then((res) => {
        let csrfToken = res.headers.get("X-CSRFToken");
        this.setState({ csrf: csrfToken, loading: false });
        console.log(csrfToken);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  isResponseOk(response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  }

  checkIfUserLoggedIn = async () => {
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
    await fetch("http://localhost:8000/session/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.isAuthenticated) {
          this.setState({ isAuthenticated: true });
          this.whoami();
        } else {
          this.setState({ isAuthenticated: false });
          this.getCSRF();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  whoami = async () => {
    await fetch("http://localhost:8000/whoami/", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("You are logged in as: " + data.username);
        this.setState({ username: data.username, loading: false });
        console.log(this.state);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleLogin = async (username, password) => {
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
        "X-CSRFToken": this.state.csrf,
      },
      credentials: "include",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then(this.isResponseOk)
      .then((data) => {
        console.log(data);
        this.setState({
          isAuthenticated: true,
          error: "",
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: "Wrong username or password." });
      });
  };

  handleLogout = async () => {
    /*
    try {
      const response = await axios.post("/logout/");
      console.log(response.data);
      this.setState({ sessionUser: null });
    } catch (error) {
      console.error("Błąd wylogowania:", error);
    }
    */
    fetch("http://localhost:8000/logout", {
      credentials: "include",
    })
      .then(this.isResponseOk)
      .then((data) => {
        console.log(data);
        this.setState({ isAuthenticated: false });
        this.getCSRF();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { username } = this.state;
    const { loading } = this.state;

    return (
      <Router>
        {!loading ? (
          <div className="App">
            <div className="header">
              <p>STRAYED</p>
              {username != null ? (
                <div className="user-section">
                  <p>Witaj {username}</p>
                  <br />
                  <Link to="" onClick={this.handleLogout}>
                    Wyloguj się
                  </Link>
                </div>
              ) : (
                <div className="guest-section">
                  <Link to="/login">Zaloguj się</Link>
                  <br />
                  <Link to="/register">Nie masz konta? Zarejestruj się</Link>
                </div>
              )}
            </div>

            <Routes>
              <Route path="/" element={<Index data={this.state} />} />
              <Route
                path="/login"
                element={<Login handleLogin={this.handleLogin} />}
              />
              <Route path="/register" element={<Register />} />
              <Route path="/details/:slug" element={<Details />} />
              {username && <Route path="/newanimal" element={<NewAnimal />} />}
              {username && (
                <Route
                  path="/logout"
                  element={<Logout handleLogout={this.handleLogout} />}
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
      </Router>
    );
  }
}

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      strayedAnimals: [],
      loading: true,
      username: this.props.data.username,
    };
  }

  async componentDidMount() {
    this.fetchStrayedAnimals();
    console.log(this.props);
  }

  async fetchStrayedAnimals() {
    await axios
      .get("/api/animals")
      .then((response) => {
        this.setState({
          strayedAnimals: response.data,
          loading: false,
        });
        console.log(this.state);
      })
      .catch((error) => {
        console.error("Błąd pobierania danych zwierząt:", error);
      });
  }

  render() {
    const { strayedAnimals } = this.state;
    const { username } = this.state;
    const { loading } = this.state;

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
              <div className="user-section">
                <p>Witaj {username}</p>
                <Link to="/newAnimal">Dodaj ogłoszenie</Link>
                <br />
                <Link to="" onClick={this.handleLogout}>
                  Wyloguj się
                </Link>
              </div>
            ) : (
              <div className="guest-section">
                <Link to="/login">Zaloguj się</Link>
                <br />
                <Link to="/register">Nie masz konta? Zarejestruj się</Link>
              </div>
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
}

export default App;
