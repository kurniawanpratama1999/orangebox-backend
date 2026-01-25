import { prisma } from "#orm/lib/prisma.js";

import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const argv = process.argv.slice(2);

const run = async (seederName) => {
  if (!seederName) {
    throw new Error("try this -> npm run seeder file");
  }

  const filePath = path.join(__dirname, `${seederName}.js`);
  const isFileExist = fs.existsSync(filePath);

  if (!isFileExist) {
    throw new Error(`Cannot found seeder: ${seederName}`);
  }

  const module = await import(filePath);

  if (!module.default) {
    throw new Error("Try to use -> export default MySeeder");
  }

  await module.default();
};

(async () => {
  if (argv.length === 0) {
    throw new Error("try this -> npm run seeder file");
  }

  let currentSeeder = null;

  try {
    for (const seederName of argv) {
      console.info(`${seederName} sedang dijalankan`);

      currentSeeder = seederName;
      await run(seederName);

      console.info(`${seederName} berhasil di eksekusi`);
    }
  } catch (error) {
    console.error(`error: seeder ${currentSeeder} gagal dijalankan`);
    console.log(error);

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
