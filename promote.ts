import dbConnect from "./src/lib/mongodb";
import User from "./src/models/User";

async function promoteToAdmin(email: string) {
  try {
    await dbConnect();
    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true },
    );
    if (user) {
      console.log(`Successfully promoted ${email} to admin.`);
    } else {
      console.log(`User with email ${email} not found.`);
    }
  } catch (error) {
    console.error("Error promoting user:", error);
  } finally {
    process.exit(0);
  }
}

const email = process.argv[2];
if (!email) {
  console.log(
    "Please provide an email: npx ts-node promote.ts user@example.com",
  );
  process.exit(1);
}

promoteToAdmin(email);
