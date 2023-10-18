import React, { Component } from "react";
import axios from "axios";

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animal: null,
    };
  }

  componentDidMount() {
    const { slug } = this.props.match.params; // Dostęp do slug z parametrów URL

    axios
      .get(`/api/animals/${slug}`)
      .then((response) => {
        this.setState({ animal: response.data });
      })
      .catch((error) => {
        console.error("Błąd pobierania danych zwierzęcia:", error);
      });
  }

  render() {
    const { animal } = this.state;

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
                <img key="0" src={animal.photo} alt={`Zdjęcie 1`} />
              </div>
            )}
          </div>
        ) : (
          <p>Ładowanie danych...</p>
        )}
      </div>
    );
  }
}

export default Details;