const Service = require("../models/ServicesModel");

const createService = async (req, res) => {
  try {
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createService,
};
