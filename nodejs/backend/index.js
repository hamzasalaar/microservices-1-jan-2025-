const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const FormDataModel = require('./models/FormData');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = 'gedeon'; // Use a strong secret key

mongoose.connect('mongodb://127.0.0.1:27017/practice_mern', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    FormDataModel.findOne({ email: email })
        .then(user => {
            if (user) {
                res.json("Already registered");
            } else {
                FormDataModel.create(req.body)
                    .then(log_reg_form => res.json(log_reg_form))
                    .catch(err => res.json(err));
            }
        });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    FormDataModel.findOne({ email: email })
        .then(user => {
            console.log("User found:", user);  // Debugging line
            if (user) {
                if (user.password === password) {
                    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
                    res.json({ message: "Success", token });
                } else {
                    res.json("Wrong password");
                }
            } else {
                res.json("No records found!");
            }
        });
});

app.post('/validate-token', (req, res) => {
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.status(200).json(decoded);
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});

app.listen(3001, () => {
    console.log("Server listening on http://127.0.0.1:3001");
});