const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

const JWT_SECRET =
  process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");

// In-memory user storage
const users = [];
let nextUserId = 1;

// In-memory job storage (Experiment 3 CRUD)
let jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "ABC Technologies",
    location: "Coimbatore",
    salary: "4 LPA",
    experience: "Fresher"
  },
  {
    id: 2,
    title: "Cybersecurity Analyst",
    company: "Secure Solutions",
    location: "Bangalore",
    salary: "6 LPA",
    experience: "0-2 years"
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "Pixel Works",
    location: "Chennai",
    salary: "5 LPA",
    experience: "0-2 years"
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "CloudNine Systems",
    location: "Hyderabad",
    salary: "7 LPA",
    experience: "1-3 years"
  },
  {
    id: 5,
    title: "Data Analyst",
    company: "Insight Analytics",
    location: "Pune",
    salary: "5.5 LPA",
    experience: "Fresher"
  },
  {
    id: 6,
    title: "Product Manager",
    company: "Launchpad Digital",
    location: "Mumbai",
    salary: "12 LPA",
    experience: "3-5 years"
  },
  {
    id: 7,
    title: "QA Automation Engineer",
    company: "Quality First",
    location: "Coimbatore",
    salary: "6 LPA",
    experience: "1-3 years"
  },
  {
    id: 8,
    title: "Cloud Support Associate",
    company: "Northstar Cloud",
    location: "Bangalore",
    salary: "4.5 LPA",
    experience: "Fresher"
  },
  {
    id: 9,
    title: "Digital Marketing Specialist",
    company: "Brightside Media",
    location: "Chennai",
    salary: "5 LPA",
    experience: "1-3 years"
  },
  {
    id: 10,
    title: "Mobile App Developer",
    company: "Orbit Apps",
    location: "Hyderabad",
    salary: "8 LPA",
    experience: "2-4 years"
  }
];

let nextJobId = 11;

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Job Portal API is running"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "online"
  });
});

// ======================================
// EXPERIMENT 4: USER REGISTRATION
// ======================================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters"
      });
    }

    const existingUser = users.find(
      user => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered. Please log in."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: nextUserId++,
      username,
      email: email.toLowerCase(),
      password: hashedPassword
    };

    users.push(newUser);

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Registration failed"
    });
  }
});

// ======================================
// EXPERIMENT 4: LOGIN AND JWT GENERATION
// ======================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = users.find(
      u => u.email === email.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password. Please register first."
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      JWT_SECRET,
      {
        expiresIn: "24h"
      }
    );

    console.log("JWT token generated for:", user.email);

    // Return token inside the response object
    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed due to a server error"
    });
  }
});

// ======================================
// JWT AUTHENTICATION MIDDLEWARE
// ======================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access denied. Token required."
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({
        message:
          error.name === "TokenExpiredError"
            ? "Token expired. Please log in again."
            : "Invalid token"
      });
    }

    req.user = decoded;
    next();
  });
}

// Protected profile route
app.get("/api/auth/profile", authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  return res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
});

// ======================================
// EXPERIMENT 3: JOB CRUD API
// ======================================

// Get all jobs
app.get("/api/jobs", (req, res) => {
  res.json(jobs);
});

// Get one job
app.get("/api/jobs/:id", (req, res) => {
  const job = jobs.find(j => j.id === Number(req.params.id));

  if (!job) {
    return res.status(404).json({
      message: "Job not found"
    });
  }

  res.json(job);
});

// Add a job
app.post("/api/jobs", (req, res) => {
  const { title, company, location, salary, experience } = req.body;

  if (!title || !company || !location) {
    return res.status(400).json({
      message: "Title, company and location are required"
    });
  }

  const newJob = {
    id: nextJobId++,
    title,
    company,
    location,
    salary: salary || "Not specified",
    experience: experience || "Not specified"
  };

  jobs.push(newJob);

  res.status(201).json({
    message: "Job added successfully",
    job: newJob
  });
});

// Update a job
app.put("/api/jobs/:id", (req, res) => {
  const job = jobs.find(j => j.id === Number(req.params.id));

  if (!job) {
    return res.status(404).json({
      message: "Job not found"
    });
  }

  Object.assign(job, req.body, { id: job.id });

  res.json({
    message: "Job updated successfully",
    job
  });
});

// Delete a job
app.delete("/api/jobs/:id", (req, res) => {
  const index = jobs.findIndex(
    j => j.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Job not found"
    });
  }

  const deletedJob = jobs.splice(index, 1)[0];

  res.json({
    message: "Job deleted successfully",
    job: deletedJob
  });
});

// Handle unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    message: "API route not found",
    path: req.originalUrl
  });
});

// Handle malformed JSON
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400) {
    return res.status(400).json({
      message: "Invalid JSON request body"
    });
  }

  console.error("Server error:", error);

  res.status(500).json({
    message: "Internal server error"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});