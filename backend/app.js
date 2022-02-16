//import d'express
const express = require('express');

//import cors
const cors = require('cors');

//import dotenv
const dotenv = require('dotenv');
dotenv.config();

//import de path
const path = require('path');

//import mysql
const mysql = require('mysql');

// import helmet
const helmet = require('helmet');

//import du router user
const userRouter = require('./routes/user');

//import du router posts
const postsRouter = require('./routes/posts'); 

//import du router comments
const commentsRouter = require('./routes/comments');

//connexion à la base données sql
const groupomaniaDBConnect = mysql.createConnection({
    host: process.env.GROUPOMANIA_HOSTNAME,
    user: process.env.GROUPOMANIA_USERNAME,
    password: process.env.GROUPOMANIA_USERPASSWORD
});
groupomaniaDBConnect.connect((error) => {
    if(error) {
        throw error;
    }
    console.log('connexion sql réussie');
});

//création de l'application express
const app = express();

// middleware pour supprimer la sécurité CORS
app.use(cors());

//middleware helmet
app.use(helmet());

//middleware global, transforme le corps de la requete en objet javascript utilisable
app.use(express.json());

// indique à Express qu'il faut gerer la ressource images de manière statique à chaque requête reçue vers la route /images
// __dirname = nom du dossier dans lequel on va se trouver
app.use('/images', express.static(path.join(__dirname, 'images')));

//Utilisation du router user pour la gestion des utilisateurs de l'application 
app.use('/api/auth', userRouter);

//Utilisation du router posts pour la gestion des posts de l'application
app.use('/api/posts', postsRouter);

//Utilisation du router comments pour la gestion des commentaires sur les posts issus de l'application
app.use('/api/posts/:id/comments', commentsRouter);

//export du module app
module.exports = app;