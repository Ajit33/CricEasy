import { Request, Response } from "express";
import { CustomError } from "../utils/application.errors";
import prisma from "../utils/Prisma";


export const addPlayer=async(req:Request,res:Response)=>{
   try {
      const TeamId=Number(req.params.teamId);
      const {name}=req.body
      if(isNaN(TeamId)){
         throw new CustomError("Invalid TeamId",400) 
      }
      const team=await prisma.team.findUnique({
        where:{
           id:TeamId 
        },
        include: { players: true },
      })
      if(!team){
        throw new CustomError("Team is not Found",404)
      }
      const totalPlayer=team.players.length;
      if(totalPlayer==11){
        throw new CustomError("Team is full",403)
      }
      await prisma.player.create({
        data:{
          name:name,
          team:{
            connect:{id:TeamId}
          }
        }
      })
     res.status(201).json({
        message:"Player added sucessfully."
     }) 
   } catch (error: any) {
    console.error("Error adding team:", error);

    // Handle errors using the CustomError class
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An internal server error occurred" });
    }
  }
}