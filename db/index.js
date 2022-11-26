// Import postgress package we installed - npm install pg
// Get the client so we can run our postgres server
const { Client } = require("pg");
// create a client by supplying the location which is usually on 5432 and the db name
const client = new Client("postgres://localhost:5432/juicebox-dev");

// HELPER UTILITY FUNCTIONS
const getAllUsers = async () => {
  try {
    const { rows } = await client.query(`
        SELECT *
        FROM users;
    `);
    return rows;
  } catch (error) {
    console.log("There was an error in the getAllUsers");
    console.error(error);
  }
};

const createUser = async ({ username, password }) => {
  try {
    const result = await client.query(
      `
            INSERT INTO users (username, password)
            VALUES ($1, $2)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
        `,
      [username, password]
    );

    return result;
  } catch (error) {
    console.error("There was an error creating users");
    throw error;
  }
};

module.exports = {
  client,
  getAllUsers,
  createUser,
};
