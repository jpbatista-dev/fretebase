import pool from '../config/database.js';

export const findAll = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, plate, type, brand, model, year, capacity_kg, active, created_at
       FROM vehicles ORDER BY brand, model ASC`
    );
    return res.json(rows);
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const create = async (req, res) => {
  const { plate, type, brand, model, year, capacity_kg } = req.body;

  if (!plate || !type || !brand || !model || !year || !capacity_kg) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO vehicles (plate, type, brand, model, year, capacity_kg)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [plate, type, brand, model, year, capacity_kg]
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Plate already registered' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const update = async (req, res) => {
  const { brand, model, year, capacity_kg, active } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE vehicles
       SET brand       = COALESCE($1, brand),
           model       = COALESCE($2, model),
           year        = COALESCE($3, year),
           capacity_kg = COALESCE($4, capacity_kg),
           active      = COALESCE($5, active),
           updated_at  = NOW()
       WHERE id = $6
       RETURNING *`,
      [brand, model, year, capacity_kg, active, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Vehicle not found' });
    return res.json(rows[0]);
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const remove = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE vehicles SET active = false, updated_at = NOW()
       WHERE id = $1 RETURNING id`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Vehicle not found' });
    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
