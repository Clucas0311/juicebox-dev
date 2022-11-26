const { client, getAllUsers, createUser } = require("./index");

// This function should call a query which drops all tables from our database
const dropTables = async () => {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
        DROP TABLE IF EXISTS users;
    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
};

const createInitialUsers = async () => {
  try {
    console.log("Starting to create users...");
    const albert = await createUser({
      username: "albert",
      password: "bertie99",
    });
    const albertTwo = await createUser({
      username: "albert",
      password: "bertie99",
    });
    console.log("albertTwo", albertTwo);

    console.log("albert", albert);

    const sandra = await createUser({
      username: "sandra",
      password: "2sandy4me",
    });

    console.log("sandra", sandra);

    const glamgal = await createUser({
      username: "glamgal",
      password: "soglam",
    });
    console.log("glamgal", glamgal);

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
};

// this function should call a query which creates all tables from our database
const createTables = async () => {
  try {
    console.log("Starting to build tables...");

    await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );
    `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
};

const rebuildDB = async () => {
  try {
    // connect our client to our database
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {}
};

// This function will test all our helper functions
const testDB = async () => {
  try {
    const users = await getAllUsers();
    console.log("getAllUsers:", users);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  } finally {
    client.end();
  }
};

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
