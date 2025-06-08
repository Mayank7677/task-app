const listController = require('../controllers/listController');
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/create', auth , listController.createList);
router.get('/getAll', auth , listController.getAllLists);
router.delete('/delete/:listId', auth , listController.deleteList);
 
module.exports = router;