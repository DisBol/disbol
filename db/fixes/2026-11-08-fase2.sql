-- Fase 2 · Integridad de datos (2026-11-08)
-- Ejecutar en la consola de SQLite Cloud BLOQUE POR BLOQUE.
-- Los bloques de "Revisar" solo leen; los de "Reparar" modifican datos.

-- =====================================================================
-- BLOQUE 1 · C6 · Edge Function updateproductrequest
-- Reemplazar la asignación de RequestStage_id en su UPDATE por:
--
--     RequestStage_id = COALESCE(NULLIF($RequestStage_id, 0), RequestStage_id),
--
-- Así, si el front envía 0 (no conoce la etapa), se conserva la etapa actual.
-- Y en la Edge Function getrequesthistory agregar al SELECT:
--
--     s.id AS RequestStage_id,
-- =====================================================================


-- =====================================================================
-- BLOQUE 2 · C6 · Revisar productos que pudieron moverse a la etapa 1
-- La etapa 1 pertenece a una sola solicitud; sus productos legítimos se
-- crearon junto con ella. Los que se crearon en otro momento llegaron por
-- el bug y hay que devolverlos a su etapa original (revisar a mano).
-- =====================================================================
SELECT p.id AS ProductRequest_id, p.Product_id, p.units, p.containers,
       p.created_at, p.updated_at,
       s.created_at AS etapa1_created_at
FROM ProductRequest p
JOIN RequestStage s ON s.id = 1
WHERE p.RequestStage_id = 1
  AND abs(strftime('%s', p.created_at) - strftime('%s', s.created_at)) > 60
ORDER BY p.created_at;


-- =====================================================================
-- BLOQUE 3 · C7 · Revisar banderas guardadas como 1/0 en vez de 'true'/'false'
-- =====================================================================
SELECT 'ProductRequest.active' AS campo, active AS valor, count(*) AS filas
  FROM ProductRequest WHERE active IN (1, 0, '1', '0') GROUP BY active
UNION ALL
SELECT 'ProductRequest.menudencia', menudencia, count(*)
  FROM ProductRequest WHERE menudencia IN (1, 0, '1', '0') GROUP BY menudencia
UNION ALL
SELECT 'RequestWeighing.active', active, count(*)
  FROM RequestWeighing WHERE active IN (1, 0, '1', '0') GROUP BY active;


-- =====================================================================
-- BLOQUE 4 · C7 · Reparar banderas
-- =====================================================================
UPDATE ProductRequest SET active = 'true'  WHERE active IN (1, '1');
UPDATE ProductRequest SET active = 'false' WHERE active IN (0, '0');
UPDATE ProductRequest SET menudencia = 'true'  WHERE menudencia IN (1, '1');
UPDATE ProductRequest SET menudencia = 'false' WHERE menudencia IN (0, '0');
UPDATE RequestWeighing SET active = 'true'  WHERE active IN (1, '1');
UPDATE RequestWeighing SET active = 'false' WHERE active IN (0, '0');


-- =====================================================================
-- BLOQUE 5 · C5 · Revisar usuarios reasignados al cliente 1 o al empleado 1
-- "cliente_correcto"/"empleado_correcto" se deduce porque el usuario se creó
-- con usuario = nombre y contraseña = documento.
-- =====================================================================
SELECT u.id, u.username, u.Role_id, u.Client_id, u.Employee_id,
       (SELECT c.id FROM Client c
         WHERE c.name = u.username AND c.document = u.password AND c.id <> 1) AS cliente_correcto,
       (SELECT e.id FROM Employee e
         WHERE e.name = u.username AND e.document = u.password AND e.id <> 1) AS empleado_correcto
FROM User u
WHERE (u.Role_id = 4 AND u.Client_id = 1)
   OR (u.Role_id = 5 AND u.Employee_id = 1);


-- =====================================================================
-- BLOQUE 6 · C5 · Reparar los que tienen una coincidencia única
-- =====================================================================
UPDATE User
SET Client_id = (SELECT c.id FROM Client c
                  WHERE c.name = User.username AND c.document = User.password AND c.id <> 1),
    updated_at = CURRENT_TIMESTAMP
WHERE Role_id = 4 AND Client_id = 1
  AND (SELECT count(*) FROM Client c
        WHERE c.name = User.username AND c.document = User.password AND c.id <> 1) = 1;

UPDATE User
SET Employee_id = (SELECT e.id FROM Employee e
                    WHERE e.name = User.username AND e.document = User.password AND e.id <> 1),
    updated_at = CURRENT_TIMESTAMP
WHERE Role_id = 5 AND Employee_id = 1
  AND (SELECT count(*) FROM Employee e
        WHERE e.name = User.username AND e.document = User.password AND e.id <> 1) = 1;
