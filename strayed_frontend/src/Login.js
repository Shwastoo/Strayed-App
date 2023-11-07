import React, { useEffect, useState } from "react";

import CSRFToken from "./CsrfToken";
//import axios from "axios";
//import { useNavigate } from "react-router-dom";
function Login({ handleLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorLog, setErrorLog] = useState("");

  useEffect(() => {
    setErrorLog("");
  });

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFormSubmit = (event) => {
    /*
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
    */
    event.preventDefault();
    handleLogin(username, password);
  };

  return (
    <div className="registration-form">
      <h2>Zaloguj się</h2>
      <form onSubmit={handleFormSubmit}>
        {errorLog && <p className="error-message">{errorLog}</p>}
        <div className="form-group">
          <CSRFToken />
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Nazwa użytkownika"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Hasło"
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" className="login-button">
            Zaloguj
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
