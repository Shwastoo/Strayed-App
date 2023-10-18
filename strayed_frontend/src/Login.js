import React, { Component } from "react";
import axios from "axios";

class Login extends Component {
  state = {
    username: "",
    password: "",
    errorLog: "",
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFormSubmit = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;

    try {
      const response = await axios.post("/userAuth/", { un: username, pw: password });
      if (response.data.success) {
        this.props.handleLogin(username, password);
      } else {
        this.setState({ errorLog: response.data.error });
      }
    } catch (error) {
      console.error("Błąd logowania:", error);
    }
  };

  render() {
    const { username, password, errorLog } = this.state;

    return (
      <div className="registration-form">
        <h2>Zaloguj się</h2>
        <form onSubmit={this.handleFormSubmit}>
          {errorLog && <p className="error-message">{errorLog}</p>}
          <div className="form-group">
            <input
              type="text"
              name="username"
              value={username}
              onChange={this.handleInputChange}
              placeholder="Nazwa użytkownika"
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
            <button type="submit" className="login-button">Zaloguj</button>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;