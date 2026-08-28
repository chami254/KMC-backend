require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const db = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/projects.routes.js");
const galleryRoutes = require("./routes/gallery.routes");
const leadershipRoutes = require("./routes/leadership.routes");
const updatesRoutes = require("./routes/updates.routes");
const messagesRoutes = require("./routes/messages.routes");

const app = express();

const PORT = process.env.PORT || 5000;


// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);



// Middleware
app.use(express.json());
app.use(cookieParser());


// Test database
async function testDatabaseConnection() {
  try {
    const [rows] = await db.query("SELECT * FROM admins");
    console.log("MySQL connection successful:", rows);
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
  }
}

testDatabaseConnection();


// Routes
app.use("/api/auth", authRoutes);
//projects
app.use("/api/projects", projectRoutes);
//gallery
app.use("/api/gallery", galleryRoutes);
//leadership
app.use("/api/leadership", leadershipRoutes);
//updates
app.use("/api/updates", updatesRoutes);
//message
app.use("/api/messages", messagesRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});