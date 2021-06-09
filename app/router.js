const express = require('express');
const router = express.Router();

const mainController =  require('./controllers/mainController');
const quizController = require('./controllers/quizController');
const tagController = require('./controllers/tagController');
const userController = require('./controllers/userController');


router.use((req, res, next) => {
    res.locals.user = req.session.user;
 next();
})
router.get('/', mainController.home);

router.get('/quiz/:id', quizController.quiz);

router.get('/tags', tagController.list);
router.get('/tags/:id', tagController.tag);

router.get('/login', userController.login);
router.post('/login', userController.checkLogin);
router.get('/signup', userController.register);
router.post('/signup', userController.registerSave);
router.get('/logout', userController.logout);

module.exports = router;
