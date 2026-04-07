// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
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

// //express app
// const app = express();

// // Serve API docs at /api-docs
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));
// //middleware
// app.use(express.json());
// app.use((req, res, next) => {
//   console.log(req.path, req.method);
//   next();
// });
// //audit logging middleware
// app.use(auditLoggerMiddleware); // Use the middleware here
// //routs
// app.use('/api', UserRoutes);
// app.use('/api', CompanyRoutes);
// app.use('/api', AuthRouths);
// app.use('/api', ProjectRouths);
// app.use('/api', contactForm);
// app.use('/api', careerForm);
// app.use('/api', mockTest);

// app.get("/api/get-all-consulting-solutions", (req, res) => {
//   res.json({ data: [] });
// });

// app.get("/api/get-all-role-pages", (req, res) => {
//   res.json({ data: [] });
// });

// app.get("/api/case-studies", (req, res) => {
//   res.json({ data: [] });
// });

// //connect to db
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     // listen for request
//     app.listen(process.env.PORT, () => {
//       console.log('connecting the db and listening on port ', process.env.PORT);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// process.env;





// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
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

// // middleware
// app.use(express.json());
// app.use((req, res, next) => {
//   console.log(req.path, req.method);
//   next();
// });

// app.use(auditLoggerMiddleware);

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

// // ✅ THEN: other routes
// app.use('/api', UserRoutes);
// app.use('/api', CompanyRoutes);
// app.use('/api', AuthRouths);
// app.use('/api', ProjectRouths);
// app.use('/api', contactForm);
// app.use('/api', careerForm);
// app.use('/api', mockTest);

// // Swagger
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

// // DB connect
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     app.listen(process.env.PORT, () => {
//       console.log('connecting the db and listening on port ', process.env.PORT);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });











require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = require('./utils/swagger/swagger');
const auditLoggerMiddleware = require('./middleware/auditLoggerMiddleware');

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(auditLoggerMiddleware);

// ================= DUMMY APIs =================

// Consulting
app.get("/api/get-all-consulting-solutions", (req, res) => {
  res.json({ data: [] });
});

// Role pages
app.get("/api/get-all-role-pages", (req, res) => {
  res.json({ data: [] });
});

// Case studies
app.get("/api/case-studies", (req, res) => {
  res.json({ data: [] });
});

// VA designation
app.get("/api/va/designation-page", (req, res) => {
  res.json({ data: [] });
});

// Industry targets
app.get("/api/get-all-industry-targets", (req, res) => {
  res.json({ data: [] });
});

app.get("/api/get-industry-target-by-slug/:slug", (req, res) => {
  res.json({ data: {} });
});

// Featured jobseekers
app.get("/api/jobseekers/featured", (req, res) => {
  res.json({
    data: [
      {
        userId: "1",
        fullName: "John Doe",
        designation: "Full Stack Developer",
        profilePicture: "",
        slug: "john-doe"
      },
      {
        userId: "2",
        fullName: "Jane Smith",
        designation: "React Developer",
        profilePicture: "",
        slug: "jane-smith"
      }
    ]
  });
});

// ================= SWAGGER =================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

// ================= SERVER START =================
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});