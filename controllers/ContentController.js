
const createContent = async (req, res) => {
  try {
    const { title, content, type } = req.body;
    const types=[]
    if (!title) {
      return res.status(500).send({
        status: 0,
        message: "please enter title",
      });
    } else if (!content) {
      return res.status(500).send({
        status: 0,
        message: "please enter content",
      });
    } else if (!type) {
      return res.status(500).send({
        status: 0,
        message: "please enter title",
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
