export const informationEr = [
  {
    title: 'Reino (id, nombre, religion):',
    description: 'Cada registro en esta tabla representa un reino con un identificador único, nombre y religión.'
  },
  {
    title: 'Fortaleza (id, nombre, guarnicion, fortificacion, id_reino):',
    description: 'Esta tabla almacena información sobre las fortalezas, con detalles como su nombre, tamaño de guarnición, nivel de fortificación y la clave externa que vincula cada fortaleza a un reino específico.'
  },
  {
    title: 'Clan (id, lider, nombre, hombres, agresividad, id_reino, id_clan_supremo):',
    description: 'Describe los clanes dentro de un reino, con detalles sobre su líder, nombre, número de miembros, agresividad y su afiliación al reino y al clan supremo si lo tienen.'
  },
  {
    title: 'Casa (id, nombre, lema, porcentaje_lealtad, infanteria_ligera, infanteria_pesada, arqueros, caballeria, id_reino):',
    description: 'Define las casas nobles dentro de un reino, con detalles sobre su nombre, lema, nivel de lealtad, y la composición de sus fuerzas militares.'
  },
  {
    title: 'Personaje (id, nombre, estado, habilidad, id_casa):',
    description: 'Contiene información sobre los personajes del mundo, incluyendo su estado (vivo, muerto o prisionero), habilidades y la casa noble a la que pertenecen.'
  },
  {
    title: 'Ejército (id, organizacion, infanteria_ligera, infanteria_pesada, arqueros, caballeria, maquinas_asedio, en_activo, id_lider):',
    description: 'Esta tabla describe los ejércitos presentes en el mundo, con detalles sobre su organización, composición y liderazgo.'
  },
  {
    title: 'Forma (id_ejercito, id_casa):',
    description: 'Establece la relación entre los ejércitos y las casas nobles a las que están afiliados.'
  },
  {
    title: 'Batalla (id, fuerza_atacante, fuerza_defensor, nombre, año, ubicacion, resultado, id_ejercito_atacante, id_ejercito_defensor):',
    description: 'Registra información sobre las batallas que tienen lugar, incluyendo las fuerzas involucradas, ubicación y resultado.'
  },
  {
    title: 'Objeto (id, nombre, descripcion, id_dueño):',
    description: 'Almacena información sobre objetos que pueden ser poseídos por los personajes.'
  },
  {
    title: 'Trama (identificador, descripcion, porcentaje_progreso, id_objetivo):',
    description: 'Define tramas que ocurren en el mundo, con detalles sobre su progreso y objetivos.'
  },
  {
    title: 'Participa (id_personaje, id_trama):',
    description: 'Establece la relación entre los personajes y las tramas en las que participan.'
  },
  {
    title: 'Complot_Asesinato (id_trama):',
    description: 'Representa un tipo específico de trama que involucra deserción de fuerzas.'
  },
  {
    title: 'Desercion (id_trama):',
    description: 'Representa un tipo específico de trama que involucra un amotinamiento con un beneficiario específico.'
  },
  {
    title: 'Amotinamiento (id_trama, id_beneficiario):',
    description: 'Representa un tipo específico de trama que involucra un amotinamiento con un beneficiario específico.'
  }
]
