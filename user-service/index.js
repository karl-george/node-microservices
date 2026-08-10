const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

app.use(bodyParser.json());

mongoose
  .connect("mongodb://mongo:27017/users")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB", error));

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", UserSchema);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = new User({ name, email });
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(499).json({ error: "Error creating user" });
  }
});

app.listen(port, () => {
  console.log(`User service listening at http://localhost:${port}`);
});
