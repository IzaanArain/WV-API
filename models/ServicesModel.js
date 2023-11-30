const mongoose = require('mongoose');
const {Schema}=mongoose

const serviceSchema = new Schema({
    title: {
        type: String,
        default:""
    },
    content: {
        type: String,
        default:""
    },
    service_image:{
        type: String,
        default:""
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("service", serviceSchema); 