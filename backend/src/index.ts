import express from "express";
const app = express();
import dotenv from "dotenv";
import { checkDatabaseConnection, dbconfig } from "./config/dbconnection";
import { prisma } from "./prisma/client";
import rootRouter from "./routes/route"

app.use(express.json());

app.use("/api/v1",rootRouter)
dotenv.config();

const PORT = process.env.PORT;
app.listen(PORT, async () => {
  await checkDatabaseConnection(prisma);
      
  console.log(`server is running on port ${PORT}`);
});
