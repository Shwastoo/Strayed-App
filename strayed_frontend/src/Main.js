import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class Main extends Component {
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
                  <Link to={`/main/details/${a.slug}`}>{a.title}</Link>
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
              <Link to="./Login">Zaloguj się</Link>
              <br />
              <Link to="/main/register">Nie masz konta? Zarejestruj się</Link>
            </div>
          )}
        </div>
      );
    }
  }

  export default Main;