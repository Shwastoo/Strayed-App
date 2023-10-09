import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

import { Heading } from './components/Heading/Heading';
import { Footer } from './components/Footer/Footer';
import Login from './Login';
import Register from './Register';
import Details from './Details'; 

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
          <div className="header">
            <Heading title="STRAYED" variant="secondary" />
          </div>

          <Routes>
            <Route path="/" element={<Index sessionUser={sessionUser} />} />
            <Route path="/login" element={<Login handleLogin={this.handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/details/:slug" element={<Details />} /> 
          </Routes>

          <Footer title="© Strayed_App by Jakub Szwast & Julia Politowska | 2023" variant="secondary" />
          
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
          <ul>
            {strayedAnimals.map((a) => (
              <li key={a.slug}>
                <Link to={`/details/${a.slug}`}>{a.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Brak danych o zwierzętach</p>
        )}

        {sessionUser ? (
          <div className="user-section">
            <p>Witaj {sessionUser}</p>
            <Link to="/main/new">Dodaj ogłoszenie</Link>
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
    );
  }
}

/*
const Index = ({ strayedAnimals, sessionUser }) => {
  return (
    <body>
      {strayedAnimals.length  0 && (
        <ul>
          {strayedAnimals.map((a) => (
            <li key={a.slug}>
              <a href={`/main/details/${a.slug}`}>{a.title}</a>
            </li>
          ))}
        </ul>
      )}

      {sessionUser ? (
        <>
          <p>Witaj {sessionUser}</p>
          <a href="/main/new">Dodaj ogłoszenie</a>
          <br />
          <a href="/main/logout">Wyloguj się</a>
        </>
      ) : (
        <>
          <a href="/main/login">Zaloguj się</a><br />
          <a href="/main/register">Nie masz konta? Zarejestruj się</a>
        </>
      )}
    </body>
  );
};

const AnimalDetails = ({ animal }) => {
  return (
    <body>
      <h1>{animal.title}</h1>
      <p>{animal.desc}</p>
      <p>Gatunek: {animal.species}</p>
      <p>Rasa: {animal.breed}</p>
      <p>Kolory:</p>
      <ul>
        {animal.colors.map((c, index) => (
          <li key={index}>{c}</li>
        ))}
      </ul>
      <p>Płeć: {animal.gender}</p>
      {animal.static_urls.map((u, index) => (
        u !== "" && <img key={index} src={u} alt={`Animal ${index}`} />
      ))}
      <p>Właściciel: {animal.owner.first_name} {animal.owner.last_name}</p>
      <p>Data dodania: {animal.date_created}</p>
    </body>
  );
};

const LoginForm = ({ errorLog, formAction, csrfToken }) => {
  return (
    <body>
      <fieldset>
        <form action={formAction} method="POST">
          {errorLog && <p>{errorLog}</p>}
          <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
          <input type="text" name="username" placeholder="Nazwa użytkownika" />
          <input type="password" name="password" placeholder="Hasło" />
          <input type="submit" value="Zaloguj" />
        </form>
      </fieldset>
    </body>
  );
};

const AddAnimalForm = ({ formAction, csrfToken }) => {
  return (
    <body>
      <form action={formAction} method="POST" encType="multipart/form-data">
        <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
        <label htmlFor="title">Tytuł ogłoszenia:</label>
        <input type="text" name="title" id="title" /><br />
        <label htmlFor="desc">Opis:</label>
        <input type="text" name="desc" id="desc" /><br />
        <label htmlFor="photo">Zdjęcie:</label>
        <input type="file" name="photo" id="photo" /><br />
        <input type="submit" value="Wyślij" />
      </form>
    </body>
  );
};

const RegistrationForm = ({ formAction, csrfToken, errorReg }) => {
  return (
    <body>
      <fieldset>
        <form action={formAction} method="POST">
          {errorReg && <p>{errorReg}</p>}
          <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
          <label htmlFor="username">Nazwa użytkownika:</label>
          <input type="text" name="username" id="username" /><br />
          <label htmlFor="password">Hasło:</label>
          <input type="password" name="password" id="password" /><br />
          <input type="submit" value="Zarejestruj" />
        </form>
      </fieldset>
    </body>
  );
};
*/

export default App;
