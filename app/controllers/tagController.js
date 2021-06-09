const { Tag } = require("../models/index");

const quizController = {
    /**
     * Fonction qui gère l'affichage de la liste des tags
     * Elle va récupérer la liste de tous les tags et les envoyer à la vue
     * @param {Request} req
     * @param {Response} res
     */
    list: async (req, res) => {
        try {
            const tags = await Tag.findAll();
            res.render("tags", { tags });
        } catch (error) {
            res.render("500");
        }
    },
    /**
     * Fonction qui gère l'affichage d'un tag et des listes associées
     * @param {Request} req
     * @param {Response} res
     */
    tag: async (req, res) => {
        try {
            const tag = await Tag.findByPk(parseInt(req.params.id, 10), {
                include: [
                    {
                        association: "quizzes",
                        include: ["author"],
                    },
                ],
            });
            res.render("tag", { tag });
        } catch (error) {
            res.render("500");
        }
    },
};

module.exports = quizController;
