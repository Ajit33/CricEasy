import { PrismaClient } from "@prisma/client";
import { dbconfig } from "../config/dbconnection";

export const prisma = new PrismaClient();