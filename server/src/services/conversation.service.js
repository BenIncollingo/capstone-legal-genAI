//this file contains all the service function (logic) for communicating with the cloudSQL DB we have on GCP

import pool from "../database/index.js";


//function that gets called from /api/db/conversations
export const createConversation = async (userId, title) => {
  const result = await pool.query( //runs a SQL query to insert a new chat - inserts 4 values into the conversations table, user_id, title of conversation, and the current time twice
    `
    INSERT INTO conversations (user_id, title, created_at, updated_at) 
    VALUES ($1, $2, NOW(), NOW())
    RETURNING *
    `,
    [userId, title || "New Chat"] //user ID and title (New Chat on default), Now() is the current time in SQL for the created at time and last updated time
  );

  return result.rows[0];
};

//function gets called from /api/db/conversations/:userId
//fetches all the conversations a user has
export const getConversationsByUser = async (userId) => {
  const result = await pool.query(  //SELECT statment to get all conversations from a user
    `
    SELECT *
    FROM conversations
    WHERE user_id = $1
    ORDER BY updated_at DESC
    `,
    [userId]
  );

  return result.rows; //retruns all the rows returned by the query
};

export const createMessage = async (
  conversationId,
  userId,
  role,
  content,
  citations = []
) => {
  //checks to ensure that the conversation being updated belongs to the user chatting in it
  const ownershipCheck = await pool.query(
    `
    SELECT id
    FROM conversations
    WHERE id = $1 AND user_id = $2
    `,
    [conversationId, userId]
  );

  //throw an error if they dont match 
  if (ownershipCheck.rows.length === 0) {
    throw new Error("Unauthorized conversation access");
  }

  //inserts new message into table
  const result = await pool.query(
    `
    INSERT INTO messages (conversation_id, role, content, citations)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [conversationId, role, content, JSON.stringify(citations || [])]
  ); //citations defaults to an empty array beacuse the user chats wont have them, but cant be null in the table

  await pool.query( //updates the updated_at value in the conversations table to Now() current date/time
    `
    UPDATE conversations
    SET updated_at = NOW()
    WHERE id = $1
    `,
    [conversationId]
  );

  return result.rows[0]; 
};


//function called by /api/db/messages/:conversationId/:userId
//returns all messages within a conversation
export const getMessagesByConversation = async (conversationId, userId) => {
  //selects all the messages within the selected conversation under the given user
  const result = await pool.query(
    `
    SELECT m.*
    FROM messages m
    JOIN conversations c ON m.conversation_id = c.id
    WHERE m.conversation_id = $1
      AND c.user_id = $2
    ORDER BY m.created_at ASC
    `,
    [conversationId, userId]
  );

  //returns all the rows as an array of new objects containing all messages from the row and the citations+scores
  return result.rows.map((row) => ({
    ...row, //spread operator - puts everything in row into a new object with citations
    citations: row.citations || [],
  }));
};

//function called by /api/db/conversations/:conversationId/:userId
//cleans out the conversation, then deletes the conversation
export const deleteConversation = async (conversationId, userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); //i forget what begin means from SQL class

    //checks to ensure that the conversation belongs to the user
    const ownershipCheck = await client.query(
      `
      SELECT *
      FROM conversations
      WHERE id = $1 AND user_id = $2
      `,
      [conversationId, userId]
    );

    if (ownershipCheck.rows.length === 0) { //rollback before committing the changes to the table on fail
      await client.query("ROLLBACK");
      return null;
    }

    //Deletes all the messages in the messages table before deleting the conversation
    await client.query(
      `
      DELETE FROM messages
      WHERE conversation_id = $1
      `,
      [conversationId]
    );

    //deletes the conversation from the conversation table
    const deletedConversationResult = await client.query(
      `
      DELETE FROM conversations
      WHERE id = $1 AND user_id = $2
      RETURNING *
      `,
      [conversationId, userId]
    );

    //commits these changes to the SQL table
    await client.query("COMMIT");

    return deletedConversationResult.rows[0]; //returns confirmation on sucess
  } catch (error) { //catches any error on fail
    await client.query("ROLLBACK"); //rollback on error
    throw error;
  } finally {
    client.release();
  }
};