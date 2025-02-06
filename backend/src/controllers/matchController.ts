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



export const handleEvent = async (req: Request, res: Response) => {
  try {
    const { matchId, eventType, runs, wicketType, extras, strikerId, nonStrikerId, bowlerId } = req.body;

    // Get match state from Redis
    const matchData = await redis.get(`match:${matchId}`);
    if (!matchData) {
      throw new CustomError("Match not found!", 404);
    }

    let matchState = JSON.parse(matchData);
    const { currentInnings, team1, team2, tossWinnerId, decision, team1Score, team2Score, currentOver, currentBall } = matchState;

    let battingTeam = currentInnings === 1 ? team1 : team2;
    let bowlingTeam = currentInnings === 1 ? team2 : team1;
    let battingScore = currentInnings === 1 ? team1Score : team2Score;
     console.log(bowlingTeam)
    let striker = battingTeam.players.find((p: any) => p.id === strikerId);
    let nonStriker = battingTeam.players.find((p: any) => p.id === nonStrikerId);
    let bowler = bowlingTeam.players.find((p: any) => p.id === bowlerId);
     console.log("stricker",striker)
     console.log("nonstricker",nonStriker)
     console.log("bowl",bowler)
    if (!striker || !nonStriker || !bowler) {
      throw new CustomError("Invalid player IDs", 400);
    }

    let ballType = "normal";
    let isBoundary = false;
    let isWide = false;
    let isWicket = false;

    if (eventType === "run") {
      striker.totalRuns += runs;
      battingScore.runs += runs;
      if (runs === 4 || runs === 6) {
        isBoundary = true;
        if (runs === 4) striker.fours = (striker.fours || 0) + 1;
        if (runs === 6) striker.sixes = (striker.sixes || 0) + 1;
      }
      if (runs % 2 !== 0) {
        [striker, nonStriker] = [nonStriker, striker];
      }
    } else if (eventType === "wicket") {
      battingScore.wickets += 1;
      bowler.totalWickets += 1;
      striker.isOut = true;
      isWicket = true;
    } else if (eventType === "wide") {
      battingScore.runs += 1;
      battingScore.extras = (battingScore.extras || 0) + 1;
      bowler.wides = (bowler.wides || 0) + 1;
      isWide = true;
      ballType = "wide";
    } else if (eventType === "no-ball") {
      battingScore.runs += 1;
      battingScore.extras = (battingScore.extras || 0) + 1;
      bowler.noBalls = (bowler.noBalls || 0) + 1;
      ballType = "no-ball";
    }

    if (!isWide && ballType !== "no-ball") {
      matchState.currentBall += 1;
      if (matchState.currentBall >= 6) {
        matchState.currentOver += 1;
        matchState.currentBall = 0;
        [striker, nonStriker] = [nonStriker, striker];
      }
    }

    await prisma.matchEvent.create({
      data: {
        matchId,
        innings: currentInnings,
        over: currentOver,
        ball: currentBall,
        strikerId: striker.id,
        nonStrikerId: nonStriker.id,
        bowlerId: bowler.id,
        runs,
        ballType,
        isBoundary,
        isWide,
        isWicket,
      },
    });

    await redis.set(`match:${matchId}`, JSON.stringify(matchState));
    redis.publish(`match:${matchId}`, JSON.stringify(matchState));

    res.json({ message: "Match updated successfully", matchState });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
