/**
* ! import du useState et useEffect
*/
import { useState, useEffect } from "react";

/**
 * ! Import de useParams
 */
import { useParams } from 'react-router-dom';
/**
* ! import des classes boostrap
*/
import 'bootstrap';

/**
* ! import Axios
*/
import Axios from 'axios';


/**
* ! import des react-boostrap components
*/
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';

/**
 * ! import de l'avatar
 */
import Avatar from '../avatar.png';

/**
* ! Création des constantes issues du localStorage
*/
const token = localStorage.getItem("token");
const isAdmin = localStorage.getItem("isAdmin");
const userId = Number(localStorage.getItem("userId"));

function Profil() {
    
    /**
    * * Création des useStates pour l'affichage du profil
    */
     const [profil, setProfil] = useState([]);

    /**
     * Récupération de l'id en parammètre dans l'url de la page
     */
    const params = useParams();

     /**
    * * Envoi de la requête au serveur
    */
      useEffect(() => {
        Axios.defaults.headers['Authorization'] =`Bearer ${token}`;
        Axios.get(`http://localhost:4000/api/auth/${params.id}`)
        .then((response) =>{
            setProfil(response.data.result[0]);
        })
        .catch(error => console.log(error));
    }, [params.id]);
    
    /**
    * * Création des useStates pour l'affichage du modal de modification du profil
    */
    const [showModifyModal, setShowModifyModal] = useState(false);
    const [firstName, setFirstName] = useState(`${profil.firstName}`);
    const [lastName, setLastName] = useState(profil.lastName);
    const [email, setEmail] = useState(profil.email);

    /**
    * * Création des fonctions pour le fonctionnement du modal de modification
    */
    const handleCloseModifyModal = () => {      //Ferme le modal et met à jour l'affichage du profil
        setShowModifyModal(false);
        profil.firstName = firstName;
        profil.lastName = lastName;
        profil.email = email;
        document.getElementById("profilLastName").innerHTML = lastName;
        document.getElementById("profilFirstName").innerHTML = firstName;
        document.getElementById("profilEmail").innerHTML = email;
    };
    const handleShowModifyModal = () => {       //Affiche le modal avec les infos utilisateurs dans les champs de formulaire
        setShowModifyModal(true);
        setFirstName(profil.firstName);
        setLastName(profil.lastName);
        setEmail(profil.email);
    };
    const modifyMyProfil = (event) => {         //Modifie son profil utilisateur dans la base données
        event.preventDefault();
        const newProfil = {
            firstName : firstName,
            lastName : lastName,
            email : email
        };
        Axios.defaults.headers['Authorization'] =`Bearer ${token}`;
        Axios.put(`http://localhost:4000/api/auth/${params.id}`, newProfil)
        .then((response) =>{
            console.log(response.data.result);
            handleCloseModifyModal();
        })
        .catch(error => console.log(error));
    };
    const deleteMyProfil = (event) => {         //Supprime son profil utilisateur de la base de données, vide le localStorage et ramène vers la page de connexion
        if(isAdmin > 0) {
            Axios.defaults.headers['Authorization'] =`Bearer ${token}`;
            Axios.delete(`http://localhost:4000/api/auth/${params.id}`)
            .then(() => {
                window.location.href = "/posts";
            })
            .catch(error => console.log(error));    
        } else {
            Axios.defaults.headers['Authorization'] =`Bearer ${token}`;
            Axios.delete(`http://localhost:4000/api/auth/${params.id}`)
            .then(() => {
                localStorage.clear();
                window.location.href = "/connexion";
            })
            .catch(error => console.log(error));
        }
    };

    /**
     * * Redirection vers la liste des posts
     */
    const Redirect = () => {
        window.location.href='/posts';
    }


    /**
     * ? Si l'utilisateur n'est pas loggé
     */
    if(!token) {
        window.location.href = "/connexion";
    } else {
        /**
     * * Création de la carte du profil de l'utilisateur
     */
    /**
     * ? Si l'utilisateur est isAdmin ou que le profilId est égal à l'userId,
     */
    if(isAdmin > 0 || profil.id === userId ) {
        return(
            <Container className="d-flex flex-column align-items-center justify-content-center">
                <Button className="mt-3" onClick={ Redirect }>Retour à la liste des sujets</Button>
                <Card className="w-75 mt-5" bg="light">
                    <Card.Header className="fw-bold text-white bg-success">
                        <span className="fs-4">&#127775; </span> Profil de <span className="text-uppercase">{profil.firstName}</span>
                    </Card.Header>
                    <Card.Body>
                        <ul className="list-unstyled d-md-flex flex-row justify-content-around align-items-center">
                            <li>
                                <Card.Img as={ Image } roundedCircle className="image" src={ Avatar } />
                            </li>
                            <li>
                                <ul className="mt-3 mt-md-0">
                                    <li className="text-capitalize">
                                        <span className="text-capitalize fw-bold">Prénom :</span> <span id="profilFirstName">{profil.firstName}</span>,
                                    </li>
                                    <li className="text-capitalize">
                                        <span className="fw-bold">Nom :</span> <span id="profilLastName">{profil.lastName}</span>,
                                    </li>
                                    <li>
                                        <span className="fw-bold">Email :</span> <span id="profilEmail">{profil.email}</span>,
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </Card.Body>
                    <Card.Footer>
                        <ul className="list-unstyled d-flex flex-row justify-content-between justify-content-md-around">
                            <li>
                                <Button onClick={ handleShowModifyModal } variant="warning">Modifier</Button>
                                <Modal fullscreen show={ showModifyModal } onHide={ handleCloseModifyModal }>
                                    <Modal.Header closeButton>
                                        <Modal.Title><span className="text-decoration-underline">Modifier mon Profil :</span></Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form id="postForm" className="border border-1 rounded-3 border-black py-2 px-3 mt-3" onSubmit={ modifyMyProfil }>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="firstName">Prénom :</Form.Label>
                                                <Form.Control name="firstName" id="firstName" type="text" value={ firstName } onChange={ (e) => setFirstName(e.target.value) } />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="lastName">Nom :</Form.Label>
                                                <Form.Control name="lastName" id="lastName" type="text" value={ lastName } onChange={ (e) => setLastName(e.target.value) } />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="email">Email :</Form.Label>
                                                <Form.Control name="email" id="email" type="text" value={ email } onChange={ (e) => setEmail(e.target.value) } />
                                            </Form.Group>
                                            <Button variant="primary" type="submit">
                                                Soumettre
                                            </Button>
                                        </Form>
                                    </Modal.Body>
                                </Modal>
                            </li>
                            <li>
                                <Button onClick={ deleteMyProfil } variant="danger">
                                    Supprimer
                                </Button>
                            </li>
                        </ul>
                    </Card.Footer>
                </Card>
            </Container>
        )
    }
    /**
     * ? Si ce n'est pas le cas,
     */
    else {
        return(
            <Container className="d-flex flex-column align-items-center justify-content-center">
                <Button className="mt-3" onClick={ Redirect }>Retour à la liste des sujets</Button>
                <Card className="w-75 mt-5" bg="light">
                    <Card.Header className="fw-bold text-white bg-success">
                        <span className="fs-4">&#127775; </span> Profil de <span className="text-uppercase">{profil.firstName}</span>
                    </Card.Header>
                    <Card.Body>
                        <ul className="list-unstyled d-md-flex flex-row justify-content-around align-items-center">
                            <li>
                                <Card.Img as={ Image } roundedCircle className="image" src={ Avatar } />
                            </li>
                            <li>
                                <ul className="mt-3 mt-md-0">
                                    <li className="text-capitalize">
                                        <span className="text-capitalize fw-bold">Prénom :</span> <span id="profilFirstName">{profil.firstName}</span>,
                                    </li>
                                    <li className="text-capitalize">
                                        <span className="fw-bold">Nom :</span> <span id="profilLastName">{profil.lastName}</span>,
                                    </li>
                                    <li>
                                        <span className="fw-bold">Email :</span> <span id="profilEmail">{profil.email}</span>,
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </Card.Body>
                </Card>
            </Container>
        )
    }
    }
    
}

export default Profil;