//import mysql
const mysql = require('mysql');

//import dotenv
const dotenv = require('dotenv');

dotenv.config();

//connexion à la base données sql
const groupomaniaDBConnect = mysql.createConnection({
    host: process.env.GROUPOMANIA_HOSTNAME,
    user: process.env.GROUPOMANIA_USERNAME,
    password: process.env.GROUPOMANIA_USERPASSWORD,
    database: process.env.GROUPOMANIA_DB
});

//controller pour récupérer les commentaires d'un post dont l'id est fourni
exports.getComments = (req, res, next) => {
    /*création de la requête sql pour selectionner les commentaires du post dans la base de données dont l'id est fourni
     par les paramètres de requête*/
    const sqlGetComments = `SELECT comments.id AS id, users.id AS authorId, comments.date AS date, comments.content AS content, users.firstName AS firstName FROM comments JOIN users ON comments.author = users.id WHERE post = ?`;
    /*envoi de la requête au serveur sql*/
    groupomaniaDBConnect.query(sqlGetComments, [req.params.id], (error, result) => {
        if (error) {
            res.status(500).json({
                error
            });
        }
        /*envoi du résultat de la requête sql*/
        res.status(200).json({
            result
        });
        console.log("commentaires récupérés.");
    });
};

//controller pour récupérer un commentaire d'un post dont l'id est fourni
exports.getOneComment = (req, res, next) => {
    /*création de la requête sql pour selectionner les commentaires du post dans la base de données dont l'id est fourni
     par les paramètres de requête*/
    const sqlGetComments = `SELECT comments.id AS id, users.id AS authorId, comments.date AS date, comments.content AS content, users.firstName AS firstName FROM comments JOIN users ON comments.author = users.id WHERE comments.id = ?`;
    /*envoi de la requête au serveur sql*/
    groupomaniaDBConnect.query(sqlGetComments, [req.params.id], (error, result) => {
        if (error) {
            res.status(500).json({
                error
            });
        }
        /*envoi du résultat de la requête sql*/
        res.status(200).json({
            result
        });
    });
};

//controller pour créer un commentaire au sujet d'un post
exports.createOneComment = (req, res, next) => {
    /*création de la requête sql pour créer un commentaire au sujet du post dans la base de données dont l'id est fourni
    par les paramètres de requête*/
    const sqlCreateOneComment = `INSERT INTO comments (content, author, post) VALUES (?, ?, ?)`;
    /*envoi de la requête au serveur sql*/
    groupomaniaDBConnect.query(sqlCreateOneComment, [req.body.content, res.locals.userId, req.params.id], (error, result) => {
        if (error) {
            res.status(500).json({
                error
            });
        }
        /*envoi du message de validation de la création du commentaire*/
        res.status(200).json({
            result
        });
    });
};


//controller pour supprimer un commentaire d'un post dont l'id et l'id utilisateur sont fournis
exports.deleteOneComment = (req, res, next) => {
    /*si l'utilisateur est administrateur (isAdmin === 1)*/
    if (res.locals.isAdmin === 1) {
        /*création de la requête sql pour supprimer un commentaire au sujet du post dans la base de données dont l'id est fourni
        par les paramètres de requête*/
        const sqlDeleteComment = `DELETE FROM comments WHERE id = ?`;
        /*envoi de la requête au serveur sql*/
        groupomaniaDBConnect.query(sqlDeleteComment, [req.params.id], (error) => {
            if (error) {
                res.status(500).json({
                    error
                });
            }
            /*envoi du message de validation de la modification du commentaire*/
            res.status(200).json({
                message: "commentaire supprimé."
            });
        });
    } else {
        /*création de la requête sql pour supprimer un commentaire au sujet du post dans la base de données dont l'id est fourni
        par les paramètres de requête*/
        const sqlDeleteComment = `DELETE FROM comments WHERE id = ? AND author = ?`;
        /*envoi de la requête au serveur sql*/
        groupomaniaDBConnect.query(sqlDeleteComment, [req.params.id, res.locals.userId], (error) => {
            if (error) {
                res.status(500).json({
                    error
                });
            }
            /*envoi du message de validation de la modification du commentaire*/
            res.status(200).json({
                message: "commentaire supprimé."
            });
        });
    }
};