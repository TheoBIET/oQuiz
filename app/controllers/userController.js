const { User } = require("../models");
// Je charge le module avec une fonction permettant de
const bcrypt = require("bcrypt");

const userController = {
    /**
     * Affiche le formulaire de login
     * @param {Request} req
     * @param {Response} res
     */
    login: (req, res) => {
        res.render("login");
    },
    /**
     * Vérifier que les infossde login saisie paar l'utilisateur sont correctes
     * @param {Request} req
     * @param {Response} res
     */
    checkLogin: async (req, res) => {
        try {
            // 1 - Récuperer le login et le mdp saisis par l'internaute
            const email = req.body.email;
            const password = req.body.password;
            // 2 - Vérifier qu'un utilisateur existe bien avec l'email fourni
            const user = await User.findOne({
                where: {
                    email: email,
                },
            });
            // 3 - Vérifier le mot de passe
            if (bcrypt.compareSync(password, user.password)) {
                delete user.password;
                req.session.user = user;

                if(req.session.redirectAfterLogin) {
                    res.redirect(req.session.redirectAfterLogin);
                    req.session.redirectAfterLogin = null;
                } else {
                    res.redirect('/');
                }

            } else {
                throw new Error("Email ou mot de passe incorrect");
            }
        } catch (error) {
            res.render("login", { error: error.message });
        }
    },
    /**
     * Renvoie le formulaire de connexion
     * @param {Request} req
     * @param {Response} res
     */
    register: (req, res) => {
        res.render("signup");
    },
    /**
     * Enregistrement des données reçues par le
     * formulaire de login
     * @param {Request} request
     * @param {Response} response
     */
    registerSave: async (req, res) => {
        try {
            // 1 - Récupérer les données
            console.log(req.body);

            // 2 - Vérifier la cohérences des données
            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const email = req.body.email;
            const password = req.body.password;
            const passwordConfirm = req.body.passwordConfirm;
            const emailFounded = await User.count({
                where: {
                    email: email,
                },
            });

            const errors = [];

            // champs vides ?
            if (firstname.length === 0) {
                errors.push("Le prénom est obligatoire");
            }

            if (lastname.length === 0) {
                errors.push("Le nom de famille est obligatoire");
            }

            // email valide ?
            if (!email.includes("@")) {
                errors.push("L'email n'est pas valide!");
            }

            if (emailFounded > 0) {
                errors.push("Un compte existe déjà avec cette adresse e-mail");
            }

            // mots de passes identiques ?
            if (password !== passwordConfirm) {
                errors.push("Les mots de passe sont différents");
            } else if (password.length === 0 || passwordConfirm.length === 0) {
                errors.push("Le mots de passe est obligatoire");
            }

            if (errors.length > 0) {
                // En cas d'erreur détectées, on fait un rendu de la vue register
                // En lui transmettant notre tableau d'erreur
                res.render("signup", {
                    errors,
                });
                return;
            }

            // 3 - Enregistrer ces données en BDD
            const hash = bcrypt.hashSync(password, 10);

            const user = User.create({
                firstname,
                lastname,
                email,
                password: hash,
            });

            // 4 - Connecter l'utilisateur (l'enregistrer en session)
            delete user.password;
            req.session.user = user;

            // 5 - Rediriger l'internaute sur sa page profil
            res.redirect("/");

            // response.render('register');
        } catch (error) {
            res.render("signup", { errors: error.message });
        }
    },
    /**
     * Déconnecte l'utilisateur
     * @param {Request} request
     * @param {Response} response
     */
    logout: (req, res) => {
        delete req.session.user;
        delete res.locals.user;
        res.redirect("/");
    },
};

module.exports = userController;
