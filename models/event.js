const mongoose = require('mongoose');
const Schema = mongoose.Schema;





const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    venue: {
        type: String,
        required: true,
        trim: true
    },

    thumbnail:{
        type:String,
        required:true,
        trim:true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    date: {
        type: Date,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    capacity: {
        type: Number,
        min: 1
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    registrations:[
        {
        username:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        }
        }
    ]
});

module.exports = mongoose.model("Event", eventSchema);
