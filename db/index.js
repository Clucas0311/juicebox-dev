// Import postgress package we installed - npm install pg
// Get the client so we can run our postgres server
const { Client } = require("pg");
// create a client by supplying the location which is usually on 5432 and the db name
const client = new Client("postgres://localhost:5432/juicebox-dev");

// HELPER UTILITY FUNCTIONS
const getAllUsers = async () => {
  try {
    const { rows } = await client.query(`
        SELECT id, username, password, name, location
        FROM users;
    `);

    return rows;
  } catch (error) {
    console.log("There was an error in the getAllUsers");
    console.error(error);
    throw error;
  }
};

const createUser = async ({ username, password, name, location }) => {
  try {
    const { rows } = await client.query(
      `
            INSERT INTO users (username, password, name, location)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
        `,
      [username, password, name, location]
    );

    return rows;
  } catch (error) {
    console.log("There was an error creating users");
    console.error(error);
    throw error;
  }
};

const updateUser = async (userId, fields = {}) => {
  // When using the update method we set our values like this
  // "columnName" = newValue
  // We create an array of all our keys and set them to the index + 2
  // Reason behind this is because we are using sql injection id gets $1 everything after will be $2
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 2}`)
    .join(", ");

  if (setString.length === 0) return;

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      UPDATE users
      SET ${setString}
      WHERE id= $1
      RETURNING *;
    `,
      [userId, ...Object.values(fields)]
    );

    return user;
  } catch (error) {
    console.log("There was an error updating users");
    throw error;
  }
};

module.exports = {
  client,
  getAllUsers,
  createUser,
  updateUser,
};
