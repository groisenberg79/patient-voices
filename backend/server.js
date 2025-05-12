require("dotenv").config();
const express = require("express");
const cors = require("cors");

app.use(
  cors({
    origin: "https://patient-voices-frontend.onrender.com",
  })
);

const userRoutes = require("./routes/users");
const reviewRoutes = require("./routes/reviews");
const diseaseRoutes = require("./routes/disease");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/disease", diseaseRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
