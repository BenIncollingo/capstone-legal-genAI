import pool from "../database/index.js";

export const createConversation = async (userId, title) => {
  const result = await pool.query(
    `
    INSERT INTO conversations (user_id, title, created_at, updated_at)
    VALUES ($1, $2, NOW(), NOW())
    RETURNING *
    `,
    [userId, title || "New Chat"]
  );

  return result.rows[0];
};

export const getConversationsByUser = async (userId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM conversations
    WHERE user_id = $1
    ORDER BY updated_at DESC
    `,
    [userId]
  );

  return result.rows;
};

export const createMessage = async (conversationId, role, content) => {
  const result = await pool.query(
    `
    INSERT INTO messages (conversation_id, role, content, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING *
    `,
    [conversationId, role, content]
  );

  await pool.query(
    `
    UPDATE conversations
    SET updated_at = NOW()
    WHERE id = $1
    `,
    [conversationId]
  );

  return result.rows[0];
};

export const getMessagesByConversation = async (conversationId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM messages
    WHERE conversation_id = $1
    ORDER BY created_at ASC
    `,
    [conversationId]
  );

  return result.rows;
};