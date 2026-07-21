import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "./models/User";

async function makeAdminAtlas() {
  try {
    const uri = process.env.MONGODB_URI_ATLAS;
    if (!uri) {
      console.log("No MONGODB_URI_ATLAS found in .env, skipping Atlas update.");
      process.exit(0);
    }
    console.log("Connecting to Atlas MongoDB...");
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri);

    const email = "marshadkhn89@gmail.com";
    const password = "PDumb@1122";
    const passwordHash = await bcrypt.hash(password, 10);

    let user = await User.findOne({ email });

    if (user) {
      user.passwordHash = passwordHash;
      user.role = "admin";
      await user.save();
      console.log(`Successfully updated Atlas user ${email} to admin role.`);
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
      console.log(`Successfully created new Atlas admin user ${email}.`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error making Atlas user admin:", error);
    process.exit(0);
  }
}

makeAdminAtlas();
