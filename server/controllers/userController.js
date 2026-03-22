const db = require("../db");
const bcrypt = require('bcrypt');

exports.updateUser = async (req, res) => {
    try{
        const {password, newPassword} = req.body;
        if (!password) return res.status(400).json({ message: "Password Required" });
        if(!newPassword || newPassword.length < 6) return res.status(400).json({message:"Weak Password"});
        const userId = req.user.id
        const dbUser = await db.query(`SELECT password FROM users WHERE id = $1`, [userId]);
        if (dbUser.rows.length === 0){
            return res.status(404).json({message: "User Not Found"});
        }else{
            const user = dbUser.rows[0]
            const isPssdMatched = await bcrypt.compare(password, user.password);
            if (isPssdMatched) {
                const hashedPsswd = await bcrypt.hash(newPassword, 10);
                await db.query(`UPDATE users SET password = $1 WHERE id = $2`, [hashedPsswd, userId]);
                return res.json({message: "Password Updated"});
            } else {
                return res.status(400).json({message : "Invalid Old Password"});
            }
        }
    }catch(err){
        return res.status(500).json({message : "Server Error"});
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const {password} = req.body;
        if (!password) return res.status(400).json({ message: "Password Required" });
        const userId = req.user.id;
        const dbUser = await db.query(`SELECT password FROM users WHERE id = $1`, [userId]);
        if (dbUser.rows.length === 0) {
            return res.status(404).json({message: "User NOt Found"});
        } else {
            const user = dbUser.rows[0];
            const isPssdMatched = await bcrypt.compare(password, user.password);
            if (isPssdMatched) {
                const result = await db.query(`DELETE FROM users WHERE id = $1`, [userId]);
                return res.send({ message: "Account Deleted" });
            } else {
                return res.status(400).json({message: "Invalid Password"});
            }
        }
    } catch (err) {
         return res.status(500).json({ message: "Server Error" });
    }
}

