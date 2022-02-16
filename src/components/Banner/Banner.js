//import des classes de bootstrap
import 'bootstrap';

//import du logo groupomania
import logo from '../icon-left-font-monochrome-black.png';
import './Banner.scss'

//import du Outlet
import { Outlet } from "react-router-dom";

//import des react-bootstrap components
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'


//composant React Banner correspondant à la barre de navigation
function Banner() {

  /*vérification du log de l'utilisateur*/
  const isLogged = localStorage.getItem("token");
  const profilHref = `/profil/${Number(localStorage.getItem("userId"))}`;
  
  /*déconnexion de l'utilisateur en vidant le localStorage (token, isAdmin)*/
  const isLogOut = () => {
    localStorage.clear();
  }

  /*si l'utilisateur n'est pas connecté,*/
  if(!isLogged) {
    return (
      /*barre de navigation avec les react-bootstrap components*/
      <header>
        <Navbar className="sticky-top" bg="light" expand="md" variant="light">
          <Container>
            <Navbar.Brand href="/connexion">
              <img
                alt="logo groupomania"
                src= { logo }
                width="275"
                height="70"
                className="d-inline-block align-top"
              />{' '}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-center justify-content-md-end" id="basic-navbar-nav">
              <Nav.Item className="btn btn-info btn-sm rounded-pill p-0 me-3">
                <Nav.Link className="text-black fw-bold" href="/inscription"><i className="fas fa-user-plus me-3"></i>Inscription</Nav.Link>
              </Nav.Item>
              <Nav.Item className="btn btn-success btn-sm rounded-pill p-0">
                <Nav.Link className="text-white fw-bold" href="/connexion"><i className="fas fa-sign-in-alt me-3"></i>Connexion</Nav.Link>
              </Nav.Item>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <section className='hero-image d-none d-md-block'>
          <article className="hero-text">
            <h1 className='fw-bold fs-1'>Bienvenue sur votre réseau social</h1>
          </article>
        </section>
        <Outlet/>
      </header>
    )
  } else {
    /*si l'utilisateur est connecté,*/
    return (
      /*barre de navigation avec les react-bootstrap components*/
      <header>
        <Navbar className="sticky-top" bg="light" expand="md" variant="light">
          <Container>
            <Navbar.Brand href="/posts">
              <img
                alt="logo groupomania"
                src= { logo }
                width="275"
                height="70"
                className="d-inline-block align-top"
              />{' '}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
                <Nav.Item className="d-block-inline d-md-none btn btn-primary btn-sm rounded-pill p-0 me-1">
                  <Nav.Link className="text-white" href={ profilHref }><i className="far fa-id-card me-1"></i>Profil</Nav.Link>
                </Nav.Item>
                <Nav.Item className="d-block-inline d-md-none btn btn-secondary btn-sm rounded-pill p-0 me-1">
                  <Nav.Link className="text-white" href="/nouveauPost"><i className="far fa-envelope me-1"></i>Nouveau sujet</Nav.Link>
                </Nav.Item>
              <Nav.Item className="btn btn-danger btn-sm rounded-pill p-0">
                <Nav.Link onClick={ isLogOut } className="text-white" href="/connexion"><i className="fas fa-sign-out-alt me-1"></i>Deconnecter</Nav.Link>
              </Nav.Item>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <section className='hero-image d-none d-md-block'>
          <article className="hero-text">
            <h1 className='fw-bold fs-1'>Bienvenue sur le forum <i className="fas fa-door-open fs-1 text-primary"></i></h1>
          </article>
        </section>
        <Outlet/>
      </header> 
    )
  }
}

export default Banner;
