import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
    <div>
      <h2>Zarejestruj się</h2>
      <form onSubmit={handleFormSubmit}>
        {errorReg && <p>{errorReg}</p>}
        <input
          type="text"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Imię"
        />
        <input
          type="text"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Nazwisko"
        />
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Adres email"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Hasło"
        />
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Powtórz hasło"
        />
        <button type="submit">Zarejestruj</button>
      </form>
    </div>
  );
}

export default Register;