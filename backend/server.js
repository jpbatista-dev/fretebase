import dotenv from "dotenv";
import app from "./src/app.js";
import pool from "./src/config/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await pool.query("SELECT 1");
    console.log("Database connection verified");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
