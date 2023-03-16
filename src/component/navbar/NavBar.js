import React, { Component } from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import {
  Link
} from "react-router-dom";

import './NavBar.css';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faHome, faPhone, faUser} from "@fortawesome/free-solid-svg-icons"

export default class MainPage extends Component {
    render() {
        return (
            <div className='navBar'>
                <Navbar bg="dark" variant="dark" className="py-0">
                    <Container>
                    <Navbar.Brand href="/" className="p-0 m-0">
                        <img
                        alt=""
                        src="/logo/logoNavDark.svg"
                        width="100%"
                        height="100%"
                        className="d-inline-block"
                        />{' '}
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">
                            <FontAwesomeIcon icon={faHome} 
                                className="icon-home mx-1"/>
                            <span className='link-text'>
                                Home
                            </span>
                        </Nav.Link>
                        <Nav.Link as={Link} to="/contact">
                        <FontAwesomeIcon icon={faPhone} 
                                className="icon-home mx-1"/>
                            <span className='link-text'>
                                Contact
                            </span>
                        </Nav.Link>
                        
                    </Nav>
                    <Navbar.Toggle />
                    <Nav.Link as={Link} to="/myprofile">
                        <FontAwesomeIcon icon={faUser} 
                                className="icon-user mx-1 text-white"/>
                            <span className='UserName-text text-white'>
                                Saverio
                            </span>
                    </Nav.Link>
                        
                    </Container>
                </Navbar>
                <hr className="bg-light m-0"/>
                <hr className="bg-light m-0"/>
            </div>
        )
    }
}

/*<Nav.Link as={Link} to="/login">Log</Nav.Link>
<Nav.Link as={Link} to="/register">Reg</Nav.Link>


<Navbar.Collapse className="justify-content-end">
                            <Navbar.Text>
                                Signed in: <a href="/myprofile">Mark</a>
                            </Navbar.Text>
                        </Navbar.Collapse>


*/