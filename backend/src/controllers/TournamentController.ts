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

