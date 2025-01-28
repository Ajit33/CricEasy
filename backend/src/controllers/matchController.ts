import { Request, Response } from "express";
import { CustomError } from "../utils/application.errors";
import prisma from "../utils/Prisma";
import Redis from "ioredis";


const redis=new Redis()

export const startMatch = async (req: Request, res: Response) => {
  try {
    const { tournamentId, team1Id, team2Id, tossWinnerId, decision,location } = req.body;

    // Validate input
    if (!tournamentId || !team1Id || !team2Id || !tossWinnerId || !decision) {
      throw new CustomError(
        "Please provide all the details to start the match",
        400
      );
    }

    // Check if the tournament exists
    const tournament = await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },
    });

    if (!tournament) {
      throw new CustomError("Tournament not found!", 404);
    }

    // Check if the teams are part of the tournament
    const team1 = await prisma.team.findUnique({
      where: {
        id: team1Id,
      },
      include: {
        tournament: true, 
        players:true
      },
    });

    const team2 = await prisma.team.findUnique({
      where: {
        id: team2Id,
      },
      include: {
        tournament: true,
        players:true
      },
    });

    if (!team1 || team1.tournament.id !== tournamentId) {
      throw new CustomError(
        "Team 1 is not part of the specified tournament",
        400
      );
    }

    if (!team2 || team2.tournament.id !== tournamentId) {
      throw new CustomError(
        "Team 2 is not part of the specified tournament",
        400
      );
    }

    // Create the match
    const match = await prisma.match.create({
      data: {
        tournamentId,
        team1Id,
        team2Id,
        tossWinnerId,
        decision,
        date: new Date(), 
        location, 
      },
    });
    const initialMatchState = {
        matchId: match.id,
        tournamentId,
        team1: {
          id: team1.id,
          name: team1.name,
          players: team1.players.map((player) => ({
            id: player.id,
            name: player.name,
            totalRuns: player.totalRuns,
            totalWickets: player.totalWickets,
          })),
        },
        team2: {
          id: team2.id,
          name: team2.name,
          players: team2.players.map((player) => ({
            id: player.id,
            name: player.name,
            totalRuns: player.totalRuns,
            totalWickets: player.totalWickets,
          })),
        },
        tossWinnerId,
        decision,
        location,
        currentInnings: 1,
        currentOver: 0,
        currentBall: 0,
        team1Score: { runs: 0, wickets: 0, overs: 0 },
        team2Score: { runs: 0, wickets: 0, overs: 0 },
      };
      await redis.set(`match:${match.id}`, JSON.stringify(initialMatchState));
    res.status(201).json({
      message: "Match started successfully",
      match,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};



export const handelEvent=(req:Request,res:Response)=>{

}