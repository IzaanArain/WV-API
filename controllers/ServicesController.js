const Service = require("../models/ServicesModel");
const mongoose = require("mongoose");

const createService = async (req, res) => {
  try {
    const { title, content } = req?.body;
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
    }
    const serviceImage = req?.files?.company_image;
    const serviceImagePath = serviceImage
      ? contentImage[0]?.path?.replace(/\\/g, "/")
      : null;
    const service = await Service.create({
      title,
      content,
      service_image: serviceImagePath,
    });
    return res.status(200).send({
      status: 1,
      message: "service created succesfully",
      service: service,
    });
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const editService = async (req, res) => {
  try {
    const { title, content, id } = req?.body;
    if (!id) {
      return res.status(400).send({
        status: 0,
        message: "please enter ID",
      });
    } else if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({
        status: 0,
        message: "please enter a valid ID",
      });
    } else if (!title) {
      return res.status(400).send({
        status: 0,
        message: "please enter title",
      });
    } else if (!content) {
      return res.status(400).send({
        status: 0,
        message: "please enter content",
      });
    }
    const service = await Service.findById(id);
    if (!service) {
      return res.status(400).send({
        status: 0,
        message: "service not found",
      });
    }
    const serviceImage = req?.files?.company_image;
    const serviceImagePath = serviceImage
      ? contentImage[0]?.path?.replace(/\\/g, "/")
      : null;
    const update_service = await Service.findByIdAndUpdate(
      id,
      {
        title,
        content,
        serviceImage: serviceImagePath,
      },
      { new: true }
    );
    return res.status(200).send({
      status: 1,
      message: "updated service successfully!",
      service: update_service,
    });
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const id = req?.query?.id;
    if (!id) {
      return res.status(400).send({
        status: 0,
        message: "please enter ID",
      });
    } else if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({
        status: 0,
        message: "please enter a valid ID",
      });
    }
    const service = await Service.findById(id);
    if (!service) {
      return res.status(400).send({
        status: 0,
        message: "service not found",
      });
    }
    const del = service?.is_delete;
    const update_service = await Service.findByIdAndUpdate(
      id,
      { is_delete: !del },
      { new: true }
    );
    if (del) {
      return res.status(200).send({
        status: 1,
        message: "service deleted successfully",
      });
    } else {
      return res.status(200).send({
        status: 1,
        message: "service restored successfully",
      });
    }
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services=await Service.find({});
    if(services?.length < 1){
      return res.status(200).send({
        status:1,
        message:"no services found!",
      })
    }else{
      return res.status(200).send({
        status:1,
        message:"fetched all services",
        services
      })
    }
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const getServiceDetails=async(req,res)=>{
  try{
    const id=req?.body?.id;
    if (!id) {
      return res.status(400).send({
        status: 0,
        message: "please enter ID",
      });
    } else if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({
        status: 0,
        message: "please enter a valid ID",
      });
    }
    const service=await Service.findById(id);
    if (!service) {
      return res.status(400).send({
        status: 0,
        message: "service not found",
      });
    }else{
      return res.status(200).send({
        status: 0,
        message: "service fetched successfully",
        service
      });
    }
  }catch(err){
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createService,
  editService,
  deleteService,
  getAllServices,
  getServiceDetails
};
