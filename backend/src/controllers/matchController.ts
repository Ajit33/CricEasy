import { Request, Response } from "express";
import { CustomError } from "../utils/application.errors";
import prisma from "../utils/Prisma";

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
        tournament: true, // Include tournament to verify it belongs to the right tournament
      },
    });

    const team2 = await prisma.team.findUnique({
      where: {
        id: team2Id,
      },
      include: {
        tournament: true,
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
