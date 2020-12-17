const express = require("express");
const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");
const bodyParser = require("body-parser");
const mysql = require("mysql");
require('dotenv').config();

const app = express();
const port = 4000;

const secretKey = 'PBudLoginKey';
const jwtMW = expressJWT({
    secret: secretKey,
    algorithms: ['HS256']
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    res.setHeader('Access-Control-Allow-Methods', '*')
    next();
});

var connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATA
});

connection.getConnection(function(err) {
    if (err) {
        console.error(err.stack);
        return;
    }
    console.log('Connected to database');
});

app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({
            success: false,
            officialError: err,
            err: "You must be logged in to access this"
        });
    } else {
        next(err);
    }
});

app.get("/test", (req, res) => {
    console.log("got it");
});

app.post("/api/signup", (req, res) => {
    const { getUsername, getPassword } = req.body;

    connection.query(`INSERT INTO users (username, password) VALUES ('${getUsername}', '${getPassword}')`, (error, result) => {
        if (error) {
            console.log(error);
            res.status(401).json({
                success: false,
                err: 'Unable to add new user'
            });
        } else {
            res.status(200).json({
                success: true,
                err: null
            });
        }
    });
});

app.post("/api/login", (req, res) => {
    const { getUsername, getPassword } = req.body;
    let foundUser = false;

    connection.query("SELECT * FROM users", function(error, results) {
        if (error) {
            console.log(error);
            return;
        }
        for (let user of results) {
            if (user.username === getUsername && user.password === getPassword) {
                let token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: "1d" });
                foundUser = true;
                res.status(200).json({
                    success: true,
                    err: null,
                    token
                });
            }
        }

        if (!foundUser) {
            res.status(401).json({
                success: false,
                token: null,
                err: "Username or password is incorrect"
            });
        }
    });

    
});

app.get("/api/budget", jwtMW, (req, res) => {
    connection.query(`SELECT * FROM budget WHERE id IN (SELECT budget_id FROM budget_users WHERE user_id='${req.user.username}')`, (error, result) => {
        if (error) {
            res.status(401).json({
                success: false,
                err: error
            });
        } else {
            res.status(200).json({
                budget: result
            });
        }
    });
});

app.delete("/api/budget/:id", jwtMW, (req, res) => {
    connection.query(`DELETE FROM budget WHERE id=${req.params.id}`, (error, result) => {
        if (error) {
            res.status(401).json({
                success: false,
                err: error
            });
        } else {
            res.status(200).json({
                deleted: true
            });
        }
    });
});

app.post("/api/budget", jwtMW, (req, res) => {
    const { getItemName, getItemValue, color, getItemExpense } = req.body;
    const user_id = req.user.username;

    connection.query(`INSERT INTO budget (title, value, color, expense) VALUES ('${getItemName}', ${getItemValue}, '${color}', ${getItemExpense})`, (error, result) => {
        if (error) {
            res.status(401).json({
                success: false,
                err: error
            });
        } else {
            const budget_id = result.insertId;
            connection.query(`INSERT INTO budget_users (budget_id, user_id) VALUES (${budget_id}, '${user_id}')`, (errorMessage, resultMessage) => {
                if (errorMessage) {
                    res.status(401).json({
                        success: false,
                        err: errorMessage
                    });
                } else {
                    connection.query(`SELECT * FROM budget WHERE id IN (SELECT budget_id FROM budget_users WHERE user_id='${user_id}')`, (lastError, result) => {
                        if (lastError) {
                            res.status(401).json({
                                success: false,
                                err: lastError
                            });
                        } else {
                            res.status(200).json({
                                added: true,
                                budgetId: budget_id,
                                budget: result
                            });
                        }
                    });
                }
            });
        }
    });
});

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
