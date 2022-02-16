//import mysql
const mysql = require('mysql');

//import de file system
const fs = require('fs');

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

//controller pour récupérer les posts de la base de données
exports.getPosts = (req, res, next) => {
    /*récupération de tous les posts présents dans la base de données en faisant une jointure avec la table users
    pour récupérer le prénom de l'auteur*/
    const sqlGetPosts = `SELECT posts.id AS id, posts.title AS title, posts.subject AS subject, posts.img_url AS img_url, posts.date AS date, posts.author AS author, users.firstName AS authorFirstName FROM posts JOIN users ON posts.author = users.id ORDER BY posts.date DESC`;
    /*envoi de la requête au serveur sql*/
    groupomaniaDBConnect.query(sqlGetPosts, (error, result) => {
        if (error) {
            throw error;
        }
        /*envoi du résultat de la requête sql*/
        res.status(200).json({
            result
        });
    });
};

//controller pour récupérer un post de la base de données
exports.getOnePost = (req, res, next) => {
    /*récupération du post présent dans la base de données dont l'id est fourni par les paramètres de requête client en faisant une jointure avec la table users
    pour récupérer le prénom de l'auteur*/
    const sqlGetOnePost = `SELECT posts.title AS title, posts.subject AS subject, posts.img_url AS img_url, posts.date AS date, posts.author AS authorId, users.firstName AS authorFirstName FROM posts JOIN users ON posts.author = users.id WHERE posts.id = ?`;
    /*envoi de la requête au serveur sql*/
    groupomaniaDBConnect.query(sqlGetOnePost, [req.params.id], (error, result) => {
        if (error) {
            throw error;
        }
        /*envoi du résultat de la requête sql*/
        res.status(200).json({
            result
        });
    });
};

//controller pour créer un post
exports.createOnePost = (req, res, next) => {
    /*si la requête contient une image*/
    if (req.file) {
        /*création de l'objet post*/
        const post = {
            title: req.body.title,
            subject: req.body.subject,
            img_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            author: res.locals.userId
        };
        /*création de la requête sql pour insérer le post dans la base de données dont l'id de l'auteur est fourni par le profil utilisateur issu du cookie d'authentification*/
        const sqlCreateOnePost = `INSERT INTO posts (title, subject, img_url, author) VALUES ( ?, ?, ?, ?)`;
        /*envoi de la requête au serveur sql*/
        groupomaniaDBConnect.query(sqlCreateOnePost, [post.title, post.subject, post.img_url, post.author], (error, result) => {
            if (error) {
                throw error;
            }
            /*envoi du résultat de la requête sql*/
            res.status(200).json({
                result
            });
        });
    }
    /*si la requête ne contient pas d'image*/
    else {
        /*création de l'objet post*/
        const post = {
            title: req.body.title,
            subject: req.body.subject,
            author: res.locals.userId
        };
        /*création de la requête sql pour insérer un post dans la base de données dont l'id de l'auteur est fourni par le profil utilisateur issu du cookie d'authentification*/
        const sqlCreateOnePost = `INSERT INTO posts (title, subject, author) VALUES ( ?, ?, ?)`;
        /*envoi de la requête au serveur sql*/
        groupomaniaDBConnect.query(sqlCreateOnePost, [post.title, post.subject, post.author], (error, result) => {
            if (error) {
                throw error;
            }
            /*envoi du résultat de la requête sql*/
            res.status(200).json({
                result
            });
        });
    }
};

