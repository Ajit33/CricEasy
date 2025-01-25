
import express from "express"
import { addPlayer } from "../controllers/playerContoller";
const router=express.Router();

router.post("/addplayer/:teamId",addPlayer)




export default router;