CREATE OR REPLACE FUNCTION driver_report(
  p_driver_id UUID,
  p_month     INT,
  p_year      INT
)
RETURNS TABLE (
  driver_name       VARCHAR,
  total_trips       BIGINT,
  completed_trips   BIGINT,
  cancelled_trips   BIGINT,
  total_km          NUMERIC,
  total_freight     NUMERIC,
  total_incidents   BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.name                                        AS driver_name,
    COUNT(t.id)                                   AS total_trips,
    COUNT(t.id) FILTER (WHERE t.status = 'completed')  AS completed_trips,
    COUNT(t.id) FILTER (WHERE t.status = 'cancelled')  AS cancelled_trips,
    COALESCE(SUM(r.distance_km), 0)               AS total_km,
    COALESCE(SUM(t.freight_value), 0)             AS total_freight,
    COUNT(i.id)                                   AS total_incidents
  FROM drivers d
  LEFT JOIN trips t ON t.driver_id = d.id
    AND EXTRACT(MONTH FROM t.departure_at) = p_month
    AND EXTRACT(YEAR  FROM t.departure_at) = p_year
  LEFT JOIN routes r ON r.id = t.route_id
  LEFT JOIN incidents i ON i.trip_id = t.id
  WHERE d.id = p_driver_id
  GROUP BY d.name;
END;
$$ LANGUAGE plpgsql;
