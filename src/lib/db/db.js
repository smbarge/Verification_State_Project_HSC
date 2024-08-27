import pkg from "pg"; // Import the CommonJS module
const { Client } = pkg; // Destructure to get the Client class

// Create a new client instance using the environment variable
let connected = false;
async function connectDb() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL");
    connected = true;
  } catch (error) {
    console.error("Connection error", error.stack);
  }
}

export async function queryDb(query) {
  try {
    let DATABASE_URL =
      "postgres://boarduser:Admin@2024@3.110.80.229:5432/verification_db";
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
