import React from "react";
import Button from "react-bootstrap/Button";
// import Blogger from "./images/blog.png";
import { useHistory } from "react-router-dom";
export default function HomePage() {
  let history = useHistory();
  return (
    <div className="homepage">
      <div className="blogger">
        <div className="logo">
         Kani Agencies
        </div>
      </div>
      <div className="buttongroup">
        <Button
          className="buttons"
          variant="outline-primary"
          onClick={() => {
            history.push("/login");
          }}
        >
          Login
        </Button>
        <Button
          className="buttons"
          variant="outline-success"
          onClick={() => {
            history.push("/register");
          }}
        >
          Register
        </Button>
      </div>
    </div>
  );
}
