const mongoose = require('mongoose');
const {Schema}=mongoose

const contentSchema = new Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    type: {
        type: String,
        enum: ['privacy_policy', 'terms_and_conditions', 'about_us','help_and_support']
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("content", contentSchema); 