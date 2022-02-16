/**
* ! Import de react, useState
*/
import React, {useState} from "react";

/**
* ! Import des classes de bootstrap
*/
import 'bootstrap';

/**
 * ! Import Axios pour effectuer les requêtes
 */
import Axios from 'axios';

/**
 * ! Import des react-bootstrap components
 */
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

/**
 * ! Login component servant à se logger
 */
function Login() {
  
  /**
   * * Création des useStates email et password
   */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  /**
   * * Vérification du log de l'utilisateur
   */
  const isLogged = localStorage.getItem("token");

  /**
   * * Requête Login : 
   * * connexion de l'utilisateur, 
   * * enregistrement dans le localStorage du token et de l'isAdmin, 
   * * redirection vers la page des posts 
   */
  const loginForm = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:4000/api/auth/login", {
    email: email,
    password: password
    })
    .then((response) => {
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isAdmin", response.data.isAdmin);
      window.location.href="/posts";
    })
    .catch(() => setError("utilisateur ou mot de passe incorrect"));
  };
    
  /**
   * ? Si l'utilisateur n'est pas connecté,
  */
  if(!isLogged) {
    return (
      /**
       * * Affichage du formulaire de connexion avec les react-bootstrap components 
       */      
      <Container>
        <Form onSubmit={ loginForm } className="border border-1 p-3 rounded-3 shadow bg-light mt-5">
          <Form.Group className="mb-3">
            <Form.Label htmlFor="email" className="fw-bold">Email :</Form.Label>
            <InputGroup>
              <InputGroup.Text><i className="fas fa-at"></i></InputGroup.Text>
              <Form.Control required type="email" id="email" name="email" value={ email } onChange={(e) => setEmail(e.target.value)} placeholder="exemple@groupomania.com" />
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="password" className="fw-bold">Mot de passe :</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text><i className="fas fa-lock"></i></InputGroup.Text>
              <Form.Control required type="password" id="password" name="password" value={ password } onChange={(e) => setPassword(e.target.value)} placeholder="entrez votre mot de passe" />
            </InputGroup>
            <p className="text-danger fw-bold">{ error }</p>
            <Form.Text className="text-black"><i className="fas fa-exclamation-circle me-1"></i>Votre mot passe doit contenir au minimum 8 caractères, 1 lettre majuscule, 1 lettre minuscule, 2 chiffres, et <span className="fw-bold">pas de symboles.</span></Form.Text>
          </Form.Group>
          <Button variant="success" type="submit"><i className="fas fa-check-circle me-3"></i>Envoyer</Button>
        </Form>
      </Container>
    )
  } else {
    /**
     * ? Si l'utilisateur est connecté, on le redirige vers la page des posts
     */
    window.location.href = "posts";
  }
};

export default Login;