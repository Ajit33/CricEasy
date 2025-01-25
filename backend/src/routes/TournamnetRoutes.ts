

import express from "express"
import { createTournament } from "../controllers/TournamentController";
import { authenticateUser } from "../middleware/authenticatedUser";
const router=express.Router()

router.post("/create",authenticateUser,createTournament)



export default router;