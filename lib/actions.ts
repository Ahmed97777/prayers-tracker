"use server";

import db from "./db";
import { userSchema } from "./userSchema";
import bcrypt from "bcryptjs";

const signUpAction = async (formData: FormData) => {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      return { success: false, message: "Missing email or password" };
    }

    const validatedData = userSchema.parse({ email, password });
    
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    await db.user.create({
      data: {
        email: validatedData.email.toLocaleLowerCase(),
        password: hashedPassword,
      },
    });
    return { success: true, message: "User created successfully" };
  } catch (err: any) {
    let message = "An unknown error occurred";

    if (err.code === "P2002") {
      // Prisma unique constraint error
      message = "Email already exists.";
    } else if (err.name === "ZodError") {
      message = "Invalid input format.";
    } else if (err instanceof Error) {
      message = err.message;
    }

    console.error("Sign-up failed:", err);
    return { success: false, message };
  }
};

export { signUpAction };