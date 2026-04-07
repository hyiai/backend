// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const swaggerUi = require('swagger-ui-express');

// const UserRoutes = require('./routes/jobseekerRoutes');
// const CompanyRoutes = require('./routes/companyRoutes');
// const AuthRouths = require('./routes/authRoutes');
// const ProjectRouths = require('./routes/projectRouts');
// const swaggerOptions = require('./utils/swagger/swagger');
// const contactForm = require('./routes/contactFormRoutes');
// const careerForm = require('./routes/careerRoutes');
// const mockTest = require('./routes/testRoutes');
// const auditLoggerMiddleware = require('./middleware/auditLoggerMiddleware');

// const app = express();
// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true
// }));
// // middleware
// app.use(express.json());
// app.use((req, res, next) => {
//   console.log(req.path, req.method);
//   next();
// });

// app.use(auditLoggerMiddleware);

// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });

// // ✅ FIRST: custom routes (VERY IMPORTANT)
// app.get("/api/get-all-consulting-solutions", (req, res) => {
//   res.json({ data: [] });
// });

// app.get("/api/get-all-role-pages", (req, res) => {
//   res.json({ data: [] });
// });

// app.get("/api/case-studies", (req, res) => {
//   res.json({ data: [] });
// });

// app.get("/api/va/designation-page", (req, res) => {
//   res.json({ data: [] });
// });

// app.get("/api/get-all-industry-targets", (req, res) => {
//   res.json({ data: [] });
// });

// app.get("/api/get-industry-target-by-slug/:slug", (req, res) => {
//   res.json({ data: {} });
// });
// app.get("/api/jobseekers/featured", (req, res) => {
//   res.json({
//     data: [
//       {
//         userId: "1",
//         fullName: "John Doe",
//         designation: "Full Stack Developer",
//         profilePicture: "",
//         slug: "john-doe"
//       },
//       {
//         userId: "2",
//         fullName: "Jane Smith",
//         designation: "React Developer",
//         profilePicture: "",
//         slug: "jane-smith"
//       }
//     ]
//   });
// });
// app.get("/api/about", (req, res) => {
//   res.json({
//     data: {
//       title: "About Us",
//       description: "This is about page data"
//     }
//   });
// });
// app.get("/api/skills", (req, res) => {
//   res.json({
//     data: ["Java", "React", "Node.js", "MongoDB"]
//   });
// });

// // ✅ THEN: other routes
// // app.use('/api', UserRoutes);
// // app.use('/api', CompanyRoutes);
// // app.use('/api', AuthRouths);
// // app.use('/api', ProjectRouths);
// // app.use('/api', contactForm);
// // app.use('/api', careerForm);
// // app.use('/api', mockTest);

// // Swagger
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

// // DB connect
// const PORT = process.env.PORT || 5001;

// app.listen(PORT, () => {
//   console.log("✅ Server running on port", PORT);
// });







require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = require("./utils/swagger/swagger");
const auditLoggerMiddleware = require("./middleware/auditLoggerMiddleware");

const app = express();

/* ================= CORS FIX (IMPORTANT) ================= */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-frontend-domain.vercel.app", // 🔥 change after deploy
    ],
    credentials: true,
  })
);

/* ================= MIDDLEWARE ================= */
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.use(auditLoggerMiddleware);

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send("✅ Backend is running 🚀");
});

/* ================= HEALTH CHECK ================= */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
  });
});

/* ================= API ROUTES ================= */

// About (FIXED FORMAT ✅)
app.get("/api/about", (req, res) => {
  res.json({
    success: true,
    data: {
      title: "About Us",
      description: "This is about page data",
    },
  });
});

// Skills
app.get("/api/skills", (req, res) => {
  res.json({
    success: true,
    data: ["Java", "React", "Node.js", "MongoDB"],
  });
});

app.get("/api/get-graph-counts", (req, res) => {
  res.json({
    data: {
      last5MinCount: 10,
      dailyData: [],
      countryData: [],
      monthData: [],
    },
    totalCount: 1000,
  });
});

// Featured Jobseekers
app.get("/api/jobseekers/featured", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        userId: "1",
        fullName: "John Doe",
        designation: "Full Stack Developer",
        profilePicture: "",
        slug: "john-doe",
      },
      {
        userId: "2",
        fullName: "Jane Smith",
        designation: "React Developer",
        profilePicture: "",
        slug: "jane-smith",
      },
    ],
  });
});

// Other dummy APIs
app.get("/api/get-all-consulting-solutions", (req, res) => {
  res.json({ success: true, data: [] });
});

app.get("/api/get-all-role-pages", (req, res) => {
  res.json({ success: true, data: [] });
});

app.get("/api/case-studies", (req, res) => {
  res.json({ success: true, data: [] });
});

app.get("/api/va/designation-page", (req, res) => {
  res.json({ success: true, data: [] });
});

app.get("/api/get-all-industry-targets", (req, res) => {
  res.json({ success: true, data: [] });
});

app.get("/api/get-industry-target-by-slug/:slug", (req, res) => {
  res.json({ success: true, data: {} });
});

/* ================= SWAGGER ================= */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

/* ================= PORT ================= */
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
