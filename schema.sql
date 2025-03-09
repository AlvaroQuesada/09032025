-- Tabla para almacenar las ubicaciones de los conductores
CREATE TABLE driver_locations (
  id SERIAL PRIMARY KEY,
  driver_id UUID NOT NULL REFERENCES users(id),
  latitude DECIMAL(10, 6) NOT NULL,
  longitude DECIMAL(10, 6) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'offline', -- offline, available, busy
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(driver_id)
);

-- Índice para búsquedas rápidas por driver_id
CREATE INDEX idx_driver_locations_driver_id ON driver_locations(driver_id);

-- Función para actualizar el timestamp cuando se actualiza la ubicación
CREATE OR REPLACE FUNCTION update_driver_location_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar el timestamp
CREATE TRIGGER update_driver_location_timestamp
BEFORE UPDATE ON driver_locations
FOR EACH ROW
EXECUTE FUNCTION update_driver_location_timestamp();

