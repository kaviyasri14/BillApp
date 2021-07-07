import React from "react";
import Button from "react-bootstrap/Button";
import './App.css';
import './homepage.css';
import Logo from "./images/logo-removebg-preview.png";
import { useHistory } from "react-router-dom";

export default function HomePage() {
  let history = useHistory();
  return (
    <div className="homepage">
      <div className="homePageContainer">
        <div className="blogger">
        <div className="logo">
          <img src={Logo} alt="Logo" />
        </div>
        </div>
        <div className="buttongroup">
          <Button
            className="buttons"
            variant="success"
            size="lg"
            onClick={() => {
              history.push("/login");
            }}
          >
            Login
        </Button>
          <Button
            className="buttons"
            variant="warning"
            size="lg"
            onClick={() => {
              history.push("/register");
            }}
          >
            Register
        </Button>
        </div>
      </div>
    </div>
  );
}
