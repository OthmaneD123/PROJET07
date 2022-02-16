/**
 * * import scss
 */
 import './Post.scss'
 /**
 * ! import du useState et useEffect
 */
 import { useState, useEffect } from "react";
 
 /**
 * ! import des classes boostrap
 */
 import 'bootstrap';
  
 /**
 * ! import Axios
 */
 import Axios from 'axios';
  
 /**
 * ! Import de Comment component
 */
 import Comment from "../Comment/Comment"
 
 
 /**
 * ! import des react-boostrap components
 */
 import Container from 'react-bootstrap/Container';
 import Card from 'react-bootstrap/Card';
 import Button from 'react-bootstrap/Button';
 import Image from 'react-bootstrap/Image';
 import Modal from 'react-bootstrap/Modal';
 import Form from 'react-bootstrap/Form';
 import Accordion from 'react-bootstrap/Accordion';
 import Row from 'react-bootstrap/Row';
 import Col from 'react-bootstrap/Col';
 
 /**
 * ! Création des constantes issues du localStorage
 */
 const token = localStorage.getItem("token");
 const isAdmin = localStorage.getItem("isAdmin");
 const userId =  Number(localStorage.getItem("userId"));
  
 /**
 * ! Post component affichant un post
 */
 function Post(props) {
      
     /**
     * * Création des useStates pour l'affichage du modal de visualisation du post
     */
     const [showModal, setShowModal] = useState(false);          //useState pour l'ouverture/fermeture du modal de visualisation
     const [commentToSend, setCommentToSend] = useState("");     //useState pour valeur du champ de formulaire d'envoi d'un nouveau commentaire
     const [comments, setComments] = useState([]);               //useState pour la liste des commentaires issus de la base de données
     const [list, setList] = useState([]);                       //useState pour la liste des commentaires à afficher
 
     /**
     * * UseEffect qui télécharge les commentaires en fonction des posts
     */
     useEffect(() => {
         Axios.get(`http://localhost:4000/api/posts/${props.postId}/comments`)
         .then((response) =>{
             setComments(response.data.result);
         })
         .catch(error => console.log(error));
     }, [props.postId]);
     
     function displayDateUpload(date) {
         const today = new Date();
         const diff = today.getTime() - date.getTime() ; 
         if( diff > 0 && diff <= 60000 ) {
             const displayDiff = `posté il y a ${(diff/1000).toFixed(0)} seconde(s)`;
             return displayDiff ;
         } else if( diff > 60000 && diff <= 3600000 ) {
             const displayDiff = `posté il y a ${(diff/60000).toFixed(0)} minute(s)`;
             return displayDiff ;
         } else if( diff > 3600000 && diff <= 86400000) {
             const displayDiff = `posté il y a ${(diff/3600000).toFixed(0)} heure(s)`;
             return displayDiff ;
         } else {
             const displayDiff = `posté il y a ${(diff/86400000).toFixed(0)} jour(s)` ;
             return displayDiff ;
         }
     }
     /**
     * * Génération de la liste des commentaires à afficher
     */
     var listComments= [];
 
     function DisplayComment(comments) {
         /**
         * ? Si je suis administrateur, isAuthor = true pour tous les commentaires
         */
         if(isAdmin > 0) {
             listComments = comments.map((comment) => <li key={comment.id}><Comment commentAuthorId={comment.authorId} isAuthor={true} commentAuthor={comment.firstName} commentId={comment.id} commentContent={comment.content} commentDate={new Date(comment.date)} /></li>) ;
             setList(listComments);
         } else {
             /**
              * ? Si je ne suis pas administrateur, pour chaque commentaire
              */
             for(let comment of comments){
                 /**
                 * ? Si je suis l'auteur du commentaire, isAuthor = true pour le commentaire
                 */
                 if(Number(comment.authorId) === userId){
                     const commentToDisplay = <li key={comment.id}><Comment commentAuthorId={comment.authorId} isAuthor={true} commentAuthor={comment.firstName} commentId={comment.id} commentContent={comment.content} commentDate={new Date(comment.date)} /></li> ;
                     listComments.push(commentToDisplay);
                     /**
                     * ? Si je ne suis pas l'auteur du commentaire, isAuthor = false pour le commentaire
                     */
                 } else {
                     const commentToDisplay = <li key={comment.id}><Comment commentAuthorId={comment.authorId} isAuthor={false} commentAuthor={comment.firstName} commentId={comment.id} commentContent={comment.content} commentDate={new Date(comment.date)} /></li>;
                     listComments.push(commentToDisplay);
                 }
             }
         }
         setList(listComments);
     };
     
 
     /**
     * * Création des fonctions nécessaires au modal de visualisation du post
     */
     const HandleCloseModal = () => {        //fermeture du modal de visualisation du post
         setShowModal(false);
         window.location.reload();
     };
     const handleShowModal = () => {         //ouverture du modal de visualisation du post
         setShowModal(true);
         DisplayComment(comments);
     };
     const sendNewComment = (event) => {     //requête d'envoi et mise à jour de la liste des commentaires
         event.preventDefault();
         const newComment = { content: commentToSend };
         Axios.defaults.headers['Authorization'] =`Bearer ${token}`;
         /**
          * * Envoi du commentaire au serveur de la base de données
          */
         Axios.post(`http://localhost:4000/api/posts/${props.postId}/comments`, newComment)
             .then((response) => {
                 setCommentToSend("");            
                 /**
                  * * Récupération du nouveau commentaire de la base de données
                  */
                 Axios.get(`http://localhost:4000/api/posts/${props.postId}/comments/${response.data.result.insertId}`)
                     .then((response) => {
                         /**
                          * * Mise à jour visuelle de la liste des commentaires associée au post
                          */
                         const newCommentToDisplay = response.data.result[0] ;
                         comments.push(newCommentToDisplay);
                         DisplayComment(comments);
                     });
             })
         .catch(error => console.log(error));
     };
 
     /**
     * * Création des useStates pour l'affichage du modal de modification du post
     */
     const [showModifyModal, setShowModifyModal] = useState(false);
     const [title, setTitle] = useState(`${props.postTitle}`);
     const [subject, setSubject] = useState(`${props.postSubject}`);
      
     /**
     * * Création des fonctions pour ouvrir et fermer le modal de modification
     */
     const handleCloseModifyModal = () => setShowModifyModal(false);
     const handleShowModifyModal = () => setShowModifyModal(true);
      
     /**
     * * Création de la fonction d'envoi de la modification du post
     */
     const modifyOnePost = (event) => {
         event.preventDefault();
         const modifyFormData = new FormData(document.getElementById("postForm"));
         Axios.defaults.headers['Authorization'] =`Bearer ${token}`;
         Axios.put(`http://localhost:4000/api/posts/${props.postId}`, modifyFormData)
             .then((result) => {
             window.location.href = "posts";
         })
         .catch(error => console.log(error));
     };
  
     /**
     * * Création de la fonction de suppression du post
     */
     const deletePost = (event) => {
         event.preventDefault();
         Axios.defaults.headers['Authorization'] =`Bearer ${token}`;
         console.log(props.postId);
         Axios.delete(`http://localhost:4000/api/posts/${props.postId}`)
             .then((result) => {
             window.location.href = "posts";
         })
         .catch(error => console.log(error));
     };
      
     /**
     * * Création de la constante isAuthor et la route du profil utilisateur pour le post
     */
     const isAuthor = props.isAuthor ;
     
     const route = `/profil/${props.postAuthorId}`;
     
     /**
     * ? Si l'utilisateur est auteur ou isAdmin du post
     */
     if(isAuthor) {    
         return (
             /**
             * * Création du post sous forme de Card react-component
             */
            <li className="mb-5">
                 <Card className="m-2 shadow card">
                     <Card.Header className="d-flex flex-row justify-content-between">
                         <div>
                             <i className="fas fa-sticky-note fs-5 me-3 text-warning"></i>
                             <span className="text-capitalize fw-bold h6"><a href={route}>{ props.postAuthor }</a></span>                    
                         </div>
                         <span className="ms-5">{ displayDateUpload(props.postDate) }</span>
                     </Card.Header>
                     <Card.Body className="d-flex flex-row justify-content-between">
                         <div>
                             <Card.Title className="title"><h2 className='h3'>{ props.postTitle }</h2></Card.Title>
                             <Card.Text>{ props.postSubject }</Card.Text>
                         </div>
                         <div className="divImg">
                             <Card.Img className="cardImg" fluid="true" alt={ props.postTitle } src={ props.postImgUrl } />
                         </div>
                     </Card.Body>
                     <Card.Footer className="d-flex flex-row justify-content-around">
                         {/*logique pour la visualisation du post avec ses commentaires*/}
                         <Button variant="warning" className="rounded-pill px-md-3 me-md-2 btn-sm" onClick={ handleShowModal }>
                             <i className="fas fa-eye"></i>
                             <span className="d-none d-md-inline ms-md-1">Voir</span>
                         </Button>
                         <Modal fullscreen show={ showModal } onHide={ HandleCloseModal }>
                             <Modal.Header closeButton>
                                 <a href={ route } className="text-capitalize">{props.postAuthor}</a>, { displayDateUpload(props.postDate) }
                             </Modal.Header>
                             <Modal.Body>
                                 <Container>
                                     <Row>
                                         <Col xs={12} lg={7}>
                                             <Card className=" mb-5 me-1 border border-1 shadow">
                                                 <Card.Header className="fw-bold fs-6 text-end">
                                                     { props.postTitle }
                                                 </Card.Header>
                                                 <Card.Img alt={props.postTitle} fluid="true" variant="top" as={ Image } src={ props.postImgUrl } />
                                                 <Card.Body>
                                                     <Card.Title>{ props.postTitle }</Card.Title>
                                                     <Card.Text>{ props.postSubject }</Card.Text>
                                                 </Card.Body>
                                                 <Card.Footer className="text-end">
                                                     { comments.length } commentaire(s)
                                                 </Card.Footer>
                                             </Card>
                                         </Col>
                                         <Col xs={12} lg={5}>
                                             <Accordion className="shadow">
                                                 <Accordion.Item eventKey="0">
                                                     <Accordion.Header>Commentaires</Accordion.Header>
                                                     <Accordion.Body>
                                                         <ul className="list-unstyled">
                                                             { list }
                                                         </ul>
                                                         <Form onSubmit={ sendNewComment } className="mt-3 mb-3 border border-1 p-3">
                                                             <Form.Group className="mt-3 mb-3">
                                                                 <Form.Label htmlFor="comment">Commenter le post</Form.Label>
                                                                 <Form.Control name="comment" id="comment" type="text" value={ commentToSend } onChange={ (e) => setCommentToSend(e.target.value) } />
                                                             </Form.Group>                
                                                             <Button variant="primary" type="submit">
                                                                 Envoyer
                                                             </Button>
                                                         </Form>
                                                     </Accordion.Body>
                                                 </Accordion.Item>
                                             </Accordion>
                                         </Col>
                                     </Row>
                                 </Container>
                             </Modal.Body>
                         </Modal>
                         {/*logique pour la modification du post */}
                         <Button onClick={ handleShowModifyModal } variant="primary" className="rounded-pill px-md-3 me-md-2 btn-sm">
                             <i className="far fa-edit"></i>
                             <span className="d-none d-md-inline ms-md-1">Modifier</span>
                         </Button>
                         <Modal fullscreen show={ showModifyModal } onHide={ handleCloseModifyModal }>
                             <Modal.Header closeButton>
                                 <Modal.Title><span className="text-decoration-underline">Modifier le post :</span> { props.postTitle }</Modal.Title>
                             </Modal.Header>
                             <Modal.Body>
                                 <Form id="postForm" className="border border-1 rounded-3 border-black py-2 px-3 mt-3" onSubmit={ modifyOnePost }>
                                     <Form.Group className="mb-3">
                                         <Form.Label htmlFor="title">Titre</Form.Label>
                                         <Form.Control name="title" id="title" type="text" value={ title } onChange={ (e) => setTitle(e.target.value) } />
                                     </Form.Group>
                                     <Form.Group className="mb-3">
                                         <Form.Label htmlFor="subject">Contenu</Form.Label>
                                         <Form.Control name="subject" id="subject" type="text" value={ subject } onChange={ (e) => setSubject(e.target.value) } />
                                     </Form.Group>
                                     <Form.Group className="mb-3">
                                         <Form.Label htmlFor="image">Image</Form.Label>
                                         <Form.Control name="image" id="image" type="file" />
                                     </Form.Group>
                                     <Button variant="primary" type="submit">
                                         Soumettre
                                     </Button>
                                 </Form>
                             </Modal.Body>
                         </Modal>
                         {/*logique pour la suppression du post*/}
                         <Button onClick={ deletePost } variant="danger" className="rounded-pill px-md-3 me-md-2 btn-sm">
                             <i className="far fa-trash-alt"></i>
                             <span className="d-none d-md-inline ms-md-1">Supprimer</span>
                         </Button>
                     </Card.Footer>        
                 </Card>
            </li>
         )    
     }
     /**
     * ? Si l'utilisateur n'est pas isAdmin ou autheur du post
     */
      else { 
         return (
             <li className="mb-5">
                 <Card className="m-2 shadow card">
                     <Card.Header className="d-flex flex-row justify-content-between">
                         <div>
                             <i className="fas fa-sticky-note fs-5 me-3 text-warning"></i>
                             <span className="text-capitalize fw-bold h6"><a href={route}>{ props.postAuthor }</a></span>
                         </div>
                         <span className="ms-5 date">{ displayDateUpload(props.postDate) }</span>
                     </Card.Header>
                     <Card.Body className="d-flex flex-row justify-content-between">
                         <div>
                             <Card.Title className="title"><h2 className='h3'>{ props.postTitle }</h2></Card.Title>
                             <Card.Text>{ props.postSubject }</Card.Text>
                         </div>
                         <div className="divImg">
                             <Card.Img className="cardImg" fluid="true" alt={ props.postTitle } src={ props.postImgUrl } />
                         </div>
                     </Card.Body>
                     <Card.Footer className="d-flex flex-row justify-content-around">
                         {/*logique pour la visualisation du post avec ses commentaires*/}
                         <Button variant="warning" className="rounded-pill px-md-3 me-md-2 btn-sm" onClick={ handleShowModal }>
                             <i className="fas fa-eye"></i>
                             <span className="d-none d-md-inline ms-md-1">Voir</span>
                         </Button>
                         <Modal fullscreen show={ showModal } onHide={ HandleCloseModal }>
                             <Modal.Header closeButton>
                                 <a href={ route } className="text-capitalize">{props.postAuthor}</a>, { displayDateUpload(props.postDate) }
                             </Modal.Header>
                             <Modal.Body>
                                 <Container>
                                     <Row>
                                         <Col xs={12} lg={7}>
                                             <Card className=" mb-5 me-1 border border-1 shadow">
                                                 <Card.Header className="fw-bold fs-6 text-end">
                                                     { props.postTitle }
                                                 </Card.Header>
                                                 <Card.Img alt={props.postTitle} fluid="true" variant="top" as={ Image } src={ props.postImgUrl } />
                                                 <Card.Body>
                                                     <Card.Title>{ props.postTitle }</Card.Title>
                                                     <Card.Text>{ props.postSubject }</Card.Text>
                                                 </Card.Body>
                                                 <Card.Footer className="text-end">
                                                     { comments.length } commentaire(s)
                                                 </Card.Footer>
                                             </Card>
                                         </Col>
                                         <Col xs={12} lg={5}>
                                             <Accordion className="shadow">
                                             <Accordion.Item eventKey="0">
                                                 <Accordion.Header>
                                                     Commentaires
                                                 </Accordion.Header>
                                                     <Accordion.Body>
                                                         <ul className="list-unstyled">
                                                             { list }
                                                         </ul>
                                                         <Form onSubmit={ sendNewComment } className="mt-3 mb-3 border border-1 p-3">
                                                             <Form.Group className="mt-3 mb-3">
                                                                 <Form.Label htmlFor="comment">Commenter le post</Form.Label>
                                                                 <Form.Control name="comment" id="comment" type="text" value={ commentToSend } onChange={ (e) => setCommentToSend(e.target.value) } />
                                                             </Form.Group>                
                                                             <Button variant="primary" type="submit">
                                                                 Envoyer
                                                             </Button>
                                                         </Form>                                        
                                                     </Accordion.Body>
                                             </Accordion.Item>
                                             </Accordion>
                                         </Col>
                                     </Row>
                                 </Container>
                             </Modal.Body>
                         </Modal>
                     </Card.Footer>        
                 </Card>
             </li>
         ) 
     }
      
 }
 
 export default Post ;