--
-- PostgreSQL database Proman
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET default_tablespace = '';

SET default_with_oids = false;

---
--- drop tables
---

DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS cards;

---
--- create tables
---

CREATE TABLE statuses (
    id       SERIAL PRIMARY KEY     NOT NULL,
    board_id INTEGER                NOT NULL,
    title    VARCHAR(200)           NOT NULL
);

CREATE TABLE boards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    title       VARCHAR(200)        NOT NULL
);

CREATE TABLE cards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    board_id    INTEGER             NOT NULL,
    status_id   INTEGER             NOT NULL,
    title       VARCHAR (200)       NOT NULL,
    card_order  INTEGER             NOT NULL,
    archived    BOOLEAN             NOT NULL
);

---
--- insert data
---


INSERT INTO boards(title) VALUES ('Board 1');
INSERT INTO boards(title) VALUES ('Board 2');

INSERT INTO statuses(board_id, title) VALUES (1, 'new');
INSERT INTO statuses(board_id, title) VALUES (1, 'in progress');
INSERT INTO statuses(board_id, title) VALUES (1, 'testing');
INSERT INTO statuses(board_id, title) VALUES (1, 'done');

INSERT INTO statuses(board_id, title) VALUES (2, 'new');
INSERT INTO statuses(board_id, title) VALUES (2, 'in progress');
INSERT INTO statuses(board_id, title) VALUES (2, 'testing');
INSERT INTO statuses(board_id, title) VALUES (2, 'done');

INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 1', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 2', 2, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'in progress card', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 3, 'planning', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 2, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 1, 'new card 1', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 1, 'new card 2', 2, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 2, 'in progress card', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 3, 'planning', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'done card 1', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'done card 1', 2, false);

---
--- add constraints
---

ALTER TABLE ONLY statuses
    ADD CONSTRAINT fk_statuses_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (status_id) REFERENCES statuses(id);
