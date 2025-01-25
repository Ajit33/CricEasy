import express from "express"
import userRouter from "./userRouter"
import tournamnetRouter from "./TournamnetRoutes"
const router=express.Router()

router.use("/user",userRouter)
router.use("/tournament",tournamnetRouter)

export default router