

import express from "express"
import { addTeams, createTournament } from "../controllers/TournamentController";
import { authenticateUser } from "../middleware/authenticatedUser";
const router=express.Router()

router.post("/create",authenticateUser,createTournament)
router.post("/addteams/:tournamentId",addTeams)


export default router;