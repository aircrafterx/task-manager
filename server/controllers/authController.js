const db = require("../db");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email) return res.status(400).json({ message: "No email Provided" });        
        email = email.toLowerCase().trim();

        if (!password || password.length < 6) return res.status(400).json({ message: "Weak Password" });

        const hashedPsswd = await bcrypt.hash(password, 10);
        const result = await db.query(`INSERT INTO users(email, password) VALUES($1, $2) RETURNING id, email`, [email, hashedPsswd]);
        const payload = { id: result.rows[0].id, email: result.rows[0].email };
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.status(201).json({ jwtToken });
    } catch (err) {
        if(err.code === "23505") return res.status(409).json({message: "Email Already Exists"});
        console.error({err});
        return res.status(500).json({ message: "Server Error" });
    }
}

exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;

        if(!email) return res.status(400).json({message: "No email Provided"});
        if(!password) return res.status(400).json({message: "No Password Provided"});

        email = email.toLowerCase().trim();

        const dbUser = await db.query(`SELECT id, email, password FROM users WHERE email = $1`, [email]);

        if (dbUser.rows.length === 0) {
            return res.status(400).json({message: "Invalid Credentials"});
        } else {
            const user = dbUser.rows[0];
            const isPssdMatched = await bcrypt.compare(password, user.password);
            if (isPssdMatched) {
                const payload = { id: user.id, email: user.email };
                const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"});
                return res.status(200).json({ jwtToken });
            } else {
                return res.status(400).json({message : "Invalid Credentials"});
            }
        }
    } catch (err) {
        return res.status(500).json({ message: "Server Error" });
    }
}