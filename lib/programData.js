export const PROGRAM_DATA = {
  "salud-mental": {
    id: "salud-mental",
    code: "FEPV-PRO-001",
    title: "Mentes para la Vida",
    subtitle: "Programa comunitario de bienestar emocional y salud mental",
    category: "Salud Mental",
    icon: "🧠",
    status: "En desarrollo",
    statusColor: "text-blue-500 bg-blue-50 border-blue-200",
    location: "Agustín Codazzi, Cesar",
    population: "Niñas, niños, adolescentes, jóvenes, familias, docentes, cuidadores y líderes comunitarios.",
    challenge: "El impacto emocional derivado de las brechas sociales y de las secuelas del conflicto armado en el Cesar se manifiesta en altos índices de ansiedad, estrés y escaso acompañamiento psicosocial en los entornos vulnerables. La carencia de educación emocional en hogares y colegios dificulta que la niñez y la juventud cuenten con herramientas efectivas de resiliencia y autocuidado.",
    response: "Mentes para la Vida promueve el desarrollo de habilidades socioemocionales desde la prevención comunitaria y la pedagogía social. Establecemos círculos de escucha, escuelas de padres y formación en primeros auxilios psicológicos para empoderar a la comunidad como primera red de soporte afectivo.",
    important: "Aclaración institucional: Las actividades de promoción y educación no sustituyen la atención médica, psiquiátrica o psicológica especializada cuando esta sea requerida por el participante.",
    components: [
      { title: "Educación emocional", desc: "Talleres prácticos de reconocimiento, validación y gestión asertiva de emociones." },
      { title: "Habilidades para la vida", desc: "Formación en comunicación empática, resolución pacífica de conflictos, toma de decisiones y fortalecimiento de la autoestima." },
      { title: "Familias Protectoras", desc: "Herramientas de acompañamiento afectivo y pautas de crianza libre de violencia para padres y cuidadores." },
      { title: "Entornos educativos", desc: "Actividades de promoción del bienestar emocional articuladas con docentes y directivos docentes." },
      { title: "Redes comunitarias", desc: "Identificación de factores protectores locales y socialización de rutas de atención y orientación institucional." }
    ],
    indicators: [
      "Número de personas participantes certificadas.",
      "Talleres comunitarios realizados en sectores vulnerables.",
      "Instituciones educativas y comunitarias vinculadas.",
      "Medición de variación de conocimientos (evaluación antes/después del ciclo)."
    ],
    allies: "Profesionales de psicología voluntarios, instituciones de salud, organizaciones sociales locales y entes territoriales.",
    ods: [3, 4, 10]
  },
  "familias": {
    id: "familias",
    code: "FEPV-PRO-002",
    title: "Familias que Transforman",
    subtitle: "Escuela comunitaria de fortalecimiento familiar",
    category: "Familias",
    icon: "👨‍👩‍👧‍👦",
    status: "En búsqueda de financiación",
    statusColor: "text-amber-500 bg-amber-50 border-amber-200",
    location: "Agustín Codazzi, Cesar",
    population: "Familias, padres, madres, cuidadores y líderes del hogar.",
    challenge: "Las presiones económicas, la precariedad de oportunidades y la persistencia de pautas de crianza autoritarias o de castigo físico debilitan el rol protector de la familia. Esto incrementa el riesgo de violencias domésticas y afecta el desarrollo afectivo y cognitivo de niños y adolescentes en el municipio.",
    response: "Buscamos fortalecer las capacidades internas de las familias mediante la promoción de la crianza respetuosa, la corresponsabilidad de género en las tareas de cuidado y la comunicación no violenta, posicionando al hogar como un espacio seguro de desarrollo integral.",
    components: [
      { title: "Crianza positiva", desc: "Modelos de disciplina basados en el respeto mutuo, el amor y la comprensión del desarrollo infantil." },
      { title: "Comunicación familiar", desc: "Prácticas de escucha activa y diálogo empático entre padres, madres e hijos." },
      { title: "Resolución de conflictos", desc: "Metodologías pacíficas y de mediación familiar para abordar tensiones cotidianas." },
      { title: "Prevención de violencias", desc: "Sensibilización y herramientas para identificar y erradicar cualquier tipo de maltrato o abuso intrafamiliar." },
      { title: "Corresponsabilidad", desc: "Distribución equitativa y solidaria de las tareas domésticas y de cuidado integral." },
      { title: "Redes de apoyo", desc: "Intercambio solidario entre familias vecinas para tejer alianzas de cuidado y soporte comunitario." }
    ],
    indicators: [
      "Familias participantes vinculadas en las escuelas de formación.",
      "Talleres presenciales y círculos de conversación ejecutados.",
      "Familias que culminan con éxito el ciclo de acompañamiento y reciben certificación."
    ],
    allies: "Líderes de Juntas de Acción Comunal, comisaría de familia, organizaciones defensoras de derechos humanos.",
    ods: [5, 16]
  },
  "educacion": {
    id: "educacion",
    code: "FEPV-PRO-003",
    title: "Aprender para Transformar",
    subtitle: "Comunidades de aprendizaje, inclusión y liderazgo educativo (Proyecto Insignia)",
    category: "Educación",
    icon: "🎓",
    status: "En ejecución",
    statusColor: "text-emerald-500 bg-emerald-50 border-emerald-200",
    location: "Agustín Codazzi, Cesar (Sábados de 9:00 a.m. a 11:00 a.m.)",
    population: "Niñas, niños y adolescentes en edad escolar.",
    challenge: "El sistema educativo regular a menudo prioriza la memorización pasiva, lo que reduce el interés del estudiante y desaprovecha su liderazgo. Esto, sumado a las limitaciones en conectividad y recursos locales, frena las capacidades de investigación autónoma e innovación de los jóvenes en Agustín Codazzi.",
    response: "Implementamos un piloto presencial de comunidades de aprendizaje donde el niño no es solo un receptor, sino el protagonista. Bajo la metodología 'Yo También Enseño', los participantes investigan temas de su agrado y los enseñan colectivamente, potenciando su oratoria y autoconfianza.",
    components: [
      { title: "Yo También Enseño", desc: "Estrategia pedagógica donde los participantes preparan y exponen temas específicos ante sus compañeros." },
      { title: "Áreas Temáticas Diversas", desc: "Espacios de investigación en ciencia, medio ambiente, astronomía, inteligencia artificial, música, cultura y deportes." },
      { title: "Jornada del Sábado", desc: "Sesiones semanales de 9:00 a.m. a 11:00 a.m. enfocadas en aprendizaje cooperativo y lúdica educativa." },
      { title: "Liderazgo y Oratoria", desc: "Formación en expresión verbal, estructuración de discursos y debate constructivo." }
    ],
    indicators: [
      "Niñas, niños y adolescentes registrados con asistencia activa.",
      "Clases preparadas y dictadas por los propios participantes ('Yo También Enseño').",
      "Talleres técnicos de ciencia, astronomía o arte ejecutados de forma piloto."
    ],
    allies: "Colegios oficiales locales, docentes voluntarios, SENA y colectivos juveniles de ciencia.",
    ods: [4, 8]
  },
  "inclusion-derechos": {
    id: "inclusion-derechos",
    code: "FEPV-PRO-004",
    title: "Todos Somos Parte",
    subtitle: "Escuela comunitaria de inclusión, derechos y participación",
    category: "Inclusión & Derechos",
    icon: "⚖️",
    status: "Próximamente",
    statusColor: "text-gray-500 bg-gray-50 border-gray-200",
    location: "Agustín Codazzi, Cesar",
    population: "Personas con discapacidad, familias, cuidadores, docentes y organizaciones comunitarias.",
    challenge: "Las personas en situación de discapacidad o vulnerabilidad social en nuestra región a menudo enfrentan una severa falta de adaptabilidad en infraestructuras físicas y pedagógicas, discriminación y exclusión. Paralelamente, los cuidadores directos padecen de un agotamiento crónico sin redes de apoyo institucional.",
    response: "La escuela busca sensibilizar a la comunidad, eliminar prejuicios y entregar herramientas a docentes y familias para adaptar los espacios de aprendizaje. Promueve activamente el reconocimiento de los derechos de las poblaciones vulnerables y la participación comunitaria.",
    components: [
      { title: "Educación inclusiva", desc: "Talleres y metodologías para adaptar espacios de enseñanza y facilitar la asimilación del aprendizaje." },
      { title: "Derechos humanos", desc: "Sensibilización sobre los derechos constitucionales, mecanismos de protección y rutas legales de exigibilidad." },
      { title: "Fortalecimiento al cuidador", desc: "Sesiones de apoyo psicológico y autocuidado para quienes dedican su vida al cuidado de personas dependientes." },
      { title: "Erradicación del estigma", desc: "Campañas de comunicación comunitaria y foros educativos para combatir la discriminación por discapacidad u origen." }
    ],
    indicators: [
      "Docentes y líderes comunitarios capacitados en adaptaciones pedagógicas.",
      "Cuidadores de personas con discapacidad que acceden a programas de bienestar.",
      "Campañas presenciales de erradicación del prejuicio social realizadas."
    ],
    allies: "Asociaciones de personas con discapacidad, defensores de DD.HH. y dependencias locales de bienestar.",
    ods: [10, 16]
  },
  "medio-ambiente": {
    id: "medio-ambiente",
    code: "FEPV-PRO-005",
    title: "Codazzi Resiliente",
    subtitle: "Sistema comunitario de adaptación frente al calor extremo y el estrés hídrico (Proyecto Insignia)",
    category: "Medio Ambiente",
    icon: "🌱",
    status: "En desarrollo",
    statusColor: "text-blue-500 bg-blue-50 border-blue-200",
    location: "Agustín Codazzi, Cesar (Zonas urbanas críticas y Serranía del Perijá)",
    population: "Comunidades vulnerables, jóvenes de ciencia ciudadana, instituciones educativas y agricultores familiares.",
    challenge: "El cambio climático somete a Codazzi a olas de calor extremo que superan habitualmente los 40°C y a periodos prolongados de sequía. La escasez de agua dulce y la degradación forestal urbana incrementan las islas de calor y comprometen la producción de alimentos y la salud de los habitantes.",
    response: "Construimos una red comunitaria para monitorear el microclima mediante tecnologías de bajo costo y proponer Soluciones Basadas en la Naturaleza (SBN) como reforestación de cuencas, creación de corredores de sombra urbana y almacenamiento seguro de agua lluvia. *Nota: Proyecto en etapa de diseño preliminar para postular a convocatorias como AFCIA.*",
    components: [
      { title: "Seguridad hídrica", desc: "Capacitación en uso eficiente de recursos y sistemas autónomos de captación y almacenamiento de agua lluvia." },
      { title: "Adaptación al calor", desc: "Mapeo de islas térmicas urbanas y diseño de espacios de sombra con coberturas vegetales nativas." },
      { title: "Ciencia ciudadana", desc: "Jóvenes miden variables locales de temperatura y humedad con sensores accesibles recopilando datos ambientales." },
      { title: "Guardianes Climáticos", desc: "Semillero pedagógico ambiental para involucrar a niños y adolescentes en conservación ecológica y reciclaje." },
      { title: "Restauración natural", desc: "Siembra planificada de árboles nativos tolerantes a la sequía y creación de huertas orgánicas comunitarias." }
    ],
    indicators: [
      "Árboles nativos sembrados y apadrinados por la comunidad.",
      "Estaciones meteorológicas de bajo costo construidas e instaladas.",
      "Jóvenes formados como 'Guardianes Climáticos' e investigadores ambientales."
    ],
    allies: "Corpocesar, cooperativas de agricultores locales, semilleros universitarios e instituciones ambientales.",
    ods: [13, 15, 6]
  },
  "bienestar-animal": {
    id: "bienestar-animal",
    code: "FEPV-PRO-006",
    title: "Huellas que Transforman",
    subtitle: "Programa comunitario de protección y bienestar animal",
    category: "Bienestar Animal",
    icon: "🐾",
    status: "En búsqueda de financiación",
    statusColor: "text-amber-500 bg-amber-50 border-amber-200",
    location: "Agustín Codazzi, Cesar",
    population: "Familias con mascotas en sectores vulnerables, animales sin hogar y veterinarios aliados.",
    challenge: "El abandono de animales de compañía en calles, sumado a la falta de programas preventivos de control natal (esterilización), representa un problema ético y un foco de propagación de enfermedades de salud pública zoológica en los barrios periféricos del municipio.",
    response: "Fomentamos la empatía y la protección de los seres sintientes mediante procesos educativos sobre tenencia responsable, ferias de adopción y brigadas comunitarias de control sanitario en alianza con clínicas y profesionales autorizados.",
    components: [
      { title: "Tenencia responsable", desc: "Educación a familias sobre nutrición, sanidad y el no maltrato a las mascotas." },
      { title: "Jornadas comunitarias", desc: "Desparasitación y vacunación básica preventiva dirigida a mascotas de familias de escasos recursos." },
      { title: "Prevención del abandono", desc: "Sensibilización y coordinación de campañas de esterilización articuladas con clínicas habilitadas." },
      { title: "Adopciones y hogares de paso", desc: "Red de protección comunitaria para el rescate, socialización e inserción de animales en hogares responsables." }
    ],
    indicators: [
      "Animales domésticos atendidos en brigadas básicas de desparasitación.",
      "Familias y estudiantes formados en el respeto y cuidado animal.",
      "Adopciones responsables coordinadas y certificadas."
    ],
    allies: "Veterinarios locales debidamente certificados, refugios comunitarios de paso y organizaciones de rescatistas.",
    ods: [15, 3]
  },
  "emprendimiento": {
    id: "emprendimiento",
    code: "FEPV-PRO-007",
    title: "Emprende para la Vida",
    subtitle: "Escuela de emprendimiento, empleabilidad y oportunidades (Proyecto Insignia)",
    category: "Emprendimiento",
    icon: "💼",
    status: "En ejecución",
    statusColor: "text-emerald-500 bg-emerald-50 border-emerald-200",
    location: "Agustín Codazzi, Cesar",
    population: "Mujeres cabeza de hogar, jóvenes en búsqueda de su primer empleo y microemprendedores del Cesar.",
    challenge: "La informalidad laboral en la región supera el 70%, limitando las oportunidades de crecimiento económico para jóvenes recién graduados y mujeres. A menudo hay vacantes y ofertas de capacitación que no llegan a la comunidad debido a brechas digitales y de articulación.",
    response: "Fortalecemos la empleabilidad preparando a la comunidad para procesos de selección y entregando habilidades en marketing y finanzas. Integramos de manera institucional el 'Centro Digital de Oportunidades FEPV' a través de WhatsApp para conectar la oferta real con los postulantes.",
    components: [
      { title: "Formación emprendedora", desc: "Talleres de estructuración de modelos de negocio, marketing digital y educación financiera." },
      { title: "Habilidades ocupacionales", desc: "Preparación de currículums de impacto, simulacros de entrevistas y desarrollo de competencias laborales blandas." },
      { title: "Centro Digital de Oportunidades", desc: "Canal institucional de WhatsApp diseñado para difundir de forma centralizada ofertas de empleo, becas, talleres y cursos." }
    ],
    indicators: [
      "Personas capacitadas y certificadas en habilidades digitales o emprendimiento.",
      "Usuarios registrados y activos dentro del canal digital de oportunidades de WhatsApp.",
      "Emprendedores asesorados que consolidan su modelo productivo."
    ],
    allies: "SENA, Cámara de Comercio de Valledupar, asociaciones de comercio y empresas aliadas.",
    ods: [8, 5]
  },
  "cultura-deporte": {
    id: "cultura-deporte",
    code: "FEPV-PRO-008",
    title: "Talentos para la Vida",
    subtitle: "Cultura, recreación, deporte y aprovechamiento del tiempo libre",
    category: "Cultura y Deporte",
    icon: "⚽",
    status: "Próximamente",
    statusColor: "text-gray-500 bg-gray-50 border-gray-200",
    location: "Agustín Codazzi, Cesar",
    population: "Niñas, niños, adolescentes y jóvenes de sectores vulnerables.",
    challenge: "La carencia de espacios recreativos de calidad y de actividades artísticas estructuradas deja a los jóvenes de Agustín Codazzi expuestos en su tiempo libre a riesgos sociales latentes como la delincuencia juvenil o el consumo de sustancias psicoactivas.",
    response: "Ofrecemos alternativas sanas de esparcimiento que estimulan el juego limpio, el compañerismo y la creatividad. Creamos semilleros musicales de acordeón y guitarra, proyecciones de cine comunitario al aire libre y torneos recreativos interbarriales de fútbol de salón.",
    components: [
      { title: "Deporte y valores", desc: "Torneos y escuelas deportivas de fútbol de salón que fomentan la convivencia pacífica y la salud." },
      { title: "Semilleros artísticos", desc: "Clases de iniciación musical (guitarra, acordeón y percusión) y danzas tradicionales para preservar el folclor." },
      { title: "Cine al barrio", desc: "Proyecciones colectivas de películas con mensajes de prevención social orientadas a integrar a las familias." }
    ],
    indicators: [
      "Jóvenes y niños activos en las escuelas de música y deporte.",
      "Encuentros deportivos y proyecciones de cine comunitario completados.",
      "Familias asistentes a festivales e integraciones culturales."
    ],
    allies: "Casas de cultura locales, entrenadores y monitores deportivos comunales y fundaciones aliadas de arte.",
    ods: [3, 11]
  }
};
