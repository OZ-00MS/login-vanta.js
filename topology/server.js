const express = require("express");
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
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

/* ROUTES */

/* Serve index.html */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* SIGNUP - plain text */
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  const users = readUsers();

  if (users.find(u => u.username === username)) {
    return res.send("User already exists ❌");
  }

  users.push({
    id: Date.now(),
    username,
    email,
    password // store plain password
  });

  saveUsers(users);

  // redirect to login page (page2)
  return res.redirect("/?page=login");
});

/* LOGIN - plain text */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const users = readUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.send("User not found ❌");
  }

  if (user.password !== password) {
    return res.send("Wrong password ❌");
  }

  // redirect to home page
  return res.redirect("/home.html");
});

/* Serve home.html */
app.get("/home.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

/* START SERVER */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
