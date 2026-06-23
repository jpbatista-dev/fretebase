-- Users
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin FreteBase', 'admin@fretebase.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i', 'admin'),
('Operador João', 'joao@fretebase.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i', 'operator');

-- Drivers
INSERT INTO drivers (name, cpf, cnh, cnh_category, cnh_expiry, phone) VALUES
('Carlos Eduardo Silva',    '11122233344', 'CNH001', 'E', '2027-03-15', '(11) 91111-0001'),
('Marcos Antônio Ferreira', '22233344455', 'CNH002', 'E', '2026-08-20', '(11) 91111-0002'),
('Roberto Lima Santos',     '33344455566', 'CNH003', 'D', '2028-01-10', '(11) 91111-0003'),
('Paulo Henrique Costa',    '44455566677', 'CNH004', 'E', '2027-06-30', '(11) 91111-0004'),
('André Luiz Oliveira',     '55566677788', 'CNH005', 'C', '2026-11-25', '(11) 91111-0005');

-- Vehicles
INSERT INTO vehicles (plate, type, brand, model, year, capacity_kg) VALUES
('ABC1D23', 'truck',      'Volvo',     'FH 460',      2021, 25000),
('DEF2E34', 'semi_truck', 'Scania',    'R 450',       2020, 35000),
('GHI3F45', 'truck',      'Mercedes',  'Actros 2651', 2022, 27000),
('JKL4G56', 'van',        'Fiat',      'Ducato',      2023,  2000),
('MNO5H67', 'semi_truck', 'Volvo',     'FM 370',      2019, 33000);

-- Routes
INSERT INTO routes (origin, destination, distance_km, rate_per_km) VALUES
('São Paulo, SP',      'Rio de Janeiro, RJ', 430.00, 3.20),
('São Paulo, SP',      'Curitiba, PR',       408.00, 3.00),
('São Paulo, SP',      'Belo Horizonte, MG', 586.00, 3.50),
('Campinas, SP',       'Santos, SP',         148.00, 2.80),
('São Paulo, SP',      'Ribeirão Preto, SP', 313.00, 2.60),
('Guarulhos, SP',      'Sorocaba, SP',       120.00, 2.50),
('São Paulo, SP',      'Goiânia, GO',        926.00, 4.00),
('São Paulo, SP',      'Porto Alegre, RS',  1112.00, 4.50),
('Campinas, SP',       'São José dos Campos, SP', 180.00, 2.70),
('São Paulo, SP',      'Manaus, AM',        3900.00, 6.00);

-- Trips (last 6 months, mix of statuses)
DO $$
DECLARE
  v_driver_ids  UUID[];
  v_vehicle_ids UUID[];
  v_route_ids   UUID[];
  v_trip_id     UUID;
  i             INT;
  v_departure   TIMESTAMPTZ;
  v_weight      NUMERIC;
BEGIN
  SELECT ARRAY(SELECT id FROM drivers) INTO v_driver_ids;
  SELECT ARRAY(SELECT id FROM vehicles) INTO v_vehicle_ids;
  SELECT ARRAY(SELECT id FROM routes)   INTO v_route_ids;

  FOR i IN 1..120 LOOP
    v_departure := NOW() - (RANDOM() * INTERVAL '180 days');
    v_weight    := 1000 + RANDOM() * 24000;

    INSERT INTO trips (
      driver_id, vehicle_id, route_id,
      departure_at, cargo_weight_kg, status
    )
    VALUES (
      v_driver_ids [(i % 5) + 1],
      v_vehicle_ids[(i % 5) + 1],
      v_route_ids  [(i % 10) + 1],
      v_departure,
      ROUND(v_weight::NUMERIC, 2),
      CASE
        WHEN i % 10 = 0 THEN 'cancelled'
        WHEN i % 5  = 0 THEN 'in_transit'
        WHEN i % 3  = 0 THEN 'scheduled'
        ELSE 'completed'
      END
    )
    RETURNING id INTO v_trip_id;

    -- Calculate freight for non-cancelled trips
    IF i % 10 != 0 THEN
      PERFORM calculate_freight(v_trip_id);
    END IF;

    -- Set arrived_at for completed trips
    IF i % 10 != 0 AND i % 5 != 0 AND i % 3 != 0 THEN
      UPDATE trips
      SET arrived_at = departure_at + (RANDOM() * INTERVAL '48 hours')
      WHERE id = v_trip_id;
    END IF;
  END LOOP;
END;
$$;

-- Incidents for some completed trips
INSERT INTO incidents (trip_id, type, description, occurred_at)
SELECT
  t.id,
  (ARRAY['delay','damage','mechanical','other'])[FLOOR(RANDOM() * 4 + 1)::INT],
  'Incident registered during trip',
  t.departure_at + INTERVAL '6 hours'
FROM trips t
WHERE t.status = 'completed'
LIMIT 20;
