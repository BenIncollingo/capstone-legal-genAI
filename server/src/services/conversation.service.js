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

// export const createMessage = async (conversationId, role, content) => {
//   const result = await pool.query(
//     `
//     INSERT INTO messages (conversation_id, role, content, created_at)
//     VALUES ($1, $2, $3, NOW())
//     RETURNING *
//     `,
//     [conversationId, role, content]
//   );

//   await pool.query(
//     `
//     UPDATE conversations
//     SET updated_at = NOW()
//     WHERE id = $1
//     `,
//     [conversationId]
//   );

//   return result.rows[0];
// };

export const createMessage = async (conversationId, userId, role, content) => {
  const ownershipCheck = await pool.query(
    `
    SELECT id
    FROM conversations
    WHERE id = $1 AND user_id = $2
    `,
    [conversationId, userId]
  );

  if (ownershipCheck.rows.length === 0) {
    throw new Error("Unauthorized conversation access");
  }

  const result = await pool.query(
    `
    INSERT INTO messages (conversation_id, role, content)
    VALUES ($1, $2, $3)
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

export const getMessagesByConversation = async (conversationId, userId) => {
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

  return result.rows;
};