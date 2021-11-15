const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.list);
router.post('/add', userController.add);
router.get('/delete/:curso_id', userController.delete);

module.exports = router;