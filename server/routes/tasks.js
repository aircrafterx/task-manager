const express = require('express');
const router = express.Router();
const authVerify = require("../middleware/authVerify")

router.use(authVerify);

const {
    getAllTasks,
    createTasks,
    updateTasks,
    deleteTasks
} = require("../controllers/taskController");

router.get('/', getAllTasks);
router.post('/', createTasks);
router.put('/:id', updateTasks);
router.delete('/:id', deleteTasks);

module.exports = router