//import express
const express = require("express");

//import du middleware multer
const multer = require('../middlewares/multer-config');

const auth = require('../middlewares/auth');

//création du router
const router = express.Router();

//import du controller user
const postsCtrl = require('../controllers/posts');

//route pour récupérer tous les posts de la base de données
router.get('/', postsCtrl.getPosts);

//route pour récupérer un post de la base de données
router.get('/:id', postsCtrl.getOnePost);

//route pour créer un post
router.post('/', auth, multer, postsCtrl.createOnePost);

//route pour modifier un post
router.put('/:id', auth, multer, postsCtrl.modifyOnePost);

//route pour supprimer un post
router.delete('/:id', auth, multer, postsCtrl.deleteOnePost);

module.exports = router;