export const ddl = `
DROP DATABASE if EXISTS game_of_SQL;
CREATE DATABASE IF NOT EXISTS game_of_SQL;
USE game_of_SQL;

																			/*CREACION DE TABLAS*/

CREATE TABLE reino(
	id INT PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL,
	religion VARCHAR(255) NOT NULL
);


CREATE TABLE fortaleza(
	id INT PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL,
	guarnicion INT NOT NULL,
	fortificacion DECIMAL(4,1) NOT NULL,
	id_reino INT NOT NULL,
	CONSTRAINT fk_fortaleza_reino FOREIGN KEY ( id_reino ) REFERENCES reino( id )
);


CREATE TABLE clan(
	id INT PRIMARY KEY,
	lider VARCHAR(255) NOT NULL,
	nombre VARCHAR(255) NOT NULL,
	hombres INT NOT NULL,
	agresividad DECIMAL(4,1),
	id_reino INT NOT NULL,
	id_clan_supremo INT,
	CONSTRAINT fk_clan_reino FOREIGN KEY ( id_reino ) REFERENCES reino( id ),
	CONSTRAINT fk_clan_clanSupremo FOREIGN KEY ( id_clan_supremo ) REFERENCES clan( id )
);


CREATE TABLE casa(
	id INT PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL,
	lema VARCHAR(255) NOT NULL,
	porcentaje_lealtad DECIMAL(4,1) NOT NULL,
	infanteria_ligera INT NOT NULL,
	infanteria_pesada INT NOT NULL,
	arqueros INT NOT NULL,
	caballeria INT NOT NULL,
	id_reino INT NOT NULL,
	CONSTRAINT fk_casa_reino FOREIGN KEY ( id_reino ) REFERENCES reino( id )
);


CREATE TABLE personaje(
	id INT PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL,
	estado VARCHAR(255) CHECK (estado IN ('vivo', 'muerto', 'prisionero')),
	habilidad VARCHAR(255) CHECK (habilidad IN ('marcial', 'diplomacia', 'estrategia', 'intriga')),
	id_casa INT NOT NULL,
	CONSTRAINT fk_personaje_casa FOREIGN KEY ( id_casa ) REFERENCES casa( id )
);


CREATE TABLE ejercito(
	id int PRIMARY KEY,
	organizacion DECIMAL(4,1) NOT NULL,
	infanteria_ligera INT NOT NULL DEFAULT 0,
	infanteria_pesada INT NOT NULL DEFAULT 0,
	arqueros INT NOT NULL DEFAULT 0,
	caballeria INT NOT NULL DEFAULT 0,
	maquinas_asedio INT NOT NULL,
	en_activo boolean NOT NULL,
	id_lider INT NOT NULL,
	CONSTRAINT fk_ejercito_personaje FOREIGN KEY ( id_lider ) REFERENCES personaje( id )
);


CREATE TABLE forma(
	id_ejercito INT,
	id_casa INT,
	CONSTRAINT pk_forma PRIMARY KEY (id_ejercito, id_casa),
	CONSTRAINT fk_forma_ejercito FOREIGN KEY ( id_ejercito ) REFERENCES ejercito( id ),
	CONSTRAINT fk_forma_casa FOREIGN KEY ( id_casa ) REFERENCES casa( id )
);


CREATE TABLE batalla(
	id INT PRIMARY KEY,
	fuerza_atacante INT NOT NULL DEFAULT 0,
	fuerza_defensor INT NOT NULL DEFAULT 0,
	nombre VARCHAR(255) NOT NULL,
	año INT NOT NULL,
	ubicacion VARCHAR(255) NOT NULL,
	resultado varchar(255) NOT NULL,
	id_ejercito_atacante INT NOT NULL,
	id_ejercito_defensor INT NOT NULL,
	CONSTRAINT fk_batalla_atacante FOREIGN KEY ( id_ejercito_atacante ) REFERENCES ejercito( id ),
   CONSTRAINT fk_batalla_defensor FOREIGN KEY ( id_ejercito_defensor ) REFERENCES ejercito( id )
);


CREATE TABLE batalla_campal(
	id_batalla INT PRIMARY KEY,
	CONSTRAINT fk_batallaCampal_batalla FOREIGN KEY ( id_batalla ) REFERENCES batalla( id )
);


CREATE TABLE emboscada(
	id_batalla INT PRIMARY KEY,
	bonus_atacante DECIMAL(4,1) NOT NULL,
	penalizacion_defensor DECIMAL(4,1) NOT NULL,
	CONSTRAINT fk_emboscada_batalla FOREIGN KEY ( id_batalla ) REFERENCES batalla( id )
);


CREATE TABLE asedio(
	id_batalla INT PRIMARY KEY,
	penalizacion_atacante DECIMAL(4,1) NOT NULL,
	bonus_defensor DECIMAL(4,1) NOT NULL,
	CONSTRAINT fk_asedio_batalla FOREIGN KEY ( id_batalla ) REFERENCES batalla( id )
);


CREATE TABLE objeto(
	id INT PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL,
	descripcion VARCHAR(500) NOT NULL,
	id_dueño INT NOT NULL,
	CONSTRAINT fk_objeto_personaje FOREIGN KEY ( id_dueño ) REFERENCES personaje( id )
);


CREATE TABLE trama(
	identificador INT PRIMARY KEY,
	descripcion VARCHAR(255) NOT NULL,
	porcentaje_progreso DECIMAL(4,1) NOT NULL,
	id_objetivo INT NOT NULL,
	CONSTRAINT fk_trama_personaje FOREIGN KEY ( id_objetivo ) REFERENCES personaje( id )
);


CREATE TABLE participa(
	id_personaje INT NOT NULL,
	id_trama INT NOT NULL,
	CONSTRAINT pk_participa PRIMARY KEY (id_personaje, id_trama),
	CONSTRAINT fk_participa_personaje FOREIGN KEY ( id_personaje ) REFERENCES personaje( id ),
	CONSTRAINT fk_participa_trama FOREIGN KEY ( id_trama ) REFERENCES trama( identificador )
);


CREATE TABLE complot_asesinato(
	id_trama INT PRIMARY KEY,
	CONSTRAINT fk_complotAsesinato_grupo FOREIGN KEY ( id_trama ) REFERENCES trama( identificador )
);


CREATE TABLE desercion(
	id_trama INT PRIMARY KEY,
	CONSTRAINT fk_desercion_grupo FOREIGN KEY ( id_trama ) REFERENCES trama( identificador )
);


CREATE TABLE amotinamiento(
	id_trama INT PRIMARY KEY,
	id_beneficiario INT NOT NULL,
	CONSTRAINT fk_amotinamiento_trama FOREIGN KEY ( id_trama ) REFERENCES trama( identificador ),
	CONSTRAINT fk_amotinamiento_personaje FOREIGN KEY ( id_beneficiario ) REFERENCES personaje( id )
);


																	/* CREACION DE TRIGGERS*/


-- Trigger para calcular las fuerzas de batalla después de insertar en la tabla 'batalla'
DELIMITER //
CREATE TRIGGER calcular_y_insertar_fuerzas_batalla
BEFORE INSERT ON batalla
FOR EACH ROW
BEGIN
    DECLARE fuerza_atacante INT;
    DECLARE fuerza_defensor INT;

    -- Obtener las fuerzas del atacante
    SELECT SUM(infanteria_ligera + infanteria_pesada + arqueros + caballeria + maquinas_asedio)
    INTO fuerza_atacante
    FROM ejercito
    WHERE id = NEW.id_ejercito_atacante;

    -- Obtener las fuerzas del defensor
    SELECT SUM(infanteria_ligera + infanteria_pesada + arqueros + caballeria + maquinas_asedio)
    INTO fuerza_defensor
    FROM ejercito
    WHERE id = NEW.id_ejercito_defensor;

    -- Insertar los datos en la tabla 'batalla' con las fuerzas calculadas
    SET NEW.fuerza_atacante = fuerza_atacante;
    SET NEW.fuerza_defensor = fuerza_defensor;
END;
//
DELIMITER ;


-- Trigger para calcular la suma de las tropas de todos los vasallos que forman un mismo ejército e introducir el resultado en los campos correspondientes de la tabla 'ejercito'
DELIMITER //
CREATE TRIGGER calcular_tropas_ejercito
AFTER INSERT ON forma
FOR EACH ROW
BEGIN
    DECLARE total_infanteria_ligera INT;
    DECLARE total_infanteria_pesada INT;
    DECLARE total_arqueros INT;
    DECLARE total_caballeria INT;

    -- Calculando la suma de tropas para el nuevo ejército
    SELECT SUM(c.infanteria_ligera), SUM(c.infanteria_pesada), SUM(c.arqueros), SUM(c.caballeria)
    INTO total_infanteria_ligera, total_infanteria_pesada, total_arqueros, total_caballeria
    FROM forma f
    JOIN casa c ON f.id_casa = c.id
    JOIN ejercito e ON f.id_ejercito = e.id
    WHERE e.en_activo = true AND f.id_ejercito = NEW.id_ejercito;

    -- Actualizando los campos de tropas en la tabla 'ejercito'
    UPDATE ejercito
    SET infanteria_ligera = total_infanteria_ligera,
        infanteria_pesada = total_infanteria_pesada,
        arqueros = total_arqueros,
        caballeria = total_caballeria
    WHERE id = NEW.id_ejercito;
END;
//
DELIMITER ;



																/*CREACION DE INSERCCIONES*/
INSERT INTO reino(id, nombre, religion) VALUES
	(1, "El Norte", "Antiguos Dioses"),
	(2, "Tierras de los Ríos", "Fe de los Siete"),
	(3, "Las Islas del Hierro", "Dios Ahogado"),
	(4, "El Valle", "Fe de los Siete"),
	(5, "Tierras del Oeste", "Fe de los Siete"),
	(6, "El Dominio", "Fe de los Siete"),
	(7, "Tierras de la Tormenta", "R'hllor, Señor de la luz"),
	(8, "Dorne", "Madre Rhoyne"),
	(9, "Tierras de la Corona", "Fe de los Siete"),
	(10, "Ciudades libres de Essos", "Dioses de Valyria");


INSERT INTO fortaleza(id, nombre, guarnicion, fortificacion, id_reino) VALUES
	(1, "Invernalia", 8000, 80.5, 1),
	(2, "Nido de Águilas", 3000, 98.0, 4),
	(3, "Roca Casterly", 6500, 92.5, 5),
	(4, "Bastion de Tormentas", 4200, 80.1, 7),
	(5, "Lanza del Sol", 3600, 70.3, 8),
	(6, "Altojardín", 5000, 70.7, 6),
	(7, "Pyke", 2500, 8.7, 3),
	(8, "Desembarco del Rey", 9000, 100, 9),
	(9, "Aguasdulces", 4000, 90.5, 2),
	(10, "Harrenhal", 2600, 20.7, 2);


INSERT INTO clan(id, lider, nombre, hombres, agresividad, id_reino, id_clan_supremo) VALUES
   (1, 'Shaga, hijo de Doulf', 'Grajos de piedra', 1800, 9.8, 4, NULL),
   (2, 'Ulf, hijo de Umar', 'Serpientes de leche', 540, 7.2, 4, 1),
   (3, 'Harron, hijo de Himndall', 'Hijos de la niebla', 398, 6.5, 4, 1),
   (4, 'Harrold, hijo de Harreld', 'Hermanos de la luna', 600, 8.4, 4, 1),
   (5, 'Chella, hija de Cheyk', 'Orejas negras', 1200, 9.1, 4, NULL),
   (6, 'Magnar, hijo de Mesmer', 'Hijos del árbol', 720, 8.2, 4, 5),
   (7, 'Timett, hijo de Timett', 'Hombres quemados', 1560, 9.7, 4, NULL),
   (8, 'Ulric, hijo de Ulric', 'Aulladores', 635, 7.6, 4, 7),
   (9, 'Harrold, hijo de Harald', 'Herreros rojos', 2100, 9.9, 4, 7),
   (10, 'Gerald, hijo de Gerosh', 'Perros pintados', 950, 8.7, 4, NULL),
	(11, 'Ulfred Hull', 'Hull', 250, 5.4, 1, NULL),
	(12, 'Torghen Flint', 'Flint', 320, 7.1, 1, 11),
   (13, 'Brandon Norrey', 'Norrey', 300, 6.6, 1, 11),
   (14, 'Harlan Burley', 'Burley', 280, 6.8, 1, 11),
   (15, 'Cedric Harclay', 'Harclay', 310, 7.2, 1, 11),
   (16, 'Lyndon Liddle', 'Liddle', 270, 5.1, 1, 11),
   (17, 'Karl Knot', 'Knot', 330, 7, 1, 11);


INSERT INTO casa(id, nombre, lema, porcentaje_lealtad, infanteria_ligera, infanteria_pesada, arqueros, caballeria, id_reino) VALUES
	(1, 'Stark', 'El invierno se acerca', 95, 2000, 900, 500, 900, 1),
	(2, 'Glover', 'Con puño de hierro', 90, 1000, 800, 200, 300, 1),
	(3, 'Ryswell', 'La persecución continúa', 88, 900, 750, 180, 270, 1),
	(4, 'Manderly', 'Fieles a nuestra palabra', 92, 1200, 1000, 250, 350, 1),
	(5, 'Dustin', 'Nuestra palabra aún vive', 85, 800, 650, 100, 150, 1),
	(6, 'Bolton', 'Nuestras hojas están afiladas', 88, 750, 600, 120, 160, 1),
	(7, 'Talhart', 'Orgullosos y libres', 90, 900, 800, 150, 200, 1),
	(8, 'Reed', 'Nosotros recordamos', 86, 700, 600, 80, 130, 1),
	(9, 'Umber', 'Nunca encadenados', 93, 1300, 1200, 180, 250, 1),
	(10, 'Cerwyn', 'Afilado y listo', 90, 1100, 1000, 200, 220, 1),
	(11, 'Karstark', 'El sol del invierno', 96, 1400, 1300, 250, 300, 1),
	(12, 'Hornwood', 'Justos en ira', 82, 600, 500, 50, 100, 1),
	(13, 'Mormont', 'Aquí estamos', 97, 1600, 1500, 300, 400, 1),
	(14, 'Tully', 'Familia, deber, honor', 98, 1700, 1000, 700, 300, 2),
	(15, 'Mallister', 'Por encima del resto', 94, 1100, 950, 200, 250, 2),
	(16, 'Mooton', 'Sabiduría y fuerza', 92, 1300, 1100, 250, 280, 2),
	(17, 'Darry', 'Nosotros sembramos, nosotros cosechamos', 85, 700, 600, 100, 150, 2),
	(18, 'Mudd', 'Descansar en paz', 83, 500, 450, 50, 100, 2),
	(19, 'Piper', 'Valientes y hermosos', 90, 1000, 900, 150, 200, 2),
	(20, 'Strong', 'Nuestra sol brilla brillante', 88, 550, 500, 50, 80, 2),
	(21, 'Vance', 'Sobre alas negras nos levantamos', 90, 800, 700, 100, 150, 2),
	(22, 'Bracken', 'Teme nuestro trueno', 93, 1300, 1200, 220, 280, 2),
	(23, 'Blackwood', 'Nosotros acudimos juntos', 90, 900, 850, 150, 180, 2),
	(24, 'Whent', 'Hasta el último', 95, 1500, 1400, 280, 350, 2),
	(25, 'Lothston', 'Elevándonos desde las sombras', 92, 1200, 1100, 200, 250, 2),
	(26, 'Frey', 'Nosotros estamos juntos', 94, 1800, 1700, 350, 450, 2),
	(27, 'Arryn', 'Tan alto como el honor', 90, 200, 200, 500, 3000, 3),
	(28, 'Waynwood', 'La furia arde brillantemente', 95, 1100, 1000, 200, 230, 3),
	(29, 'Royce', 'Nosotros recordamos', 98, 1400, 1300, 250, 300, 3),
	(30, 'Corbray', 'Hechos, no palabras', 88, 900, 850, 120, 180, 3),
	(31, 'Baelish', 'Conocimiento es poder', 90, 1000, 950, 150, 200, 3),
	(32, 'Belmore', 'Sabiduría y fuerza', 91, 1200, 1100, 200, 250, 3),
	(33, 'Grafton', 'Orgullo y prosperidad', 98, 1600, 1500, 300, 350, 3),
	(34, 'Hunter', 'Ninguna bestia es tan feroz', 94, 1200, 1100, 200, 280, 3),
	(35, 'Redfort', 'Tan fuerte como la piedra', 99, 1800, 1700, 400, 450, 3),
	(36, 'Templeton', 'Juntos en armas', 97, 1400, 1300, 250, 320, 3),
	(37, 'Greyjoy', 'Lo que está muerto no puede morir', 88, 4000, 200, 700, 0, 4),
	(38, 'Greyiron', 'Nosotros no sembramos', 82, 800, 100, 150, 80, 4),
	(39, 'Goodbrother', 'Hierro del hielo', 86, 850, 120, 160, 50, 4),
	(40, 'Wynch', 'Levántate, nunca caigas', 80, 800, 100, 150, 0, 4),
	(41, 'Botley', 'Olas que Gobiernan', 90, 950, 150, 200, 0, 4),
	(42, 'Drumm', 'Por mar o cielo', 92, 1150, 200, 250, 0, 4),
	(43, 'Harlaw', 'Cosechamos lo que sembramos', 89, 1050, 150, 200, 10, 4),
	(44, 'Haare', 'Feroz pero libre', 85, 850, 800, 100, 150, 4),
	(45, 'Blacktyde', 'Que se escriba', 91, 900, 850, 120, 160, 4),
	(46, 'Lannister', 'Oye mi rugido', 95, 2000, 1200, 500, 1150, 5),
	(47, 'Crakehall', 'Ninguno tan feroz', 94, 950, 900, 150, 180, 5),
	(48, 'Brax', 'Hogar y corazón', 92, 900, 850, 130, 170, 5),
	(49, 'Clegane', 'Una marca en llamas', 93, 1000, 950, 180, 200, 5),
	(50, 'Farman', 'El viento nuestro corcel', 90, 950, 900, 140, 180, 5),
	(51, 'Lefford', 'Desde las alturas', 91, 900, 850, 120, 160, 5),
	(52, 'Reyne', 'Un león todavía tiene garras', 96, 1000, 950, 200, 220, 5),
	(53, 'Westerling', 'Honor, no honores', 94, 950, 900, 150, 200, 5),
	(54, 'Payne', 'Igual a la tarea', 90, 900, 850, 130, 180, 5),
	(55, 'Marbrand', 'Ardiendo intensamente', 92, 950, 900, 160, 190, 5),
	(56, 'Lydden', 'Nosotros moramos abajo', 89, 900, 850, 140, 170, 5),
	(57, 'Presten', 'Muerte antes de la desgracia', 91, 950, 900, 150, 200, 5),
	(58, 'Tarbeck', 'Conócenos por la fe', 93, 1000, 950, 180, 220, 5),
	(59, 'Tyrell', 'Creciendo fuerte', 99, 4000, 2000, 800, 1600, 6),
	(60, 'Caswell', 'Ninguno tan obediente', 89.3, 900, 850, 120, 160, 6),
	(61, 'Florent', 'Bravos en batalla', 94.2, 1000, 950, 200, 250, 6),
	(62, 'Fossoway', 'Un sabor de gloria', 91.1, 950, 900, 150, 190, 6),
	(63, 'Gardener', 'Creciendo fuerte', 92.5, 1000, 950, 180, 210, 6),
	(64, 'Hightower', 'Nosotros iluminamos el camino', 90.8, 950, 900, 140, 180, 6),
	(65, 'Merryweather', 'He aquí nuestra generosidad', 92.1, 1000, 950, 160, 200, 6),
	(66, 'Mullendone', 'El amanecer ha llegado', 89.6, 950, 900, 130, 170, 6),
	(67, 'Oakheart', 'Nuestras raíces son profundas', 91.9, 1000, 950, 170, 200, 6),
	(68, 'Redwyne', 'Maduro para la victoria', 92.7, 1000, 950, 190, 220, 6),
	(69, 'Rowan', 'Los fuertes no se marchitan', 90.2, 950, 900,140, 180, 6),
	(70, 'Tarly', 'Primeros en batalla', 93.4, 1000, 950, 200, 230, 6),
	(71, 'Ashford', 'Nuestro sol brilla brillante', 91.3, 950, 900, 160, 190, 6),
	(72, 'Baratheon', 'Nuestra es la furia', 100, 1800, 200, 400, 700, 7),
	(73, 'Buckler', 'Orgullo y propósito', 90.7, 900, 850, 120, 170, 7),
	(74, 'Caron', 'Ninguna canción es tan dulce', 92.0, 950, 900, 150, 190, 7),
	(75, 'Connington', 'El rugido de un grifo', 90.5, 900, 850, 130, 180, 7),
	(76, 'Dondarrion', 'Nuestra Palabra es nuestro Vínculo', 92.2, 950, 900, 160, 200, 7),
	(77, 'Estermont', 'Descansa sobre nosotros', 90.8, 900, 850, 120, 170, 7),
	(78, 'Penrose', 'Establecer nuestras obras', 91.6, 950, 900, 150, 190, 7),
	(79, 'Seaworth', 'Un barco no puede navegar sin viento', 92.4, 1000, 950, 180, 210, 7),
	(80, 'Selmy', 'Nuestro acero es afilado', 91.2, 950, 900, 160, 190, 7),
	(81, 'Stadmon', 'Rayo de honor en la tormenta', 90.3, 900, 850, 130, 180, 7),
	(82, 'Swann', 'Fiel a la espada', 92.5, 1000, 950, 170, 200, 7),
	(83, 'Tarth', 'Aplausos atronadores', 93.1, 1000, 950, 190, 220, 7),
	(84, 'Martell', 'Nunca doblegado, nunca roto', 90.0, 1500, 500, 1200, 400, 8),
	(85, 'Dayne', 'Caído y renacido', 90.9, 900, 850, 120, 170, 8),
	(86, 'Fowler', 'Déjame volar', 91.7, 800, 700, 150, 200, 8),
	(87, 'Jordayne', 'Que quede escrito', 90.5, 750, 650, 120, 180, 8),
	(88, 'Qogyle', 'Yo sirvo', 92.2, 850, 750, 160, 220, 8),
	(89, 'Toland', 'Nosotros soportamos', 90.8, 750, 650, 130, 190, 8),
	(90, 'Uller', 'Come, bebe y sé feliz', 91.6, 800, 700, 150, 200, 8),
	(91, 'Vaith', 'La decisión es tuya', 90.7, 750, 650, 140, 190, 8),
	(92, 'Wyl', 'Lo he jurado', 92.0, 800, 700, 150, 200, 8),
	(93, 'Yronwood', 'Nosotros guardamos el camino', 91.4, 950, 850, 180, 250, 8),
	(94, 'Allyrion', 'Ningún enemigo pasará', 92.3, 850, 750, 170, 230, 8),
	(95, 'Blackmont', 'Así que acaba con nuestros enemigos', 91.2, 800, 700, 160, 220, 8),
	(96, 'Buckwell', 'Orgullo y propósito', 90.7, 750, 650, 120, 180, 9),
	(97, 'Follard', 'Ninguno tan sabio', 92.0, 800, 700, 150, 200, 9),
	(98, 'Stokeworth', 'Orgulloso de ser fiel', 90.5, 750, 650, 130, 190, 9),
	(99, 'Wendwater', 'Para todas las estaciones', 92.2, 800, 700, 160, 220, 9),
	(100, 'Targaryen', 'Fuego y sangre', 100, 0, 0, 0, 0, 10);


INSERT INTO personaje(id, nombre, estado, habilidad, id_casa) VALUES
   (1, "Robb Stark", "vivo", "estrategia", 1),
   (2, "Tywin Lannister", "vivo", "estrategia", 46),
   (3, "Jaime Lannister", "vivo", "marcial", 46),
   (4, "Gregor 'La Montaña' Clegane", "vivo", "marcial", 49),
   (5, "Hoster Tully", "vivo", "diplomacia", 14),
   (6, "Rickard Karstark", "vivo", "marcial", 11),
   (7, "Jon 'El Gran' Umber", "vivo", "marcial", 9),
   (8, "Aegon Targaryen", "vivo", "estrategia", 100),
   (9, "Roose Bolton", "vivo", "intriga", 6),
   (10, "Theon Greyjoy", "vivo", "marcial", 37),
   (11, "Balon Greyjoy", "vivo", "intriga", 37),
   (12, "Lysa Arryn", "vivo", "diplomacia", 27),
   (13, "Renly Baratheon", "vivo", "diplomacia", 72),
   (14, "Stannis Baratheon", "vivo", "estrategia", 72),
   (15, "Robert Baratheon", "muerto", "marcial", 72),
	(16, "Jon Connington", "muerto", "marcial", 75),
   (17, "Ned Stark", "prisionero", "diplomacia", 1),
   (18, "Oberyn Martell", "vivo", "intriga", 84),
   (19, "Rhaegar Targaryen", "muerto", "diplomacia", 100),
   (20, "Mace Tyrell", "vivo", "diplomacia", 59),
   (21, "Medger Cerwyn", "vivo", "estrategia", 10),
   (22, "Brynden 'El Pez Negro' Tully", "vivo", "estrategia", 14),
   (23, "Daenerys Targaryen", "vivo", "diplomacia", 100),
   (24, "Catellyn Tully", "vivo", "diplomacia", 14),
   (25, "Tyrion Lannister", "vivo", "estrategia", 5),
   (26, "Joffrey Baratheon", "vivo", "intriga", 72),
   (27, "Edric Redfort", "vivo", "intriga", 35),
   (28, "Ysilla Royce", "vivo", "diplomacia", 29),
   (29, "Jasper Templeton", "vivo", "diplomacia", 36),
   (30, "Lyn Corbray", "vivo", "marcial", 30),
	(32, "Isolde Talhart", "vivo", "estrategia", 7),
	(33, "Harlan Ryswell", "vivo", "intriga", 3),
	(34, "Gideon Dustin", "vivo", "marcial", 5);


INSERT INTO objeto (id, nombre, descripcion, id_dueño) VALUES
	(1, 'Estrangulador', 'El Estrangulador es un veneno. Es una sustancia muy rara, de aspecto similar a cristales del
	tamaño de semillas, de color púrpura. El veneno hace que la víctima se ahogue. Quienes tienen el conocimiento para
	fabricar el veneno son los alquimistas de Lys, los Hombres sin Rostro de Braavos y los Maestres de la Ciudadela.', 2),
	(2, 'Daga de vidriagón', 'Una daga echa de un vidrio volcánico también conocido como obsidiana. Fue utilizada por el
	asesino que intentó matar a Brandon Stark mientras dormía.', 1),
	(3, 'Fuego Valyrio', 'El fuego valyrio es un líquido inflamable y volátil que puede arder por mucho tiempo,
	quemando todo a su paso hasta que se consume por completo, imposible de apagar y pudiendo arder sobre el agua.', 26),
	(4, 'Anillo de oro de la casa Lannister', 'Un anillo hecho del material más abundante en Roca Casterly y entre los Lannister: el oro', 3);


INSERT INTO ejercito(id, organizacion, infanteria_ligera, infanteria_pesada, arqueros, caballeria, maquinas_asedio, en_activo, id_lider) VALUES
   (7777, 83, 6500, 2000, 1800, 2100, 0, 0, 15),
   (8888, 57, 2000, 800, 600, 300, 0, 0, 16),
   (1122, 90, 9000, 1900, 3700, 2900, 0, 0, 17),
   (1155, 32, 8000, 4100, 3000, 4150, 0, 0, 19);


INSERT INTO ejercito(id, organizacion, maquinas_asedio, en_activo, id_lider) VALUES
   (1111, 57, 0, 1, 11),
   (2222, 77, 0, 1, 12),
   (3333, 85, 5, 1, 3),
   (4444, 92, 10, 1, 2),
   (6666, 67, 0, 1, 14),
   (9999, 70, 0, 1, 1),
   (1133, 65, 0, 1, 5),
   (1144, 60, 0, 1, 18),
   (1166, 70, 0, 1, 20);


INSERT INTO forma(id_ejercito, id_casa) VALUES
   (1111, 37),
   (1111, 38),
   (1111, 39),
   (1111, 40),
   (1111, 41),
   (1111, 42),
   (1111, 43),
   (1111, 44),
   (1111, 45),
   (9999, 1),
   (9999, 2),
   (9999, 3),
   (9999, 4),
   (9999, 5),
   (9999, 6),
   (9999, 7),
   (9999, 8),
   (9999, 9),
   (9999, 10),
   (9999, 11),
   (9999, 12),
   (9999, 13),
   (1133, 14),
   (1133, 15),
   (1133, 16),
   (1133, 17),
   (1133, 18),
   (1133, 19),
   (1133, 20),
   (1133, 21),
   (1133, 22),
   (1133, 23),
   (1133, 24),
   (1133, 25),
   (1133, 26),
   (1144, 84),
   (1144, 85),
   (1144, 86),
   (1144, 87),
   (1144, 88),
   (1144, 89),
   (1144, 90),
   (1144, 91),
   (1144, 92),
   (1144, 93),
   (1144, 94),
   (1144, 95),
   (1166, 59),
   (1166, 60),
   (1166, 61),
   (1166, 62),
   (1166, 63),
   (1166, 64),
   (1166, 65),
   (1166, 66),
   (1166, 67),
   (1166, 68),
   (1166, 69),
   (1166, 70),
   (1166, 71),
   (6666, 72),
   (6666, 73),
   (6666, 74),
   (6666, 75),
   (6666, 76),
   (6666, 77),
   (6666, 78),
   (6666, 79),
   (6666, 80),
   (6666, 81),
   (6666, 82),
   (6666, 83),
   (4444, 46),
   (4444, 47),
   (4444, 48),
   (4444, 49),
   (4444, 50),
   (3333, 51),
   (3333, 52),
   (3333, 53),
   (3333, 54),
   (3333, 55),
   (3333, 56),
   (3333, 57),
   (3333, 58),
   (2222, 27),
   (2222, 28),
   (2222, 29),
   (2222, 30),
   (2222, 31),
   (2222, 32),
   (2222, 33),
   (2222, 34),
   (2222, 35),
   (2222, 36),
   (3333, 96),
   (3333, 97),
   (3333, 98),
   (3333, 99);


INSERT INTO batalla(id, nombre, año, ubicacion, resultado, id_ejercito_atacante, id_ejercito_defensor) VALUES
	(1, "Batalla de Gulltown", 282, "Gulltown", "Victoria del atacante", 7777, 1155),
	(2, "Batalla de Vado Ceniza", 282, "Ashford", "Resultado indeciso", 7777, 1166),
	(3, "Batalla del Tridente", 283, "Las Tierras de los Rios, cerca de Harrenhal", "Victoria del atacante", 7777, 1155),
	(4, "Batalla de las Campanas", 283, "Septo de Piedra", "Victoria del defensor", 8888, 7777),
	(5, "Asedio de Bastión de Tormentas", 282, "Bastión de Tormentas", "Victoria del defensor", 1166, 6666),
	(6, "Asedio de Pyke", 289, "Pyke", "Victoria del atacante", 1122, 1111);


INSERT INTO batalla_campal(id_batalla) VALUES
	(1),
	(2),
	(3),
	(4);


INSERT INTO asedio(id_batalla, penalizacion_atacante, bonus_defensor) VALUES
	(5, 12, 6),
	(6, 23, 12);


INSERT INTO trama(identificador, descripcion, porcentaje_progreso, id_objetivo) VALUES
   (1, 'Asesinar a Robb Stark y a todos sus vasallos leales y nombrar a Roose Bolton como Guardián del Norte', 40, 1),
   (2, 'Eliminar a Joffrey Baratheon para que Stannis Baratheon se autoproclame Señor de los Siete Reinos', 67, 26),
   (3, 'Con la ayuda de algunas casas de Poniente, volver a instaurar la dinastía Targaryen bajo el nombre de Aegon V Targaryen', 15, 26),
   (4, 'Proclamarse Rey de las Islas del Hierro y recuperar los antiguos territorios de los Hijos del Hierro en el Norte', 23, 1),
   (5, 'Sustituir a Lysa Arryn y a su hijo enfermizo por un noble de Los Dedos', 48, 12),
	(6, 'Desertar del ejército de Robb Stark y unirse a las fuerzas de Tywin Lannister', 67, 1);


INSERT INTO participa(id_personaje, id_trama) VALUES
   (2, 1),
   (3, 1),
   (9, 1),
   (10, 4),
   (11, 4),
   (14, 2),
   (18, 3),
   (26, 1),
   (23, 3),
   (8, 3),
   (27, 5),
   (28, 5),
   (29, 5),
   (30, 5),
	(9, 6),
	(6, 6),
	(32, 6),
	(33, 6),
	(34, 6);


INSERT INTO complot_asesinato(id_trama) VALUES
	(1),
	(2),
	(3),
	(4),
	(5);


INSERT INTO amotinamiento(id_trama, id_beneficiario) VALUES
	(6, 2);
`
