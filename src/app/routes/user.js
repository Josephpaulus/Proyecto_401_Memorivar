const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.list);
router.post('/add', userController.add);
router.get('/delete/:curso_id', userController.delete);

router.get('/update/:curso_id', userController.edit);
router.post('/update/:curso_id', userController.update);

module.exports = router;