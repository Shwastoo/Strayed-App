import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

//import axios from "axios";
//import { useNavigate } from "react-router-dom";
function Login({ user, handleLogin }) {
  const [loggedUser, setLoggedUser] = useState(user);
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
    <div>
      {!loggedUser ? (
        <div className="registration-form">
          <h2>Zaloguj się</h2>
          <form onSubmit={handleFormSubmit}>
            {errorLog && <p className="error-message">{errorLog}</p>}
            <div className="form-group">
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

export default Login;
