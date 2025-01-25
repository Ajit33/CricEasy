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


 // Adjust import path as needed

export const addTeams = async (req: Request, res: Response) => {
  try {
    // Convert tournamentId to a number
    const tournamentId = Number(req.params.tournamentId);
    console.log("this is the tournamnet Id",tournamentId)
    console.log("params",req.params.tournamentId)
    // Extract the team's name from the request body
    const { name } = req.body;

    // Validate inputs
    if (!name) {
      throw new CustomError("Team name is required", 400);
    }
    if (isNaN(tournamentId)) {
      throw new CustomError("Invalid tournament ID", 400);
    }

    // Find the tournament
    const tournament = await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },
      include: {
        teams: true, // Include related teams if needed
      },
    });

    // Check if the tournament exists
    if (!tournament) {
      throw new CustomError("Tournament not found", 404);
    }

    // Check if the maximum team size has been reached
    if (tournament.teams.length >= tournament.teamSize) {
      throw new CustomError("Maximum team size reached for this tournament", 400);
    }

    // Add the team to the tournament
    const newTeam = await prisma.team.create({
      data: {
        name: name,
        tournament: {
          connect: { id: tournamentId },
        },
      },
    });

    // Send success response
    res.status(201).json({
      message: "Team added successfully",
      team: newTeam,
    });
  } catch (error: any) {
    console.error("Error adding team:", error);

    // Handle errors using the CustomError class
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An internal server error occurred" });
    }
  }
};

