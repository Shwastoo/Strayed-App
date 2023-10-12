import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

//import { Heading } from './components/Heading/Heading';
//import { Footer } from './components/Footer/Footer';
import Login from './Login';
import Register from './Register';
import Details from './Details';
import NewAnimal from './NewAnimal';

class App extends Component {
  state = {
    sessionUser: null,
  };

  componentDidMount() {
    this.checkIfUserLoggedIn();
  }

  checkIfUserLoggedIn = async () => {
    try {
      const response = await axios.get("/userAuth/");
      const { user } = response.data;
      console.log("Stan zalogowania:", user);
      this.setState({ sessionUser: user });
    } catch (error) {
      console.error("Błąd sprawdzania stanu sesji:", error);
    }
  };

  handleLogin = async (username, password) => {
    try {
      const response = await axios.post("/userAuth/", { un: username, pw: password });
      if (response.data.success) {
        this.setState({ sessionUser: response.data.user });
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.error("Błąd logowania:", error);
    }
  };

  handleLogout = async () => {
    try {
      const response = await axios.post("/logout/");
      console.log(response.data);
      this.setState({ sessionUser: null });
    } catch (error) {
      console.error("Błąd wylogowania:", error);
    }
  };

  render() {
    const { sessionUser } = this.state;

    return (
      <Router>
        <div className="App">
          <div className="header">STRAYED</div>

          <Routes>
            <Route path="/" element={<Index sessionUser={sessionUser} />} />
            <Route path="/login" element={<Login handleLogin={this.handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/details/:slug" element={<Details />} />
            {sessionUser && ( 
              <Route path="/newanimal" element={<NewAnimal />} />
            )}
          </Routes>

          <div className="footer">© Strayed_App by Jakub Szwast & Julia Politowska | 2023</div>
        </div>
      </Router>
    );
  } 
}

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      strayedAnimals: [],
    };
  }

  componentDidMount() {
    this.fetchStrayedAnimals();
  }

  fetchStrayedAnimals() {
    axios.get("/api/animals")
      .then(response => {
        this.setState({ strayedAnimals: response.data });
      })
      .catch(error => {
        console.error("Błąd pobierania danych zwierząt:", error);
      });
  }

  render() {
    const { strayedAnimals } = this.state;
    const { sessionUser } = this.props;

    return (
      <div className="index-content">
        {strayedAnimals && strayedAnimals.length > 0 ? (
          <ul className="animal-list">
            {strayedAnimals.map((a) => (
              <li key={a.slug} className="animal-item">
                <Link to={`/details/${a.slug}`} className="animal-link">{a.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Brak danych o zwierzętach</p>
        )}

        {sessionUser ? (
          <div className="user-section">
            <p>Witaj {sessionUser}</p>
            <Link to="/new">Dodaj ogłoszenie</Link>
            <br />
            <Link to="/main/logout">Wyloguj się</Link>
          </div>
        ) : (
          <div className="guest-section">
            <Link to="/login">Zaloguj się</Link>
            <br />
            <Link to="/register">Nie masz konta? Zarejestruj się</Link>
          </div>
        )}
      </div>
    );  }
}

export default App;