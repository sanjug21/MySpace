
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        
        required: true,
    },
    title: {
        type: String,
        required:true,
        trim: true,
        maxlength: 100,
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;