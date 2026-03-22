const db = require('../db');

const normalizeDate = date => {
    if(!date) return null;
    return new Date(date).toISOString().split('T')[0];
}

exports.getAllTasks = async (req, res) => {
    try{
        const userId = req.user.id
        const result = await db.query("SELECT id, title, description, priority, status, due_date FROM tasks WHERE user_id = $1 AND is_deleted = false", [userId]);
        res.json(result.rows);
    }catch(err){
        res.status(500).send({message: "Server Error"});
    }
}

exports.createTasks = async (req, res) => {
    try{
        const userId = req.user.id
        const {title, description, priority, status,  due_date} = req.body
        if(!title || !priority || !status || !due_date){
            return res.status(400).json({message: "Missing Required Fields"});
        }
        const formatedDate = normalizeDate(due_date);
        const result = await db.query(
            `INSERT INTO tasks(title, description, priority, status, due_date, user_id)
             VALUES($1, $2, $3, $4, $5, $6)
             RETURNING *`, 
             [title, description, priority, status, formatedDate, userId]
        );
        res.status(201).json(result.rows[0]);
    }catch(err){
        res.status(500).send({message: "Server Error"});
    }
}

exports.updateTasks = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user.id
        const { title, description, priority, status, due_date } = req.body
        if (!title || !priority || !status || !due_date) {
            return res.status(400).json({ message: "Missing Required Fields" });
        }
        const formatedDate = normalizeDate(due_date)
        const result = await db.query(
            `UPDATE tasks 
            SET 
            title = $1, description = $2, priority = $3, status = $4, due_date = $5 
            WHERE user_id = $6 AND id = $7
            RETURNING *`,
            [title, description, priority, status, formatedDate, userId, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Task Not Found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}

exports.deleteTasks = async (req, res) => {
    try{
        const {id} = req.params;
        const userId = req.user.id
        const result = await db.query(
            `UPDATE tasks 
            SET is_deleted = true
             WHERE user_id = $1 AND id = $2
             RETURNING *`, [userId, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Task Not Found" });
        }
        res.status(200).json({message: "Deleted"});
    }catch(err){
        res.status(500).json({message: "Server Error"});
    }
}