//controller pour modifier un post
exports.modifyOnePost = (req, res, next) => {
    /*si l'utilisateur est administrateur (isAdmin === 1)*/
    if (res.locals.isAdmin === 1) {
        /*si la requête contient une image*/
        if (req.file) {
            /*création de l'objet post*/
            const post = {
                title: req.body.title,
                subject: req.body.subject,
                img_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            };
            /*création de la requête sql pour modifier le post dans la base de données dont l'id est fourni par les paramètres de la requête*/
            const sqlModifyOnePost = `UPDATE posts SET title = ?, subject = ?, img_url = ? WHERE id = ?`;
            /*envoi de la requête au serveur sql*/
            groupomaniaDBConnect.query(sqlModifyOnePost, [post.title, post.subject, post.img_url, req.params.id], (error) => {
                if (error) {
                    throw error;
                }
                /*envoi du message de validation de la modification du post*/
                res.status(200).json({
                    message: 'post modifié.'
                });
            });
        }
        /*si la requête ne contient pas d'image*/
        else {
            /*création de l'objet post*/
            const post = {
                title: req.body.title,
                subject: req.body.subject
            };
            /*création de la requête sql pour modifier le post dans la base de données dont l'id est fourni par les paramètres de la requête*/
            const sqlModifyOnePost = `UPDATE posts SET title = ?,  subject = ? WHERE id = ?`;
            /*envoi de la requête au serveur sql*/
            groupomaniaDBConnect.query(sqlModifyOnePost, [post.title, post.subject, req.params.id], (error) => {
                if (error) {
                    throw error;
                }
                /*envoi du message de validation de la modification du post*/
                res.status(200).json({
                    message: 'post modifié.'
                });
            });
        }    
    } else {
        if (req.file) {
            /*création de l'objet post*/
            const post = {
                title: req.body.title,
                subject: req.body.subject,
                img_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            };
            /*création de la requête sql pour modifier le post dans la base de données dont l'id est fourni par les paramètres de la requête*/
            const sqlModifyOnePost = `UPDATE posts SET title = ?, subject = ?, img_url = ? WHERE id = ? AND author = ?`;
            /*envoi de la requête au serveur sql*/
            groupomaniaDBConnect.query(sqlModifyOnePost, [post.title, post.subject, post.img_url, req.params.id, res.locals.userId], (error) => {
                if (error) {
                    throw error;
                }
                /*envoi du message de validation de la modification du post*/
                res.status(200).json({
                    message: 'post modifié.'
                });
            });
        }
        /*si la requête ne contient pas d'image*/
        else {
            /*création de l'objet post*/
            const post = {
                title: req.body.title,
                subject: req.body.subject
            };
            /*création de la requête sql pour modifier le post dans la base de données dont l'id est fourni par les paramètres de la requête*/
            const sqlModifyOnePost = `UPDATE posts SET title = ?,  subject = ? WHERE id = ? AND author = ?`;
            /*envoi de la requête au serveur sql*/
            groupomaniaDBConnect.query(sqlModifyOnePost, [post.title, post.subject, req.params.id, res.locals.userId], (error) => {
                if (error) {
                    throw error;
                }
                /*envoi du message de validation de la modification du post*/
                res.status(200).json({
                    message: 'post modifié.'
                });
            });
        }
    }
};

//controller pour supprimer un post
exports.deleteOnePost = (req, res, next) => {
    /*création de la requête sql pour sélectionner le post dans la base de données dont l'id est fourni par les paramètres de la requête*/
    const sqlGetPosts = `SELECT * FROM posts WHERE id = ?`;
    /*envoi de la requête au serveur sql*/
    groupomaniaDBConnect.query(sqlGetPosts, [req.params.id], (error, result) => {
        if (error) {
            throw error;
        }
        /*création de l'objet post à partir du résultat de la requête sql*/
        const post = result[0];
        /*si l'utilisateur est administrateur (isAdmin === 1)*/
        if (res.locals.isAdmin === 1) {
            /*suppression de l'image du post du dossier 'images'*/
            const filename = post.img_url.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                /*création de la requête sql pour supprimer le post dans la base de données dont l'id est fourni par 
                les paramètres de la requête*/
                const sqlDeleteOnePost = `DELETE FROM posts WHERE id = ?`;
                /*envoi de la requête au serveur sql*/
                groupomaniaDBConnect.query(sqlDeleteOnePost, [req.params.id], (error, result) => {
                    if (error) {
                        throw error;
                    }
                    /*envoi du message de validation de la suppression du post*/
                    res.status(200).json({
                        message: "post supprimé."
                    });
                });
            });
        } else {
            if(Number(res.locals.userId) === Number(post.author)) {
                /*suppression de l'image du post du dossier 'images'*/
                const filename = post.img_url.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    /*création de la requête sql pour supprimer le post dans la base de données dont l'id est fourni par 
                    les paramètres de la requête*/
                    const sqlDeleteOnePost = `DELETE FROM posts WHERE id = ? AND author = ?`;
                    /*envoi de la requête au serveur sql*/
                    groupomaniaDBConnect.query(sqlDeleteOnePost, [req.params.id, res.locals.userId], (error, result) => {
                        if (error) {
                            throw error;
                        }
                        /*envoi du message de validation de la suppression du post*/
                        res.status(200).json({
                            message: "post supprimé."
                        });
                    });
                });
            } else {
                res.status(401).json({message: "non autorisé"});
            }
        }
    });
};