const express = require("express");
require("dotenv").config();
const cors=require("cors");
const UserRoutes = require("./routes/UserRoutes");
const AdminRoutes = require("./routes/AdminRoutes");
const Connect = require("./config/DBConnection");
const dbSeeder = require("./utils/TcPp");
const app = express();
Connect();

const server = require('http').createServer(app);
app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/user", UserRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/uploads", express.static("uploads"));
app.set("views", "./views");
app.set("view engine", "pug");

dbSeeder().then((contents) => {
    app.get("/privacy_policy", (req, res, next) => {
        res.render("index", {
          title: contents[0]?.title,
          heading: contents[0]?.title,
          paragraph: contents[0]?.content,
          image: contents[0]?. company_image
        });
      });
      app.get("/about_us", (req, res, next) => {
        res.render("index", {
          title: contents[1]?.title,
          heading: contents[1]?.title,
          paragraph: contents[1]?.content,
        });
      });
      app.get("/terms_and_conditions", (req, res, next) => {
        res.render("index", {
          title: contents[2]?.title,
          heading: contents[2]?.title,
          paragraph: contents[2]?.content,
        });
      });
      app.get("/information", (req, res, next) => {
        res.render("index", {
          title: contents[3]?.title,
          heading: contents[3]?.title,
          paragraph: contents[3]?.content,
        });
      });
});

  
const PORT = process.env.PORT || 3011;

server.listen(PORT, () => {
  console.log(`Server Running on PORT ${PORT}`);
  console.log(`Server Running on PORT http://localhost:${PORT}/user/api/`);
});