import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      errorReg: "",
      loggedUser: this.props.loggedUser,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFormSubmit = async (event) => {
    event.preventDefault();
    var data = {
      password: this.state.password,
      confirm_password: this.state.confirmPassword,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      username: this.state.username,
      email: this.state.email,
    };
    this.props.handleRegister(data);
  };

  render() {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
      errorReg,
      loggedUser,
    } = this.state;

    return (
      <div>
        {loggedUser ? (
          <div className="registration-form">
            <h2>Rejestracja</h2>
            <form onSubmit={this.handleFormSubmit}>
              {errorReg && <p className="error-message">{errorReg}</p>}
              <div className="form-group">
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={this.handleInputChange}
                  placeholder="Imię"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={this.handleInputChange}
                  placeholder="Nazwisko"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={this.handleInputChange}
                  placeholder="Login"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.handleInputChange}
                  placeholder="Adres email"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.handleInputChange}
                  placeholder="Hasło"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={this.handleInputChange}
                  placeholder="Powtórz hasło"
                  required
                />
              </div>
              <button type="submit" className="login-button">
                Zarejestruj
              </button>
            </form>
          </div>
        ) : (
          <div>
            <p>Jesteś już zalogowany.</p>
            <Link to="/" className="submit-button1">
              Przejdź do strony głównej
            </Link>
          </div>
        )}
      </div>
    );
  }
}

export default Register;
