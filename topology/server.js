const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const USERS_FILE = path.join(__dirname, "users.json");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/* HELPERS */
function readUsers() {
  const data = fs.readFileSync(USERS_FILE, "utf8");
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

/* SIGN UP */
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const users = readUsers();

  // check if user exists
  if (users.find(u => u.username === username)) {
    return res.send("User already exists ❌");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    id: Date.now(),
    username,
    email,
    password: hashedPassword
  });

  saveUsers(users);

  res.send("Signup successful ✅");
});

/* LOGIN */
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const users = readUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.send("User not found ❌");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.send("Wrong password ❌");
  }

  res.send("Login successful 🎉");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
