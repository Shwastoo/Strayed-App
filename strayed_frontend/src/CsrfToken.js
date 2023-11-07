import React from "react";
import Cookie from "universal-cookie";

var cookie = new Cookie();
var csrftoken = cookie.get("csrftoken");

const CSRFToken = () => {
  return <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />;
};
export default CSRFToken;
