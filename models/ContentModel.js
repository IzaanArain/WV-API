const mongoose = require('mongoose');
const {Schema}=mongoose

const contentSchema = new Schema({
    title: {
        type: String,
        default:""
    },
    content: {
        type: String,
        default:""
    },
    company_image:{
        type: String,
        default:""
    },
    content_type: {
        type: String,
        enum: ['privacy_policy', 'terms_and_conditions', 'about_us','information'],
        default:""
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("content", contentSchema); 