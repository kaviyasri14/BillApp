import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import firebase from "./config/FirebaseConfig";
import Spinner from "react-bootstrap/Spinner";
import Toast from "react-bootstrap/Toast";
// import { faHome } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Link } from "react-router-dom";

function Login(props) {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errordesc, setErrordesc] = useState("");
  const [logging, setLogging] = useState(false);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };
  return (
    <div className="loginpage">
      <Toast
        onClose={() => setShowError(false)}
        show={showError}
        delay={3000}
        autohide
      >
        <Toast.Header>
          <strong className="mr-auto">Error!</strong>
        </Toast.Header>
        <Toast.Body>{errordesc}</Toast.Body>
      </Toast>
      {/* <Link to="/">
        <FontAwesomeIcon icon={faHome} className="iconhome" />
      </Link> */}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Row>
          <Form.Group md="4" controlId="validationCustom02">
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
        </Form.Row>
        <Form.Row>
          <Form.Group md="4" controlId="validationCustom02">
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
        </Form.Row>
        <Button
          type="submit"
          disabled={logging}
          onClick={(e) => {
            login(e);
          }}
        >
          {logging ? (
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
          {logging ? "logging.." : "Let me in"}
        </Button>
      </Form>
    </div>
  );
  async function login(e) {
    setLogging(true);
    e.preventDefault();
    try {
      await firebase.login(email, password);
      setLogging(false);
      props.history.replace("/dashboard");
    } catch (e) {
      setShowError(true);
      setLogging(false);
      setErrordesc(e.message);
      // alert("please try to sign up and login", e.message);
    }
  }
}
export default Login;
