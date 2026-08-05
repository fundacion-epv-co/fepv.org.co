"use client";

import { useState } from "react";
import Link from "next/link";

export default function Programas() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "Todos los programas", icon: "🌐" },
    { id: "salud-mental", name: "Salud Mental", icon: "🧠" },
    { id: "educacion", name: "Educación", icon: "📚" },
    { id: "inclusion", name: "Inclusión & Derechos", icon: "🤝" },
    { id: "ambiente", name: "Medio Ambiente", icon: "🌱" },
    { id: "bienestar-animal", name: "Bienestar Animal", icon: "🐾" },
    { id: "emprendimiento", name: "Emprendimiento", icon: "💼" }
  ];

  const projects = [
    {
      id: "papsivi",
      category: "salud-mental",
      title: "PAPSIVI (Programa de Atención Psicosocial y Salud Integral a Víctimas)",
      desc: "Implementación del modelo de atención psicosocial a nivel individual, familiar y comunitario para la dignificación de víctimas en el departamento del Cesar.",
      obj: "Mitigar las afectaciones psicosociales y los daños a la salud física y mental de las víctimas del conflicto armado.",
      population: "Víctimas del conflicto armado, familias vulnerables",
      location: "Agustín Codazzi, Becerril, San Diego, La Paz (Cesar)",
      allies: "Cooperación nacional, entes territoriales de salud",
      status: "Activo"
    },
    {
      id: "escuela-formacion",
      category: "educacion",
      title: "Escuela de Formación y Competencias Ciudadanas",
      desc: "Talleres y cursos continuos que empoderan a las comunidades con herramientas de liderazgo, resolución de conflictos, democracia participativa y habilidades blandas.",
      obj: "Capacitar a líderes comunitarios y jóvenes en técnicas de autogestión territorial.",
      population: "Líderes comunales, jóvenes de juntas de acción local",
      location: "Agustín Codazzi (Cesar)",
      allies: "Instituciones educativas locales, SENA",
      status: "Activo"
    },
    {
      id: "eco-encuentros",
      category: "ambiente",
      title: "Eco-Encuentros Para la Vida",
      desc: "Acciones colectivas de educación ambiental escolar, reforestación de cuencas hidrográficas y capacitación sobre separación en la fuente y reciclaje en Codazzi.",
      obj: "Promover la conciencia ecológica y recuperar zonas degradadas por la deforestación local.",
      population: "Comunidad escolar, comités ambientales comunales",
      location: "Agustín Codazzi y Serranía del Perijá (Zonas rurales)",
      allies: "Organizaciones comunitarias y Corporación Autónoma Regional",
      status: "Activo"
    },
    {
      id: "cuidado-huellas",
      category: "bienestar-animal",
      title: "Cuidado de Huellas & Salud Animal Comunitaria",
      desc: "Sensibilización sobre tenencia responsable de mascotas, realización de jornadas de desparasitación y articulación de brigadas de esterilización animal.",
      obj: "Reducir la proliferación de animales sin hogar y prevenir problemas de salud pública asociados en barrios vulnerables.",
      population: "Familias con mascotas, animales callejeros de sectores vulnerables",
      location: "Agustín Codazzi",
      allies: "Clínicas veterinarias aliadas, fundaciones protectoras locales",
      status: "Activo"
    },
    {
      id: "autonomia-economica",
      category: "emprendimiento",
      title: "Programa de Autonomía Económica & Emprendimiento Social",
      desc: "Capacitación técnica y financiera a mujeres cabeza de hogar y jóvenes desempleados para formular planes de negocio y coordinar redes de comercio justo.",
      obj: "Fortalecer la capacidad productiva e ingresos autónomos de las familias del municipio.",
      population: "Mujeres cabeza de hogar, jóvenes emprendedores",
      location: "Agustín Codazzi",
      allies: "Cámara de Comercio de Valledupar, Cooperantes privados",
      status: "Activo"
    },
    {
      id: "red-apoyo-emocional",
      category: "salud-mental",
      title: "Red Comunitaria de Apoyo Emocional en Salud Mental",
      desc: "Capacitación de primeros auxilios psicológicos a líderes comunitarios para la detección temprana de signos de riesgo emocional y remisión a redes de salud.",
      obj: "Desestigmatizar la salud mental y crear una red de primera respuesta sensible y empática en los barrios.",
      population: "Líderes de barrio, madres comunitarias, docentes",
      location: "Agustín Codazzi",
      allies: "Secretaría de Salud Municipal, profesionales voluntarios",
      status: "Activo"
    }
  ];

  const filteredProjects = selectedCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="w-full bg-white pb-20">
      
      {/* Banner Superior */}
      <section className="bg-fepv-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="font-display font-bold text-3xl sm:text-4.5xl">
            Programas y Proyectos
          </h1>
          <p className="font-sans text-sm sm:text-base text-fepv-light max-w-2xl mx-auto leading-relaxed">
            Explora las iniciativas de impacto territorial que la FEPV implementa en salud mental, educación, ambiente, bienestar animal e inclusión.
          </p>
        </div>
      </section>

      {/* Navegación y Filtros */}
      <section className="py-10 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`fepv-btn py-2 px-4 text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id 
                    ? "bg-fepv-green text-white shadow-md shadow-fepv-green/10" 
                    : "bg-white text-fepv-gray hover:bg-fepv-light/20 border border-gray-200"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Catálogo de Proyectos */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 max-w-md mx-auto space-y-4">
            <span className="text-5xl block">📂</span>
            <h3 className="font-display font-bold text-lg text-fepv-darkblue">No se encontraron proyectos</h3>
            <p className="text-xs text-fepv-gray/70">
              Estamos estructurando nuevos proyectos en esta categoría. Muy pronto estarán publicados.
            </p>
            <button 
              onClick={() => setSelectedCategory("all")}
              className="fepv-btn fepv-btn-primary py-2 text-xs"
            >
              Ver todos los programas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProjects.map((p) => (
              <div 
                key={p.id}
                className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                {/* Indicador de Estado Activo */}
                <div className="absolute top-6 right-6 flex items-center gap-1 text-[10px] font-bold text-fepv-green bg-fepv-light px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-fepv-green rounded-full animate-ping"></span>
                  {p.status}
                </div>

                <div className="space-y-4">
                  {/* Categoría badge */}
                  <span className="inline-block text-[10px] font-bold text-fepv-blue uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
                    {categories.find(c => c.id === p.category)?.name}
                  </span>
                  
                  <h3 className="font-display font-bold text-lg sm:text-xl text-fepv-darkblue pr-12 leading-tight">
                    {p.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-fepv-gray/85 leading-relaxed">
                    {p.desc}
                  </p>

                  <div className="border-t border-gray-100 pt-4 space-y-3 text-xs text-fepv-gray/80">
                    <p>
                      <strong>🎯 Objetivo:</strong> {p.obj}
                    </p>
                    <p>
                      <strong>👥 Población:</strong> {p.population}
                    </p>
                    <p>
                      <strong>📍 Municipio:</strong> {p.location}
                    </p>
                    <p>
                      <strong>🤝 Co-operantes / Aliados:</strong> {p.allies}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <Link 
                    href={`/participa?rol=beneficiario&programa=${p.id}`}
                    className="fepv-btn fepv-btn-primary py-2 px-6 text-xs"
                  >
                    Quiero participar
                  </Link>
                  <Link 
                    href="/contacto"
                    className="text-xs text-fepv-green hover:underline font-semibold"
                  >
                    Solicitar información
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* Resumen Final de Incidencia */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center py-10 bg-fepv-light/20 rounded-3xl border border-fepv-green/10">
        <h3 className="font-display font-bold text-lg text-fepv-darkblue mb-2">¿Quieres presentar o financiar un proyecto con FEPV?</h3>
        <p className="text-xs text-fepv-gray/85 max-w-2xl mx-auto mb-6">
          Contamos con capacidad legal, técnica y contable para celebrar convenios asociativos, contratos y alianzas de cofinanciación para el desarrollo sostenible.
        </p>
        <Link href="/participa?rol=aliado" className="fepv-btn fepv-btn-primary text-xs">
          Contactar con Cooperación de FEPV
        </Link>
      </section>

    </div>
  );
}
