const express=require("express");
require("dotenv").config();
const UserRoutes=require("./routes/UserRoutes");
const AdminRoutes=require("./routes/AdminRoutes");
const Connect = require("./config/DBConnection");

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use("/api/user",UserRoutes);
app.use("/api/admin",AdminRoutes);
app.use(express.static("uploads"));

const PORT=process.env.PORT || 3001;

Connect().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server Running on PORT ${PORT}`);
        console.log(`Server Running on PORT http://localhost:${PORT}/user/api/`);
    })
})
