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
    is_delete:{
        type:Number,
        default:0
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("service", serviceSchema); 