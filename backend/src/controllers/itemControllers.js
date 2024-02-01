const prisma = require("../services/prisma");

const browse = async (req, res, next) => {
  try {
    const items = await prisma.items.findMany;

    res.json(items);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  browse,
};
