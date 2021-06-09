const { Quiz } = require("../models/index");

const mainController = {
    /**
     * Fonction qui gère l'affichage de la page d'accueil.
     * Elle va récupérer la liste des quizz en BDD et les envoyer à la vue home.ejs
     * @param {Request} req
     * @param {Response} res
     */
    home: async (req, res) => {
        const quizzes = await Quiz.findAll({
            include: ["author"],
        });

        res.render("home", { quizzes });
    },
};

module.exports = mainController;
