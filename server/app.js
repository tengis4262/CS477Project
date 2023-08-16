const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');


//instatiation
const app = express();
const userRouter = require('./routes/userRouter')


//configuration



//middleware
app.use(cors());
app.use(express.json());
app.use('/user',userRouter)
// app.post('/',path.join(__dirname,'client','index.html'))



//startup
const PORT = 3000;
mongoose.connect('mongodb://127.0.0.1:27017/project')
    .then(() => {
        app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
    });