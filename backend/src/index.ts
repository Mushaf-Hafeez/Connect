import prisma from "./config/db.config.js";

async function main() {
  try {
    const user = await prisma.user.findMany();

    console.log(user);
  } catch (error) {
    console.log(error);
  }
}

main();
