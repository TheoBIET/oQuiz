const { Quiz } = require("../models/index");
const { sequelize } = require("../models/answer");
const { request } = require("express");

const quizController = {
    /**
     * Fonction qui gère l'affichage d'un Quiz
     * Elle va récupérer toutes les données d'un Quiz et les envoie à la vue
     * -> Quiz
     *    -> L'auteur
     *    -> Les tags
     *    -> Les questions
     *       -> La difficulté
     * @param {Request} req
     * @param {Response} res
     */
    quiz: async (req, res) => {
        // Si l'internaute n'a pas propriété user dans sa session
        // il n'est pas connecté
        if (!req.session.user) {
            // On le renvoie sur la page login
            // response.redirect('/login');

            // Je stocke en session la page vers laquelle il faudra rediriger
            // l'internaute une fois qu'il sera loggué. 
            // Ex : /quiz/1
            req.session.redirectAfterLogin = req.path;

            // Au lieu de renvoyer le HTML du quiz, on lui envoie le HTML
            // de la vue "login"
            res.render('login', {
                error: 'Veuillez vous connecter pour jouer !'
            });
            return;
        }

        // Récupérer un quiz
        const quiz = await Quiz.findByPk(req.params.id, {
            include: [
                'author',
                'tags',
                {
                    association: 'questions',
                    include: [
                        'answers',
                        'level'
                    ],
                }
            ],

            order: [
                // Comment trier les questions associées au Quiz par ordre 
                // alphabétique
                ['questions', 'question', 'ASC'],
                // Puis mélanger les réponses (tri aléatoire)
                sequelize.random(['questions','answers', 'description'])
            ]
        });

        // La transmettre à la vue
        res.render('quiz', {
            quiz
        });
    },
};

module.exports = quizController;
