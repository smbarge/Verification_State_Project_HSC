import pkg from "pg"; // Import the CommonJS module
const { Client } = pkg; // Destructure to get the Client class

// Create a new client instance using the environment variable
let connected = false;


export async function queryDb(query) {
  try {
    let DATABASE_URL =
      "postgres://verification_user:Admin@2026@13.201.171.187:5432/verification_database";
    const client = new Client({
      connectionString: DATABASE_URL,
    });
    await client.connect();
    console.log("db connection successful: ");
    const res = await client.query(query);
    return res.rows;
  } catch (error) {
    console.error("Query error", error.stack);
    throw error;
  }
}
