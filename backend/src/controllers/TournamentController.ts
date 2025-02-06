import { Request, Response } from "express";
import { CustomError } from "../utils/application.errors";
import prisma from "../utils/Prisma"; // Ensure this points to your Prisma client instance

interface CreateTournamentProps {
  name: string;
  date: Date;
  place: string;
  teamSize: number;
}

export const createTournament = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, date, place, teamSize } = req.body as CreateTournamentProps;

    if (!name || !date || !place || !teamSize) {
      throw new CustomError("Please fill all the details", 400);
    }

    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError("User is not authenticated", 401);
    }

    const newTournament = await prisma.tournament.create({
      data: {
        name,
        date,
        place,
        teamSize,
        creator: {
          connect: { id: userId },
        },
      },
    });

    res.status(201).json({
      message: "Tournament created successfully!",
      tournament: newTournament, 
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error(error); 
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};




export const addTeams = async (req: Request, res: Response) => {
  try {
    const tournamentId = Number(req.params.tournamentId);
    console.log("Tournament ID:", tournamentId);

    const { name } = req.body;

    if (!name) {
      throw new CustomError("Team name is required", 400);
    }

    if (isNaN(tournamentId)) {
      throw new CustomError("Invalid tournament ID", 400);
    }

    // Check if the tournament exists
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: { teams: true },
    });

    if (!tournament) {
      throw new CustomError("Tournament not found", 404);
    }

 
    const isTeamExist = await prisma.team.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        tournamentId: tournamentId, 
      },
    });

    if (isTeamExist) {
      throw new CustomError("Team with this name already exists in the tournament", 400);
    }

    // Check if maximum team size is reached
    if (tournament.teams.length >= tournament.teamSize) {
      throw new CustomError("Maximum team size reached for this tournament", 400);
    }

    // Add the team to the tournament
    const newTeam = await prisma.team.create({
      data: {
        name,
        tournament: {
          connect: { id: tournamentId },
        },
      },
    });

    res.status(201).json({
      message: "Team added successfully",
      team: newTeam,
    });
  } catch (error: any) {
    console.error("Error adding team:", error.message || error);

    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An internal server error occurred" });
    }
  }
};
