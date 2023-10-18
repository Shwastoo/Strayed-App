import React, { Component } from "react";
import axios from "axios";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      login: "",
      email: "",
      password: "",
      confirmPassword: "",
      errorReg: "",
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFormSubmit = async (event) => {
    event.preventDefault();

    const { password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      this.setState({ errorReg: "Hasła nie pasują do siebie." });
      return;
    }

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
  };

  render() {
    const {
      firstName,
      lastName,
      login,
      email,
      password,
      confirmPassword,
      errorReg,
    } = this.state;

    return (
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
              name="login"
              value={login}
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
          <button type="submit" className="login-button">Zarejestruj</button>
        </form>
      </div>
    );
  }
}

export default Register;