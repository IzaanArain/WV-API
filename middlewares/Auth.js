const jwt=require("jsonwebtoken");

const createToken=(id)=>{
    return jwt.sign({id:id},process.env.SECRETE_KEY);
}

const tokenValidator=async(req,res,next)=>{

}
module.exports={createToken,tokenValidator}