// load .env data into process.env
require("dotenv").config();

// other dependencies
const fs = require("fs");
const chalk = require("chalk");
const pool = require("../lib/db");

// Loads the schema files from db/schema
const runSchemaFiles = async () => {
  console.log(chalk.cyan(`-> Loading Schema Files ...`));
  const schemaFilenames = fs.readdirSync("./db/schema");

  for (const fn of schemaFilenames) {
    const sql = fs.readFileSync(`./db/schema/${fn}`, "utf8");
    console.log(`\t-> Running ${chalk.green(fn)}`);
    await pool.query(sql);
  }
};

const runSeedFiles = async () => {
  console.log(chalk.cyan(`-> Loading Seeds ...`));
  const schemaFilenames = fs.readdirSync("./db/seeds");

  for (const fn of schemaFilenames) {
    const sql = fs.readFileSync(`./db/seeds/${fn}`, "utf8");
    console.log(`\t-> Running ${chalk.green(fn)}`);
    await pool.query(sql);
  }
};

const runResetDB = async () => {
  try {
    await pool.connect();
    await runSchemaFiles();
    await runSeedFiles();
    console.log(chalk.cyan('\n-- All done --'));
    pool.end();
    process.exit(); // tells terminal to exit
  } catch (err) {
    console.error(chalk.red(`Failed due to error: ${err}`));
    console.log(chalk.cyan('\n-- CTRL + C to exit --'));
    pool.end();
  }
};

runResetDB();