import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const executeQuery = async (queryString, params = []) => {
  try {
    const [results] = await db.execute(queryString, params);
    // console.log("results", results);
    return results;
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  }
};

export default db;