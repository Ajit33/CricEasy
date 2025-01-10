import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CustomError } from "../utils/application.errors";
import bcrypt from "bcrypt"
interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}
interface loginUserProps{
   email: string;
  password: string;
}
const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password }: CreateUserProps = req.body;

    
    if (!name || !email || !password) {
      throw new CustomError("Please fill all the details", 400);
    }

  
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new CustomError("Email already exists", 409);
    }
const salt=10;
const hashedpassword= await bcrypt.hash(password,salt)
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password:hashedpassword, 
      },
    });
  const {password:_, ...userWithoutpass}=newUser
    res.status(201).json({
      message: "User created successfully",
      user: userWithoutpass,
    });
  } catch (error: any) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.log(error)
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const loginUser=async(req:Request,res:Response):Promise<void>=>{
   try {
      const {email,password}:loginUserProps=req.body;
      if (!email || !password) {
         throw new CustomError("Please provide email and password", 400);
       }
   
       // Find user by email
       const user = await prisma.user.findUnique({
         where: { email },
       });
   
       if (!user) {
         throw new CustomError("Invalid email or password", 401);
       }
   
       // Compare password
       const isPasswordValid = await bcrypt.compare(password, user.password);
   
       if (!isPasswordValid) {
         throw new CustomError("Invalid email or password", 401);
       }
   
       // If valid, return user details (excluding password)
       const { password: _, ...userWithoutPassword } = user;
   
       res.status(200).json({
         message: "Login successful",
         user: userWithoutPassword,
       });
     } catch (error: any) {
       if (error instanceof CustomError) {
         res.status(error.statusCode).json({ error: error.message });
       } else {
         res.status(500).json({ error: "Internal Server Error" });
       }
     }
   };