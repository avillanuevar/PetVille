import React, { Component } from "react";
import ReservationService from "../../service/Reservation.service";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProfileService from "../../service/Profile.service";
import NotificationService from "../../service/Notification.service";

class ReservationDetails extends Component {
  constructor(props) {
    super(props);
    this._reservationService = new ReservationService();
    this._profileService = new ProfileService();
    this._notificationService = new NotificationService();
    this.state = {
      reservation: null,
      showModalPetWindow: false,
      showModalHostWindow: false,
      selectedPet: {},
      applicationPet: [],
      checked: false,
      
    };
  }
  petInfo = (idx) => {
   

  

    this.setState({ selectedPet: this.state.reservation.client[idx] })
    this.handlePetShow()
    
  };
  handleHostShow = () => this.setState({ showModalHostWindow: true });
  handleHostClose = () => this.setState({ showModalHostWindow: false });
  handlePetShow = () => this.setState({ showModalPetWindow: true });
  handlePetClose = () => this.setState({ showModalPetWindow: false });
  handleApplyShow = () => this.setState({ showModalApplyWindow: true });
  handleApplyClose = () => this.setState({ showModalApplyWindow: false });

  handleInputChange = e => {
    let copyApplicationPet = [...this.state.applicationPet];
    let { name, value } = e.target;

    if (e.target.checked) {
      copyApplicationPet.push(name);
      console.log(copyApplicationPet);
      this.setState({
        applicationPet: copyApplicationPet
      });
    } else {
      let index = copyApplicationPet.indexOf(name);
      copyApplicationPet.splice(index, 1);
      console.log(copyApplicationPet);
      this.setState({ applicationPet: copyApplicationPet });
    }
  };
  handleSubmit = e => {
    e.preventDefault();
    console.log("mande la notificacion");
    const reservation = this.state.reservation;
    this._notificationService.create({
      author: this.props.loggedInUser._id,
      reciver: reservation.details._id,
      pets: this.state.applicationPet,
      startDay: reservation.startDay,
      startMonth: reservation.startMonth,
      startYear: reservation.startYear,
      endDay: reservation.endDay,
      endMonth: reservation.endMonth,
      endYear: reservation.endYear
    });
  };

  componentDidMount = () => {
    console.log(this.props);
    const reservationId = this.props.match.params.id;
    this._reservationService
      .details(reservationId)
      .then(reservationFromDB =>
        this.setState({ reservation: reservationFromDB.data })
      )
      .then(() => {
        this._profileService
          .profile()
          .then(user => {
            console.log(user);
            this.props.setTheUser(user.data);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log("Error", err));
  };
  agresiveMessage = () => {
    if (
      this.state.selectedPet.agresiveWithPeople &&
      this.state.selectedPet.agresiveWithAnimals
    )
      return "Aggressive: with People & other Animals";
    if (this.state.selectedPet.agresiveWithPeople)
      return "Aggressive: with People";
    if (this.state.selectedPet.agresiveWithAnimals)
      return "Aggressive: with other Animals";
  };
  render() {
    this.state.reservation&&console.log(this.state.reservation);
    return (
      <div>
        {this.state.reservation ? (
          <Container>
            <h1>{this.state.reservation.details.home.title}</h1>
            <Row>
              <Col md={6}>
                <img
                  src={this.state.reservation.details.home.imageUrl}
                  alt={this.state.reservation.details.name}
                ></img>
              </Col>
              <Col md={6}>
                <h3>address:</h3>
                <p>
                  {this.state.reservation.details.home.street},{" "}
                  {this.state.reservation.details.home.city},{" "}
                  {this.state.reservation.details.home.postalCode},{" "}
                  {this.state.reservation.details.home.country}
                </p>
                <p>I Live in a {this.state.reservation.details.home.home}</p>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <h2>Pets</h2>
                {this.state.reservation.client[0] ? (
                  this.state.reservation.client.map((pet, idx) => (
                    <Row>
                      <Button variant="dark" onClick={()=>this.petInfo(idx)}>
                        <Col md={4}>
                          <img src={pet.imageUrl} alt={pet.name}></img>
                        </Col>
                        <Col md={8}>
                          <h3>{pet.name}</h3>
                        </Col>
                      </Button>
                    </Row>
                  ))
                ) : (
                  <h4>There are no pet registered, Be the first one</h4>
                )}
              </Col>
              <Col md={6}>
                <h2>Author</h2>
                <Button variant="dark" onClick={this.handleHostShow}>
                  <Row>
                    <Col md={4}>
                      <img
                        src={this.state.reservation.details.imageUrl}
                        alt={this.state.reservation.details.name}
                      ></img>
                    </Col>
                    <Col md={8}>
                      <h3>{this.state.reservation.details.name}</h3>
                    </Col>
                  </Row>
                </Button>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Button variant="dark" onClick={this.handleApplyShow}>
                  Apply
                </Button>
              </Col>
              <Col md={6}>
                <Link variant="dark" to="/">
                  Back
                </Link>
              </Col>
            </Row>
            <Modal
              show={this.state.showModalHostWindow}
              onHide={this.handleHostClose}
            >
              <Modal.Header closeButton>
                <Modal.Title>Author info</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <img
                  src={this.state.reservation.details.imageUrl}
                  alt={this.state.reservation.details.name}
                ></img>
                <h3>{this.state.reservation.details.name}</h3>
                <hr />
                <p>{this.state.reservation.details.description}</p>
                <p>{this.state.reservation.details.phone}</p>
                <Button onClick={this.handleHostClose}>Back</Button>
              </Modal.Body>
            </Modal>
            <Modal
              show={this.state.showModalPetWindow}
              onHide={this.handlePetClose}
            >
              <Modal.Header closeButton>
                <Modal.Title>Pet info</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <img
                  src={this.state.selectedPet.imageUrl}
                  alt={this.state.selectedPet.name}
                ></img>
                <h3>{this.state.selectedPet.name}</h3>
                <hr />
                <p>{this.state.selectedPet.description}</p>
                <p>{this.state.selectedPet.careDetails}</p>
                <p>{this.agresiveMessage()}</p>
                <Button onClick={this.handlePetClose}>Back</Button>
              </Modal.Body>
            </Modal>
            <Modal
              show={this.state.showModalApplyWindow}
              onHide={this.handleApplyClose}
            >
              <Modal.Header closeButton>
                <Modal.Title>Select pets</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={this.handleSubmit}>
                  {this.props.loggedInUser.pets.map(elm => (
                    <Form.Group>
                      <Form.Label>
                        <div>
                          <img src={elm.imageUrl} alt={elm.name}></img>
                          <h3>{elm.name}</h3>
                        </div>
                      </Form.Label>
                      <Form.Control
                        name={elm._id}
                        type="checkbox"
                        onChange={this.handleInputChange}
                        value={this.state.checked}
                      />
                    </Form.Group>
                  ))}
                  <Button variant="dark" type="submit">
                    Apply
                  </Button>
                  <Button variant="dark" onClick={this.handleApplyClose}>
                    Back
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
          </Container>
        ) : null}
      </div>
    );
  }
}
export default ReservationDetails;
