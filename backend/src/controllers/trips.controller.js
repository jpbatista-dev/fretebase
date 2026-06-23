import pool from "../config/database.js";

export const findAll = async (req, res) => {
  const { status, driver_id } = req.query;

  let query = `
    SELECT
      t.id, t.status, t.departure_at, t.arrived_at,
      t.cargo_weight_kg, t.freight_value, t.notes,
      d.name  AS driver_name,
      v.plate AS vehicle_plate,
      v.type  AS vehicle_type,
      r.origin, r.destination, r.distance_km
    FROM trips t
    JOIN drivers  d ON d.id = t.driver_id
    JOIN vehicles v ON v.id = t.vehicle_id
    JOIN routes   r ON r.id = t.route_id
    WHERE 1=1
  `;

  const params = [];

  if (status) {
    params.push(status);
    query += ` AND t.status = $${params.length}`;
  }

  if (driver_id) {
    params.push(driver_id);
    query += ` AND t.driver_id = $${params.length}`;
  }

  query += " ORDER BY t.departure_at DESC";

  try {
    const { rows } = await pool.query(query, params);
    return res.json(rows);
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const findOne = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         t.*,
         d.name  AS driver_name,
         v.plate AS vehicle_plate,
         r.origin, r.destination, r.distance_km
       FROM trips t
       JOIN drivers  d ON d.id = t.driver_id
       JOIN vehicles v ON v.id = t.vehicle_id
       JOIN routes   r ON r.id = t.route_id
       WHERE t.id = $1`,
      [req.params.id],
    );
    if (!rows[0]) return res.status(404).json({ error: "Trip not found" });
    return res.json(rows[0]);
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const create = async (req, res) => {
  const {
    driver_id,
    vehicle_id,
    route_id,
    departure_at,
    cargo_weight_kg,
    notes,
  } = req.body;

  if (
    !driver_id ||
    !vehicle_id ||
    !route_id ||
    !departure_at ||
    !cargo_weight_kg
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `INSERT INTO trips (driver_id, vehicle_id, route_id, departure_at, cargo_weight_kg, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [driver_id, vehicle_id, route_id, departure_at, cargo_weight_kg, notes],
    );

    const trip = rows[0];

    await client.query("SELECT calculate_freight($1)", [trip.id]);

    const { rows: updated } = await client.query(
      "SELECT * FROM trips WHERE id = $1",
      [trip.id],
    );

    await client.query("COMMIT");

    return res.status(201).json(updated[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};

export const updateStatus = async (req, res) => {
  const { status, arrived_at } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    if (status === "completed") {
      await client.query("SELECT complete_trip($1, $2)", [
        req.params.id,
        arrived_at || new Date(),
      ]);
    } else {
      await client.query(
        `UPDATE trips SET status = $1, updated_at = NOW() WHERE id = $2`,
        [status, req.params.id],
      );
    }

    const { rows } = await client.query("SELECT * FROM trips WHERE id = $1", [
      req.params.id,
    ]);

    await client.query("COMMIT");

    return res.json(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const getDashboard = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'scheduled')   AS scheduled,
        COUNT(*) FILTER (WHERE status = 'in_transit')  AS in_transit,
        COUNT(*) FILTER (WHERE status = 'completed'
          AND departure_at >= DATE_TRUNC('month', NOW())) AS completed_this_month,
        COUNT(*) FILTER (WHERE status = 'cancelled'
          AND departure_at >= DATE_TRUNC('month', NOW())) AS cancelled_this_month,
        COALESCE(SUM(freight_value) FILTER (
          WHERE status = 'completed'
          AND departure_at >= DATE_TRUNC('month', NOW())
        ), 0) AS revenue_this_month
      FROM trips
    `);
    return res.json(rows[0]);
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};
