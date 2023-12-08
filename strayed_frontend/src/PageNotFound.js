import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div>
      <p>Nie znaleziono strony.</p>

      <Link to="/" className="submit-button1">
        Przejdź do strony głównej
      </Link>
    </div>
  );
}

export default PageNotFound;
