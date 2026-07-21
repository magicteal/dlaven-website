import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "./models/User";
import { connectDB } from "./utils/db";

async function makeAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();

    const email = "marshadkhn89@gmail.com";
    const password = "PDumb@1122";

    const passwordHash = await bcrypt.hash(password, 10);

    let user = await User.findOne({ email });

    if (user) {
      user.passwordHash = passwordHash;
      user.role = "admin";
      await user.save();
      console.log(`Successfully updated existing user ${email} to admin role.`);
    } else {
      user = await User.create({
        email,
        passwordHash,
        role: "admin",
        firstName: "Arshad",
        lastName: "Khan",
        name: "Arshad Khan",
        title: "Mr",
      });
      console.log(`Successfully created new admin user ${email}.`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error making user admin:", error);
    process.exit(1);
  }
}

makeAdmin();
