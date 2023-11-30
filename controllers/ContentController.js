const Content=require("../models/ContentModel")

const createContent = async (req, res) => {
  try {
    const { title, content, type } = req.body;
    const types = [
      "privacy_policy",
      "terms_and_conditions",
      "about_us",
      "help_and_support",
      "information",
    ];
    if (!title) {
      return res.status(400).send({
        status: 0,
        message: "please enter title",
      });
    } else if (!content) {
      return res.status(400).send({
        status: 0,
        message: "please enter content",
      });
    } else if (!type) {
      return res.status(400).send({
        status: 0,
        message: "please enter a content type",
      });
    } else if (!types.includes(type)) {
      return res.status(400).send({
        status: 0,
        message: `Accepted types are limited to the following: "privacy_policy", "terms_and_conditions", "about_us", "help_and_support", and "information".`,
      });
    }

  } catch (err) {
    console.error("error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

module.exports = { createContent };
