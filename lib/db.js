import fs from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

// Helper to ensure the directory and file exist with initial mock data
function ensureDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      contactos: [],
      beneficiarios: [],
      voluntarios: [],
      convocatorias: [
        {
          id: "FEPV-CONV-001",
          category: "cursos",
          title: "Curso de Acompañamiento Psicosocial y Salud Mental",
          status: "ABIERTA",
          location: "Agustín Codazzi",
          deadline: "2026-08-15",
          target: "Líderes comunitarios, cuidadores, docentes y público general",
          schedule: "Sábados de 8:00 AM a 12:00 PM (Presencial)",
          desc: "Espacio formativo diseñado para brindar herramientas básicas de primeros auxilios psicológicos y redes de apoyo emocional en los hogares y comunidades.",
          requirements: [
            "Residir en el municipio de Agustín Codazzi",
            "Disponibilidad de tiempo para asistir a las sesiones presenciales",
            "Interés por el liderazgo social y el bienestar emocional"
          ],
          documents: ["Fotocopia del documento de identidad", "Formulario de registro firmado"]
        },
        {
          id: "FEPV-CONV-002",
          category: "voluntariado",
          title: "Campaña Ambiental: Sembrando Encuentros Verdes",
          status: "ABIERTA",
          location: "Vereda Las Flores (Codazzi)",
          deadline: "2026-08-20",
          target: "Jóvenes y adultos con vocación ambiental",
          schedule: "Domingos de 7:00 AM a 12:00 PM",
          desc: "Acción de campo coordinada para la reforestación de riberas degradadas e inducción comunitaria sobre conservación del agua.",
          requirements: [
            "Mayor de 16 años (menores con autorización de padres)",
            "Condición física adecuada para labores de campo",
            "Disponer de calzado cerrado y ropa cómoda"
          ],
          documents: ["Autorización de tratamiento de imagen", "Exoneración de responsabilidades médica"]
        },
        {
          id: "FEPV-CONV-003",
          category: "becas",
          title: "Becas de Apoyo Vocacional en Emprendimiento 2026",
          status: "ABIERTA",
          location: "Agustín Codazzi",
          deadline: "2026-08-30",
          target: "Jóvenes desempleados y mujeres cabeza de hogar",
          schedule: "Flexible (Clases híbridas, presencial los viernes por la tarde)",
          desc: "Fondo de financiamiento técnico para capacitar a emprendedores locales en administración, finanzas y comercialización digital.",
          requirements: [
            "Pertenecer a estratos 1 o 2",
            "Tener una idea de negocio activa o en fase de diseño estructurado",
            "No contar con títulos profesionales universitarios activos"
          ],
          documents: ["Fotocopia de cédula", "Certificado de Sisbén IV", "Idea de negocio escrita (máximo 1 página)"]
        },
        {
          id: "FEPV-CONV-004",
          category: "empleo",
          title: "Convocatoria Laboral: Gestor de Proyecto Psicosocial",
          status: "CERRADA",
          location: "Codazzi & Jagua de Ibirico",
          deadline: "2026-07-31",
          target: "Profesionales en Psicología o Trabajo Social",
          schedule: "Tiempo completo (Contrato por prestación de servicios)",
          desc: "Búsqueda activa de profesionales para el equipo técnico del programa de atención a víctimas PAPSIVI.",
          requirements: [
            "Título profesional en Psicología o Trabajo Social con tarjeta profesional vigente",
            "Experiencia demostrada de mínimo 1 año con población vulnerable o víctimas",
            "Residir o tener disponibilidad de traslado al municipio de Codazzi"
          ],
          documents: ["Hoja de vida con soportes", "Copia de tarjeta profesional"]
        }
      ],
      proyectos: [
        {
          id: "papsivi",
          category: "salud-mental",
          title: "PAPSIVI (Atención Psicosocial a Víctimas)",
          desc: "Atención individual, familiar y comunitaria para dignificar a las víctimas.",
          location: "Agustín Codazzi",
          status: "Activo"
        },
        {
          id: "escuela-formacion",
          category: "educacion",
          title: "Escuela de Formación Ciudadana",
          desc: "Cursos continuos de liderazgo y autogestión territorial.",
          location: "Agustín Codazzi",
          status: "Activo"
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf8");
  }
}

// Read database
export function readDb() {
  ensureDb();
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading db.json", err);
    return { contactos: [], beneficiarios: [], voluntarios: [], convocatorias: [], proyectos: [] };
  }
}

// Write database
export function writeDb(data) {
  ensureDb();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing to db.json", err);
    return false;
  }
}

// --- Entity Helper Methods ---

// Contactos
export function getContactos() {
  return readDb().contactos;
}

export function addContacto(contacto) {
  const db = readDb();
  const newContacto = {
    id: `CNT-${Date.now()}`,
    fecha: new Date().toISOString(),
    ...contacto
  };
  db.contactos.push(newContacto);
  writeDb(db);
  return newContacto;
}

// Beneficiarios
export function getBeneficiarios() {
  return readDb().beneficiarios;
}

export function addBeneficiario(beneficiario) {
  const db = readDb();
  const newBeneficiario = {
    id: `BEN-${Date.now()}`,
    fecha: new Date().toISOString(),
    ...beneficiario
  };
  db.beneficiarios.push(newBeneficiario);
  writeDb(db);
  return newBeneficiario;
}

// Voluntarios
export function getVoluntarios() {
  return readDb().voluntarios;
}

export function addVoluntario(voluntario) {
  const db = readDb();
  const newVoluntario = {
    id: `VOL-${Date.now()}`,
    fecha: new Date().toISOString(),
    ...voluntario
  };
  db.voluntarios.push(newVoluntario);
  writeDb(db);
  return newVoluntario;
}

// Convocatorias (CRUD)
export function getConvocatorias() {
  return readDb().convocatorias;
}

export function addConvocatoria(conv) {
  const db = readDb();
  const newConv = {
    id: conv.id || `FEPV-CONV-${Math.floor(100 + Math.random() * 900)}`,
    ...conv
  };
  db.convocatorias.push(newConv);
  writeDb(db);
  return newConv;
}

export function updateConvocatoria(id, updatedConv) {
  const db = readDb();
  const idx = db.convocatorias.findIndex(c => c.id === id);
  if (idx !== -1) {
    db.convocatorias[idx] = { ...db.convocatorias[idx], ...updatedConv };
    writeDb(db);
    return db.convocatorias[idx];
  }
  return null;
}

export function deleteConvocatoria(id) {
  const db = readDb();
  const initialLen = db.convocatorias.length;
  db.convocatorias = db.convocatorias.filter(c => c.id !== id);
  if (db.convocatorias.length !== initialLen) {
    writeDb(db);
    return true;
  }
  return false;
}
