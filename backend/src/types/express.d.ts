// src/types/express.d.ts
import { User } from '@prisma/client'; // Adjust this import based on your actual User model

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; email: string }; // Modify according to the user data you want to store
    }
  }
}
