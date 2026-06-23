CREATE OR REPLACE FUNCTION calculate_freight(p_trip_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  v_distance_km   NUMERIC;
  v_rate_per_km   NUMERIC;
  v_weight_kg     NUMERIC;
  v_freight_value NUMERIC;
BEGIN
  SELECT
    r.distance_km,
    r.rate_per_km,
    t.cargo_weight_kg
  INTO v_distance_km, v_rate_per_km, v_weight_kg
  FROM trips t
  JOIN routes r ON r.id = t.route_id
  WHERE t.id = p_trip_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Trip not found: %', p_trip_id;
  END IF;

  -- Formula: distance * rate * weight factor (per ton)
  v_freight_value := v_distance_km * v_rate_per_km * (v_weight_kg / 1000);

  UPDATE trips
  SET
    freight_value = v_freight_value,
    updated_at    = NOW()
  WHERE id = p_trip_id;

  RETURN v_freight_value;
END;
$$ LANGUAGE plpgsql;
