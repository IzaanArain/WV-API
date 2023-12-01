const Content = require("../models/ContentModel");

const contentSeeder = [
  {
    title: "Privacy Policy",
    content:
      "Lorem ipsum dolor sit amet.Ea iste consectetur qui harum libero exercitationem harum et quam earum At cupiditate perferendis qui aspernatur vero!",
    company_image: "",
    content_type: "privacy_policy",
  },
  {
    title: "About Us",
    content:
      "Lorem ipsum dolor sit amet.Ea iste consectetur qui harum libero exercitationem harum et quam earum At cupiditate perferendis qui aspernatur vero!",
    company_image: "",
    content_type: "about_us",
  },
  {
    title: "Terms and Conditions",
    content:
      "Lorem ipsum dolor sit amet.Ea iste consectetur qui harum libero exercitationem harum et quam earum At cupiditate perferendis qui aspernatur vero!",
    company_image: "",
    content_type: "terms_and_conditions",
  },
  {
    title: "Information",
    content:
      "Lorem ipsum dolor sit amet.Ea iste consectetur qui harum libero exercitationem harum et quam earum At cupiditate perferendis qui aspernatur vero!",
    company_image: "",
    content_type: "information",
  },
];

const dbSeeder = async () => {
  try {
    const pp = await Content.find({ content_type: "privacy_policy" });
    if (pp.length > 1 || pp.length < 1 ) {
      await Content.deleteMany({ type: "privacy_policy" });
      await Content.insertMany(contentSeeder[0]);
    }
    const about_us = await Content.find({ content_type: "about_us" });
    if (about_us.length > 1 || about_us.length < 1 ) {
      await Content.deleteMany({ type: "about_us" });
      await Content.insertMany(contentSeeder[1]);
    }
    const tc = await Content.find({ content_type: "terms_and_conditions" });
    if (tc.length > 1 || tc.length < 1 ) {
      await Content.deleteMany({ type: "terms_and_conditions" });
      await Content.insertMany(contentSeeder[2]);
    }
    const info = await Content.find({ content_type: "information" });
    if (info.length > 1 || info.length < 1 ) {
      await Content.deleteMany({ type: "information" });
      await Content.insertMany(contentSeeder[3]);
    }
    const contents=await Content.find({});
    return contents
  } catch (err) {
    console.error("error", err.message);
  }
};

module.exports = dbSeeder;
