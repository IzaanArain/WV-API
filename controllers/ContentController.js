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
    const contet_type_exists = await Content.findOne({ content_type: type });
    if (contet_type_exists) {
      return res.status(400).send({
        status: 0,
        message: "content type already exists",
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
    });
  }
};

const getContent = async (req, res) => {
  try {
    const type = req?.body?.type;
    const types = [
      "privacy_policy",
      "terms_and_conditions",
      "about_us",
      "help_and_support",
      "information",
    ];
    if (!type) {
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
    const content = await Content.findOne({ content_type: type });
    if (!content) {
      return res.status(400).send({
        status: 0,
        message: "content not found",
      });
    } else {
      return res.status(200).send({
        status: 1,
        message: `fetched ${type} successfully`,
        content,
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

const editContent = async (req, res) => {
  try {
    const { type, title, content } = req?.body;
    const types = [
      "privacy_policy",
      "terms_and_conditions",
      "about_us",
      "help_and_support",
      "information",
    ];
    if (!type) {
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
    const content_exists = await Content.findOne({ content_type: type });
    if (!content_exists) {
      return res.status(400).send({
        status: 0,
        message: "content not found",
      });
    }
    const update_content = await Content.findOneAndUpdate(
      { content_type: type },
      {
        title,
        content,
      },
      { new: true }
    );
    return res.status(200).send({
      status:1,
      message:"content updated successfully!",
      content:update_content
    });
  } catch (err) {
    console.error("error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const deleteContent=async(req,res)=>{
  try{
    const { type} = req?.body?.type;
    const types = [
      "privacy_policy",
      "terms_and_conditions",
      "about_us",
      "help_and_support",
      "information",
    ];
    if (!type) {
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
    const content_exists = await Content.findOne({ content_type: type });
    if (!content_exists) {
      return res.status(400).send({
        status: 0,
        message: "content not found",
      });
    }
    await Content.findOneAndDelete({content_type: type})
    return res.status(200).send({
      status:1,
      message:"content updated successfully!",
    });
  }catch(err){
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
}

module.exports = { createContent, getContent, editContent, deleteContent };
