const mongoose = require("mongoose");

async function main() {
  await mongoose.connect(process.env.DB);
}

module.exports = main;
