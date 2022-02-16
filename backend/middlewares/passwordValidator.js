//import de password validator
const passwordValidator = require('password-validator');

//création du schéma Password
const passwordSchema = new passwordValidator();

//model attendu du schéma
passwordSchema
    .is().min(8) // longueur minimal 8 caractères
    .has().uppercase() // contient au moins une lettre majuscule
    .has().lowercase() // contient au moins une lettre minuscule
    .has().digits(2) // contient au moins 2 chiffres
    .has().not().symbols() // ne contient pas de symboles
    .has().not().spaces() // ne contient pas d'espaces

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        return res.status(403).json({
            message: 'le mot de passe doit contenir au moins 8 caractères dont : 1 lettre majuscule, 1 lettre minuscule, 2 chiffres, pas de symboles et d\'espaces.'
        });
    } else {
        next();
    }
};