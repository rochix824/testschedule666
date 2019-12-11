DROP DATABASE IF EXISTS final_adm;
CREATE DATABASE final_adm;
USE final_adm;

CREATE TABLE usuarios(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(60) NOT NULL,
    password VARCHAR(100) NOT NULL
)ENGINE=innoDB;

CREATE TABLE examenes(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    materia VARCHAR(255) NOT NULL,
    dia DATE NOT NULL,
    hora TIME NOT NULL    
)ENGINE=innoDB;

CREATE TABLE notas(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    materia VARCHAR(255),
    nota INT(2) NOT NULL
)ENGINE=innoDB;

CREATE TABLE horarios(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    materia VARCHAR(255) NOT NULL,
    dia VARCHAR(255) NOT NULL,
    hora TIME NOT NULL
)ENGINE=innoDB;

INSERT INTO usuarios (username, password) VALUES ('admin@admin','$2y$10$/q.Iwk9xiOAk33sJU8hJaet2CHP3Lwi7pC2yBcu0xka/uC/pdjFvG');
INSERT INTO usuarios (username, password) VALUES ('pepa@mail.com','$2y$10$/q.Iwk9xiOAk33sJU8hJaet2CHP3Lwi7pC2yBcu0xka/uC/pdjFvG');
INSERT INTO usuarios (username, password) VALUES ('ron@mail.com','$2y$10$/q.Iwk9xiOAk33sJU8hJaet2CHP3Lwi7pC2yBcu0xka/uC/pdjFvG');
INSERT INTO usuarios (username, password) VALUES ('luli@mail.com','$2y$10$/q.Iwk9xiOAk33sJU8hJaet2CHP3Lwi7pC2yBcu0xka/uC/pdjFvG');

INSERT INTO examenes (materia, dia, hora) VALUES('Biologia', '2018-12-15', '19:45:00');
INSERT INTO examenes (materia, dia, hora) VALUES('Matematica', '2018-12-16', '21:00:00');
INSERT INTO examenes (materia, dia, hora) VALUES('Programacion', '2018-12-17', '19:45:00');

INSERT INTO notas (materia, nota) VALUES('Biologia', 9);
INSERT INTO notas (materia, nota) VALUES('Matematica ', 10);
INSERT INTO notas (materia, nota) VALUES('Programacion', 7);
INSERT INTO notas (materia, nota) VALUES('ADM', 10);

INSERT INTO horarios (materia, dia, hora) VALUES('Biologia', 'Lunes', '19:45:00');
INSERT INTO horarios (materia, dia, hora) VALUES('Matematica', 'Miercoles', '21:00:00');
INSERT INTO horarios (materia, dia, hora) VALUES('Programacion', 'Viernes', '19:45:00');
INSERT INTO horarios (materia, dia, hora) VALUES('ADM', 'Viernes', '21:00:00');

