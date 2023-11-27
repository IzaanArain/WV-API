const express=require("express");
require("dotenv").config();
const UserRoutes=require("./routes/UserRoutes");
const Connect = require("./config/DBConnection");

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use("/user/api",UserRoutes)

const PORT=process.env.PORT || 3000;

Connect().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server Running on PORT ${PORT}`);
        console.log(`Server Running on PORT http://localhost:${PORT}/user/api/`);
    })
})
