//import express
const express = require("express");

//création du router
const router = express.Router();

//import du controller user
const userCtrl = require('../controllers/user');

const auth = require('../middlewares/auth');


//import du middleware passwordValidator
const passwordValidator = require('../middlewares/passwordValidator');

//route pour l'inscription d'un utilisateur à l'application
router.post('/signup', passwordValidator, userCtrl.signUp);

//route pour la connexion d'un utilisateur à l'application
router.post('/login', passwordValidator, userCtrl.login);

//route pour modifier son profil utilisateur
router.put('/:id', auth, userCtrl.modifyProfil);

//route supprimer mon profil d'utilisateur
router.delete('/:id', auth, userCtrl.deleteProfil);

//route pour voir le profil d'un utilisateur
router.get('/:id', auth, userCtrl.getProfil);


module.exports = router;