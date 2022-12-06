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

const getUserById = async (userId) => {
  const {
    rows: [user],
  } = await client.query(
    `
    SELECT id, username, name, location, active
    FROM users 
    WHERE id= $1
  `,
    [userId]
  );
  console.log("user", user);
  if (!user) return null;
  delete user.password;
  user.posts = await getPostsByUser(userId);
  return user;
};

const createUser = async ({ username, password, name, location }) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
            INSERT INTO users (username, password, name, location)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
        `,
      [username, password, name, location]
    );

    return user;
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
const getAllPosts = async () => {
  try {
    const { rows } = await client.query(`
      SELECT id, "authorId", title, content, active  
      FROM posts;
    `);
    return rows;
  } catch (error) {
    console.log("There was an error getting Posts");
    throw error;
  }
};
const createPost = async ({ authorId, title, content }) => {
  try {
    const {
      rows: [posts],
    } = await client.query(
      `
      INSERT INTO posts("authorId", title, content)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [authorId, title, content]
    );
    console.log("rows create post", posts);
    return posts;
  } catch (error) {
    console.log("There was an error creating posts");
    throw error;
  }
};

const updatePost = async (postId, fields = {}) => {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 2}`)
    .join(", ");

  if (setString.length === 0) return;
  try {
    const {
      rows: [post],
    } = await client.query(
      `
      UPDATE posts
      SET ${setString}
      WHERE id= $1
      RETURNING *;
    `,
      [postId, ...Object.values(fields)]
    );
    return post;
  } catch (error) {
    console.log("There was an error in creating Posts ");
    throw error;
  }
};

const getPostsByUser = async (userId) => {
  try {
    const { rows } = await client.query(`
      SELECT * 
      FROM posts
      WHERE "authorId"=${userId};
    `);
    console.log("get post by user", rows);
    return rows;
  } catch (error) {
    console.log("There was an error gettingPosts By User");
    throw error;
  }
};

module.exports = {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  updatePost,
  getPostsByUser,
  getUserById,
  getAllPosts,
};
