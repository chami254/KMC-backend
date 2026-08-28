const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const generateToken = require("../utils/generateToken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Find administrator
    const [rows] = await pool.execute(
      "SELECT id, name, email, password_hash FROM admins WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const admin = rows[0];

    // Compare supplied password with stored bcrypt hash
    const passwordMatches = await bcrypt.compare(
      password,
      admin.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Generate authentication token
    const token = generateToken(admin);

    // Store token in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful.",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error during login.",
    });
  }
};


const me = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email FROM admins WHERE id = ? LIMIT 1",
      [req.admin.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Administrator not found.",
      });
    }

    return res.status(200).json({
      admin: rows[0],
    });
  } catch (error) {
    console.error("Auth check error:", error);

    return res.status(500).json({
      message: "Server error during authentication check.",
    });
  }
};


module.exports = {
  login,
  me,
};

