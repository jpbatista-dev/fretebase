CREATE OR REPLACE FUNCTION complete_trip(
  p_trip_id    UUID,
  p_arrived_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS VOID AS $$
DECLARE
  v_status       VARCHAR;
  v_departure_at TIMESTAMPTZ;
BEGIN
  SELECT status, departure_at
  INTO v_status, v_departure_at
  FROM trips
  WHERE id = p_trip_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Trip not found: %', p_trip_id;
  END IF;

  IF v_status != 'in_transit' THEN
    RAISE EXCEPTION 'Trip must be in_transit to complete. Current status: %', v_status;
  END IF;

  IF p_arrived_at < v_departure_at THEN
    RAISE EXCEPTION 'Arrival time cannot be before departure time';
  END IF;

  UPDATE trips
  SET
    status     = 'completed',
    arrived_at = p_arrived_at,
    updated_at = NOW()
  WHERE id = p_trip_id;

  -- Auto-register delay incident if arrived more than 24h after departure
  IF p_arrived_at > v_departure_at + INTERVAL '24 hours' THEN
    INSERT INTO incidents (trip_id, type, description, occurred_at)
    VALUES (
      p_trip_id,
      'delay',
      'Trip completed more than 24 hours after scheduled departure',
      p_arrived_at
    );
  END IF;
END;
$$ LANGUAGE plpgsql;
