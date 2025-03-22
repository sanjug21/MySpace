require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/user');
const noteRoutes = require('./routes/note');
const contactRoutes = require('./routes/contact');
const postRoutes=require('./routes/post')
const cloudinary = require('cloudinary').v2;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Database connected!!");
    })
    .catch(() => {
        console.log("Unable to connect to database");
    });

app.use('/auth', userRoutes);
app.use('/notes', noteRoutes);
app.use('/contacts', contactRoutes);
app.use('/posts',postRoutes)

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("Server is running!!");
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});