const jwt=require("jsonwebtoken");

const createToken=(id)=>{
    return jwt.sign({id:id},process.env.SECRETE_KEY);
}

module.exports={createToken}