import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorReg, setErrorReg] = useState("");
  
  const navigate = useNavigate();

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorReg("Hasła nie pasują do siebie.");
      return;
    }

    try {
      const response = await axios.post("/userRegister/", {
        pw: password,
        first_name: firstName,
        last_name: lastName,
        login: login,
        email: email,
      });

      if (response.data.success) {
        navigate("/login");
      } else {
        setErrorReg(response.data.error);
      }
    } catch (error) {
      console.error("Błąd rejestracji:", error);
    }
  };

  return (
    <div className="registration-form">
      <h2>Rejestracja</h2>
      <form onSubmit={handleFormSubmit}>
        {errorReg && <p className="error-message">{errorReg}</p>}
        <div className="form-group">
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Imię"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Nazwisko"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Login"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adres email"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Hasło"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Powtórz hasło"
            required
          />
        </div>
        <button type="submit" className="login-button">Zarejestruj</button>
      </form>
    </div>
  );
}

export default Register;