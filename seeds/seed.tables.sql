BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Irish', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'cleachtadh', 'practice', 2),
  (2, 1, 'Dia dhuit', 'hello', 3),
  (3, 1, 'teach', 'house', 4),
  (4, 1, 'forbróir', 'developer', 5),
  (5, 1, 'aistrigh', 'translate', 6),
  (6, 1, 'iontach', 'amazing', 7),
  (7, 1, 'gaelige', 'Irish', 8)
  (8, 1, 'ríomhaire', 'computer', 9),
  (9, 1, 'madra', 'dog', 10),
  (10, 1, 'clár', 'program', 11),
  (11, 1, 'cód', 'code', 12),
  (12,1,"comhréir", "syntax",13),
  (13, 1, 'cat', 'cat', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
