import pool from '../config/database.js';

export const findAll = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, origin, destination, distance_km, rate_per_km, active
       FROM routes ORDER BY origin, destination ASC`
    );
    return res.json(rows);
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
