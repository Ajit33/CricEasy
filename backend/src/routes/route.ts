import express from "express"
import userRouter from "./userRouter"
import tournamnetRouter from "../routes/tournamnetRoutes"
import matchRouter from "../routes/matchRouter"
import playerRouter from "../routes/playerRoutes"
const router=express.Router()

router.use("/user",userRouter)
router.use("/tournament",tournamnetRouter)
router.use("/player",playerRouter)
router.use("/match",matchRouter)
export default router