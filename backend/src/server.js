import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import urlRoutes from "./routes/url.js";
import linkRoutes from "./routes/linkRoutes.js";  

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/links", linkRoutes);
app.use("/", urlRoutes);

// Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
