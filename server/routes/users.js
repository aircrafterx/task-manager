const express = require('express');
const router = express.Router();
const authVerify = require("../middleware/authVerify")

router.use(authVerify);

const {updateUser, deleteUser} = require("../controllers/userController");

router.put("/", updateUser);
router.delete("/", deleteUser);

module.exports = router