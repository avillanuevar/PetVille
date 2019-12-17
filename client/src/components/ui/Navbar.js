import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Service from "../../service/Auth.service";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this._service = new Service();
  }

  logoutUser = () => {
    this._service
      .logout()
      .then(x => this.props.setUser(false))
      .catch(err => console.log(err));
  };
  host=()=>{
  return (
    this.props.loggedInUser.class == "host" && (
      <Nav.Link as="li">
        <Link to="/myHome">My Home</Link>
      </Nav.Link>
    )
  );

  }

  render() {
    const saludo = this.props.loggedInUser
      ? this.props.loggedInUser.name
      : "Guest";

    return this.props.loggedInUser ? (
      <Navbar bg="dark" variant="dark" expand="md">
        <Navbar.Brand><Nav.Link as="li">
          <Link to="/">PetH</Link>
        </Nav.Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Nav.Link as="li">
              <Link to="/">Home</Link>
            </Nav.Link>
            <Nav.Link as="li">
              <Link to="/profile">My Profile</Link>
            </Nav.Link>
            <Nav.Link as="li">
              <Link to="/myPets">My Pets</Link>
            </Nav.Link>
            <Nav.Link as="li">
              <Link to="/reservations">Reservations</Link>
            </Nav.Link>
            {this.host()}
            <Nav.Link as="li" onClick={this.logoutUser}>
              Logout
            </Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <Navbar.Text>Welcome {saludo}</Navbar.Text>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    ) : (
      <Navbar bg="dark" variant="dark" expand="md">
        <Navbar.Brand>PetVille</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Nav.Link as="li">
              <Link to="/">Home</Link>
            </Nav.Link>
            <Nav.Link as="li">
              <Link to="/signup">SignUp</Link>
            </Nav.Link>
            <Nav.Link as="li">
              <Link to="/login">Login</Link>
            </Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <Navbar.Text>Welcome {saludo}</Navbar.Text>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Navigation;