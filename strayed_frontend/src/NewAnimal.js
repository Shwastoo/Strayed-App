import React, { Component } from 'react';
import axios from 'axios';

class NewAnimal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      desc: '',
      photo: null,
      photo2: null,
      photo3: null,
      species: '',
      breed: '',
      colors: '',
      location: '',
      submittedAnimal: null,
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', this.state.title);
    formData.append('desc', this.state.desc);
    formData.append('photo', this.state.photo);
    formData.append('photo2', this.state.photo2);
    formData.append('photo3', this.state.photo3);
    formData.append('species', this.state.species);
    formData.append('breed', this.state.breed);
    formData.append('colors', this.state.colors);
    formData.append('location', this.state.location);

    axios.post('/api/animals/', formData)
      .then(response => {
        this.setState({ submittedAnimal: response.data });
      })
      .catch(error => {
        console.error('Błąd dodawania ogłoszenia:', error);
      });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} encType="multipart/form-data">
          <div>
            <label>Tytuł ogłoszenia:</label>
            <input
              type="text"
              name="title"
              value={this.state.title}
              onChange={e => this.setState({ title: e.target.value })}
            />
          </div>
          <div>
            <label>Opis:</label>
            <input
              type="text"
              name="desc"
              value={this.state.desc}
              onChange={e => this.setState({ desc: e.target.value })}
            />
          </div>
          <div>
            <label>Zdjęcie 1:</label>
            <input
              type="file"
              name="photo"
              onChange={e => this.setState({ photo: e.target.files[0] })}
            />
          </div>
          <div>
            <label>Zdjęcie 2:</label>
            <input
              type="file"
              name="photo2"
              onChange={e => this.setState({ photo2: e.target.files[0] })}
            />
          </div>
          <div>
            <label>Zdjęcie 3:</label>
            <input
              type="file"
              name="photo3"
              onChange={e => this.setState({ photo3: e.target.files[0] })}
            />
          </div>
          <div>
            <label>Gatunek:</label>
            <input
              type="text"
              name="species"
              value={this.state.species}
              onChange={e => this.setState({ species: e.target.value })}
            />
          </div>
          <div>
            <label>Rasa:</label>
            <input
              type="text"
              name="breed"
              value={this.state.breed}
              onChange={e => this.setState({ breed: e.target.value })}
            />
          </div>
          <div>
            <label>Kolory (oddzielone przecinkami):</label>
            <input
              type="text"
              name="colors"
              value={this.state.colors}
              onChange={e => this.setState({ colors: e.target.value })}
            />
          </div>
          <div>
            <label>Miejscowość:</label>
            <input
              type="text"
              name="location"
              value={this.state.location}
              onChange={e => this.setState({ location: e.target.value })}
            />
          </div>
          <div>
            <input type="submit" value="Wyślij" />
          </div>
        </form>
        {this.state.submittedAnimal && (
          <div>
            <h2>Nowe ogłoszenie:</h2>
            <p>Tytuł: {this.state.submittedAnimal.title}</p>
            <p>Opis: {this.state.submittedAnimal.desc}</p>
            <p>Gatunek: {this.state.submittedAnimal.species}</p>
            <p>Rasa: {this.state.submittedAnimal.breed}</p>
            <p>Kolory: {this.state.submittedAnimal.colors}</p>
            <p>Wiek: {this.state.submittedAnimal.age}</p>
          </div>
        )}
      </div>
    );
  }
}

export default NewAnimal;