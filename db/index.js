const mongoose = require("mongoose");

async function main() {
  await mongoose.connect(process.env.DB);
}
main()
  .then(() => {
    console.log("Mongodb is successfully connected");
  })
  .catch((err) => console.log(err));
