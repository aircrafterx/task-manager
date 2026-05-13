const db = require("../db");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

exports.register = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email) return res.status(400).json({ message: "No email Provided" });        
        email = email.toLowerCase().trim();

        if (!password || password.length < 6) return res.status(400).json({ message: "Weak Password" });

        const hashedPsswd = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const result = await db.query(`INSERT INTO users(email, password, verification_token) VALUES($1, $2, $3) RETURNING id, email`, [email, hashedPsswd, verificationToken]);
        const verificationUrl = `${process.env.SERVER_URL}/api/auth/verify/${verificationToken}`;

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
                <div style="max-width: 500px; margin: auto; background: white; padding: 40px; border-radius: 12px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

                    <h1 style="color: #111827; margin-bottom: 20px;">
                        Verify Your Email
                    </h1>

                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                        Thanks for registering with AircrafterX Task Manager.
                        Please verify your email to continue.
                    </p>

                    <a
                        href="${verificationUrl}"
                        style="
                            display: inline-block;
                            background-color: #2563eb;
                            color: white;
                            text-decoration: none;
                            padding: 14px 28px;
                            border-radius: 8px;
                            font-weight: bold;
                        "
                    >
                        Verify Email
                    </a>

                    <p style="margin-top: 30px; color: #9ca3af; font-size: 13px;">
                        If you did not create this account,
                        you can safely ignore this email.
                    </p>

                </div>
            </div>
            `;

        await transporter.sendMail({
            from:
                `"AircrafterX Notifications" <${process.env.EMAIL_USER}>`,

            to: email,

            subject: "Verify Your Email",

            html: emailHtml
        });

        return res.status(201).json({ message: "Registration Successful. Please Verify your email." });
    } catch (err) {
        if(err.code === "23505") return res.status(409).json({message: "Email Already Exists"});
        console.error({err});
        return res.status(500).json({ message: "Server Error" });
    }
}

exports.verifyRegister = async (req, res) => {
    try{
        const {verificationToken} = req.params;

        const result = await db.query(
            `
                UPDATE users
                SET
                    is_verified = TRUE,
                    verification_token = NULL
                WHERE verification_token = $1
                RETURNING id;
            `, [verificationToken]
        );

        if(result.rows.length === 0){
            return res.redirect(
                `${process.env.CLIENT_URL}/auth?verification=invalid`
            );
        }

        return res.redirect(`${process.env.CLIENT_URL}/auth?verified=true`);
    } catch(err){
        console.log(err);
        return res.redirect(
            `${process.env.CLIENT_URL}/auth?verification=error`
        );
    }
}

exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;

        if(!email) return res.status(400).json({message: "No email Provided"});
        if(!password) return res.status(400).json({message: "No Password Provided"});

        email = email.toLowerCase().trim();

        const dbUser = await db.query(`SELECT id, email, password, is_verified FROM users WHERE email = $1`, [email]);

        if (dbUser.rows.length === 0) {
            return res.status(400).json({message: "Invalid Credentials"});
        } else {
            const user = dbUser.rows[0];
            
            if(!user.is_verified){
                return res.status(400).send({message: "Please verify your email"});
            }

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