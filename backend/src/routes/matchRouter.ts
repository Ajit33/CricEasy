import express from "express";
import { handelEvent, startMatch } from "../controllers/matchController";
const router =express.Router()

router.post("/create",startMatch)
router.post("/:matchId/event",handelEvent)


export default router