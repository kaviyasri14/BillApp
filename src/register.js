import React, { useState } from "react";
import Form from "react-bootstrap/Form";
// import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import firebase from "./config/FirebaseConfig";
import Spinner from "react-bootstrap/Spinner";
import { Col} from "react-bootstrap";
import "./register.css"
// import { faHome } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Register(props) {
  const [validated, setValidated] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };
  return (
    <div className="registerPage">
    <div className="registerContainer">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>

      <Col>    <Form.Group controlId="validationCustom01">
            <Form.Label>First name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="UserName"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group> </Col>
       
  
        <Col> 
          <Form.Group  controlId="validationCustom02">
            <Form.Label>Email ID</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          </Col>
       
        <Col> 
          <Form.Group controlId="validationCustom02">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              minLength="6"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          </Col>
      
       <div class="submitButton">
        <Button
          type="submit"
          disabled={creating}
   
          onClick={(e) => {
            signUp(e);
          }}
        >
          {creating ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            ""
          )}
          {creating ? "Creating.." : "Create Account"}
        </Button>
        </div>
      </Form>
      </div>
    </div>
  );
  async function signUp(e) {
    e.preventDefault();
    setCreating(true);
    let o = {
      uname: userName,
      role: "user",

    };
    try {
      await firebase.register(userName, email, password);
      await firebase.addUser(o);
      props.history.push("/login");
      setCreating(false);
    } catch (error) {
      alert(error.message);
      setCreating(false);
    }
  }
}
export default Register;
