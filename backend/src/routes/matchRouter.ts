import express from "express";
import { startMatch } from "../controllers/matchController";
const router =express.Router()

router.post("/create",startMatch)



export default router