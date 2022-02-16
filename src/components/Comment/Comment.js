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
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
 
/**
* ! Création des constantes issues du localStorage
*/
const token = localStorage.getItem("token");

/**
* ! Comment component affichant un commentaire
*/
function Comment(props) {

    const postId = props.postId;
    const isAuthor = props.isAuthor;
    const route = `/profil/${props.commentAuthorId}`;

    const deleteComment = (event) => {
        event.preventDefault();
        /**
        * Requête Axios pour suppression du commentaire de la base de données
        */
        Axios.defaults.headers['Authorization'] =`Bearer ${token}`;
        Axios.delete(`http://localhost:4000/api/posts/${postId}/comments/${props.commentId}`)
            .then((result) => {
                console.log(result);
            })
            .catch(error => console.log(error));
        /**
        * * Suppression du commentaire du DOM de la page
        */
        const commentId = event.target.dataset.commentid;
        document.getElementById(commentId).remove();
    };

    /**
     * * Génération du temps de post
     */
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

    if(isAuthor) {
        return(
            <Card id={props.commentId} className="mb-3 w-100">
                <Card.Header className="d-flex flex-row justify-content-between">
                    <div className="text-capitalize">
                        <a href={ route }>{props.commentAuthor}</a>
                    </div>
                    <div>
                        {displayDateUpload(props.commentDate)}
                    </div>
                </Card.Header>
                <Card.Body>
                    {props.commentContent}
                </Card.Body>
                <Card.Footer>
                    <Button data-commentid={props.commentId} onClick={ deleteComment } variant="danger" className="rounded-pill px-3 me-md-2 btn-sm">
                        Supprimer
                    </Button>
                </Card.Footer>
            </Card>
        )
    } else {
        return(
            <Card id={props.commentId} className="mb-3 w-100">
                <Card.Header className="d-flex flex-row justify-content-between">
                    <div className="text-capitalize">
                        <a href={ route }>{props.commentAuthor}</a>
                    </div>
                    <div>
                        {displayDateUpload(props.commentDate)}
                    </div>
                </Card.Header>
                <Card.Body>
                    {props.commentContent}
                </Card.Body>
            </Card>
        )
    }
}

export default Comment ;