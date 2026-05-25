-- Crea la secuencia atómica para generación de número de pedido
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 129 INCREMENT BY 1 MINVALUE 1;

-- Ajusta la secuencia para que continúe después del mayor número ya existente
DO $$
DECLARE
  max_n bigint;
BEGIN
  -- Extrae el sufijo numérico de los pedidos existentes; si no hay pedidos usa 128
  SELECT COALESCE(MAX((regexp_replace(number, '\\D','','g'))::bigint), 128) INTO max_n FROM orders;
  -- setval deja el valor actual en max_n, por lo que nextval devolverá max_n+1
  PERFORM setval('order_number_seq', max_n);
END$$;
