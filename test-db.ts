import dbConnect from "./src/lib/mongodb";
import User from "./src/models/User";
import mongoose from "mongoose";

async function test() {
  await dbConnect();
  console.log("Connected to DB");

  const users = await User.find({}).limit(5);
  console.log("Users in DB:", users.length);

  users.forEach((u) => {
    console.log(
      `User: ${u.username}, Email: ${u.email}, Phone: "${u.phoneNumber}"`,
    );
  });

  process.exit(0);
}

test().catch((err) => {
  console.error(err);
  process.exit(1);
});
