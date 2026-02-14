// 1. IMPORT the shared pool (no new Pool here!)
import { pool } from "../config/db.mjs";

// 2. SHOW ALL (Uses SQL instead of reading a JSON file)
export const showAllHabit = async () => {
  const res = await pool.query(
    'SELECT id, task, is_done AS "isDone" FROM habits',
  );
  return res.rows;
};

// 3. ADD HABIT (Postgres generates the ID automatically)
export const addHabit = async (task) => {
  const res = await pool.query(
    "INSERT INTO habits (task) VALUES ($1) RETURNING *",
    [task],
  );
  return res.rows[0];
};

// 4. DELETE HABIT
export const delHabit = async (id) => {
  const res = await pool.query("DELETE FROM habits WHERE id = $1 RETURNING *", [
    id,
  ]);
  if (res.rowCount === 0) throw new Error("Not found");
  return res.rows;
};

// 5. TOGGLE ITEM
export const toggleItem = async (id) => {
  const res = await pool.query(
    "UPDATE habits SET is_done = NOT is_done WHERE id = $1 RETURNING *",
    [id],
  );
  if (res.rowCount === 0) throw new Error("NOT_FOUND");
  return res.rows[0];
};

// 6. RESET
export const reset = async () => {
  await pool.query("DELETE FROM habits");
  return [];
};
