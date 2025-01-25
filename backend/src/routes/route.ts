import express from "express"
import userRouter from "./userRouter"
import tournamnetRouter from "../routes/TournamnetRoutes"
import playerRouter from "../routes/playerRoutes"
const router=express.Router()

router.use("/user",userRouter)
router.use("/tournament",tournamnetRouter)
router.use("/player",playerRouter)

export default router