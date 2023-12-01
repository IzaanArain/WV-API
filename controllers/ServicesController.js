const Service = require("../models/ServicesModel");
const mongoose = require("mongoose");
const BookService = require("../models/BookServicesModel");

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
    const id = req?.params?.id;
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
    await BookService.findOneAndDelete({ service_id:id});
    await Service.findByIdAndDelete(id);
    return res.status(200).send({
      status:1,
      message:"service deleted successfully",
    })
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
    const id=req?.params?.id;
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

//book service
const book_service = async (req, res) => {
  try {
    const user_id = req?.user?._id;
    const id = req?.params?.id;
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
    const book_service = await BookService.findOne({
      user_id: user_id,
      service_id: id,
    });
    if (book_service) {
      const booked_service_id = book_service?._id;
      const is_booked = book_service?.is_booked;
      const update_book_service = await BookService.findByIdAndUpdate(
        booked_service_id,
        {
          is_booked: !is_booked,
        },
        { new: true }
      );
      if (is_booked) {
        return res.status(200).send({
          status: 1,
          message: "service has been successfully booked",
          booked_service: update_book_service,
        });
      } else {
        return res.status(200).send({
          status: 1,
          message: "service booking has been canceled",
          booked_service: update_book_service,
        });
      }
    } else {
      const booking_service=new BookService({
        user_id: user_id,
        service_id: id,
        is_booked:1
      });
      const booked_service=await booking_service.save();
      return res.status(200).send({
        status:1,
        message:"service has been successfully booked",
        booked_service
      })
    }
  } catch (err) {
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
  getServiceDetails,
  book_service,
};
