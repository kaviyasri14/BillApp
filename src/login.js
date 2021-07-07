import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import firebase from "./config/FirebaseConfig";
import Spinner from "react-bootstrap/Spinner";
import Toast from "react-bootstrap/Toast";
import { Col} from "react-bootstrap";
import "./login.css"
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
      <div className="loginContainer">
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
        <h1>Login</h1>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Row>
          {/* <Form.Group controlId="validationCustom02"> */}
        {/* <Col xs={1} >  <Form.Label>Email ID</Form.Label></Col>   */}
        <Col xs={4} className = "textbox">    
        <i class="fas fa-user"></i>
           <Form.Control
           className ="email"
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />   </Col>         
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          {/* </Form.Group> */}
        </Form.Row>
        <Form.Row>
          {/* <Form.Group  controlId="validationCustom02"> */}
          {/* <Col xs={1}>  <Form.Label>Password</Form.Label></Col> */}
        <Col xs={4} className = "textbox"> 
        <i class="fas fa-lock"></i>
           <Form.Control
           className ="password"
              required
              minLength="6"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            /> </Col>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          {/* </Form.Group> */}
        </Form.Row>
        <Form.Row>
          <Col xs={4}>
        <Button
        className = "btn"
        variant="success"
        // variant="outline-success"
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
        </Col>
        </Form.Row>
        
      </Form>
      </div>      
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
