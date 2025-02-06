import express from "express";
import { handleEvent, startMatch } from "../controllers/matchController";
const router =express.Router()

router.post("/create",startMatch)
router.post("/:matchId/event",handleEvent)


export default router