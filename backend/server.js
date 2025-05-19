require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "https://patient-voices-frontend.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


const userRoutes = require("./routes/users");
const reviewRoutes = require("./routes/reviews");
const diseaseRoutes = require("./routes/disease");
const reviewRatingRoutes = require("./routes/reviewRatings");

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/review-ratings", reviewRatingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
