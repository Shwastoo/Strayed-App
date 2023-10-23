import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Logout() {
  const { test } = useParams();
  useEffect(() => {
    console.log();
  });

  return null;
}

export default Logout;
