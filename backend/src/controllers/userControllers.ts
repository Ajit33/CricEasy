import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CustomError } from "../utils/application.errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}

interface LoginUserProps {
  email: string;
  password: string;
}

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password }: CreateUserProps = req.body;

    if (!name || !email || !password) {
      throw new CustomError("Please fill all the details", 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new CustomError("Email already exists", 409);
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
      token,
    });
  } catch (error: any) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginUserProps = req.body;

    if (!email || !password) {
      throw new CustomError("Please provide email and password", 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new CustomError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new CustomError("Invalid email or password", 401);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error: any) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
