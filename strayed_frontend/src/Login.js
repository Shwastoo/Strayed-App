import React, { Component } from "react";
//import { Link } from "react-router-dom";
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
      <div>
        <h2>Zaloguj się</h2>
        <form onSubmit={this.handleFormSubmit}>
          {errorLog && <p>{errorLog}</p>}
          <input type="text" name="username" value={username} onChange={this.handleInputChange} placeholder="Nazwa użytkownika" />
          <input type="password" name="password" value={password} onChange={this.handleInputChange} placeholder="Hasło" />
          <button type="submit">Zaloguj</button>
        </form>
      </div>
    );
  }
}

export default Login;