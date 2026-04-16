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

export const createMessage = async (
  conversationId,
  userId,
  role,
  content,
  citations = []
) => {
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
    INSERT INTO messages (conversation_id, role, content, citations)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [conversationId, role, content, JSON.stringify(citations || [])]
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

  return result.rows.map((row) => ({
    ...row,
    citations: row.citations || [],
  }));
};

export const deleteConversation = async (conversationId, userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const ownershipCheck = await client.query(
      `
      SELECT *
      FROM conversations
      WHERE id = $1 AND user_id = $2
      `,
      [conversationId, userId]
    );

    if (ownershipCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    await client.query(
      `
      DELETE FROM messages
      WHERE conversation_id = $1
      `,
      [conversationId]
    );

    const deletedConversationResult = await client.query(
      `
      DELETE FROM conversations
      WHERE id = $1 AND user_id = $2
      RETURNING *
      `,
      [conversationId, userId]
    );

    await client.query("COMMIT");

    return deletedConversationResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};