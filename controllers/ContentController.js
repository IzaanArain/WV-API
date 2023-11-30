const Content = require("../models/ContentModel");

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

    const contentImage = req?.files?.company_image;
    const contentImagePath = contentImage
      ? contentImage[0]?.path?.replace(/\\/g, "/")
      : null;

    const new_content = await Content.create({
      title,
      content,
      company_image: contentImagePath,
      content_type: type,
    });
    return res.status(200).send({
      status: 1,
      message: "content created successfully",
      content: new_content,
    });
  } catch (err) {
    console.error("error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
      err: err.message,
    });
  }
};

module.exports = { createContent };
