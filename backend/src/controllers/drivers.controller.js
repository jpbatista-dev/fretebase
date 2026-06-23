import pool from "../config/database.js";

export const findAll = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, cpf, cnh, cnh_category, cnh_expiry, phone, active, created_at
       FROM drivers
       ORDER BY name ASC`,
    );
    return res.json(rows);
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const findOne = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, cpf, cnh, cnh_category, cnh_expiry, phone, active, created_at
       FROM drivers WHERE id = $1`,
      [req.params.id],
    );
    if (!rows[0]) return res.status(404).json({ error: "Driver not found" });
    return res.json(rows[0]);
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const create = async (req, res) => {
  const { name, cpf, cnh, cnh_category, cnh_expiry, phone } = req.body;

  if (!name || !cpf || !cnh || !cnh_category || !cnh_expiry) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO drivers (name, cpf, cnh, cnh_category, cnh_expiry, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, cpf, cnh, cnh_category, cnh_expiry, phone],
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "CPF or CNH already registered" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const update = async (req, res) => {
  const { name, cnh_expiry, phone, active } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE drivers
       SET name = COALESCE($1, name),
           cnh_expiry = COALESCE($2, cnh_expiry),
           phone = COALESCE($3, phone),
           active = COALESCE($4, active),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [name, cnh_expiry, phone, active, req.params.id],
    );
    if (!rows[0]) return res.status(404).json({ error: "Driver not found" });
    return res.json(rows[0]);
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const remove = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE drivers SET active = false, updated_at = NOW()
       WHERE id = $1 RETURNING id`,
      [req.params.id],
    );
    if (!rows[0]) return res.status(404).json({ error: "Driver not found" });
    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getReport = async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ error: "month and year are required" });
  }

  try {
    const { rows } = await pool.query(
      "SELECT * FROM driver_report($1, $2, $3)",
      [req.params.id, parseInt(month), parseInt(year)],
    );
    return res.json(rows[0]);
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};
