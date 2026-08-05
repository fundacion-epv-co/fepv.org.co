"use client";

import { useState } from "react";
import Link from "next/link";

export default function Programas() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "Todos los programas", icon: "ðŸŒ" },
    { id: "salud-mental", name: "Salud Mental", icon: "ðŸ§ " },
    { id: "educacion", name: "EducaciÃ³n", icon: "ðŸ“š" },
    { id: "inclusion", name: "InclusiÃ³n & Derechos", icon: "ðŸ¤" },
    { id: "ambiente", name: "Medio Ambiente", icon: "ðŸŒ±" },
    { id: "bienestar-animal", name: "Bienestar Animal", icon: "ðŸ¾" },
    { id: "emprendimiento", name: "Emprendimiento", icon: "ðŸ’¼" }
  ];

  const projects = [
    {
      id: "papsivi",
      category: "salud-mental",
      title: "PAPSIVI (Programa de AtenciÃ³n Psicosocial y Salud Integral a VÃ­ctimas)",
      desc: "ImplementaciÃ³n del modelo de atenciÃ³n psicosocial a nivel individual, familiar y comunitario para la dignificaciÃ³n de vÃ­ctimas en el departamento del Cesar.",
      obj: "Mitigar las afectaciones psicosociales y los daÃ±os a la salud fÃ­sica y mental de las vÃ­ctimas del conflicto armado.",
      population: "VÃ­ctimas del conflicto armado, familias vulnerables",
      location: "AgustÃ­n Codazzi, Becerril, San Diego, La Paz (Cesar)",
      allies: "CooperaciÃ³n nacional, entes territoriales de salud",
      status: "Activo"
    },
    {
      id: "escuela-formacion",
      category: "educacion",
      title: "Escuela de FormaciÃ³n y Competencias Ciudadanas",
      desc: "Talleres y cursos continuos que empoderan a las comunidades con herramientas de liderazgo, resoluciÃ³n de conflictos, democracia participativa y habilidades blandas.",
      obj: "Capacitar a lÃ­deres comunitarios y jÃ³venes en tÃ©cnicas de autogestiÃ³n territorial.",
      population: "LÃ­deres comunales, jÃ³venes de juntas de acciÃ³n local",
      location: "AgustÃ­n Codazzi (Cesar)",
      allies: "Instituciones educativas locales, SENA",
      status: "Activo"
    },
    {
      id: "eco-encuentros",
      category: "ambiente",
      title: "Eco-Encuentros Para la Vida",
      desc: "Acciones colectivas de educaciÃ³n ambiental escolar, reforestaciÃ³n de cuencas hidrogrÃ¡ficas y capacitaciÃ³n sobre separaciÃ³n en la fuente y reciclaje en Codazzi.",
      obj: "Promover la conciencia ecolÃ³gica y recuperar zonas degradadas por la deforestaciÃ³n local.",
      population: "Comunidad escolar, comitÃ©s ambientales comunales",
      location: "AgustÃ­n Codazzi y SerranÃ­a del PerijÃ¡ (Zonas rurales)",
      allies: "Organizaciones comunitarias y CorporaciÃ³n AutÃ³noma Regional",
      status: "Activo"
    },
    {
      id: "cuidado-huellas",
      category: "bienestar-animal",
      title: "Cuidado de Huellas & Salud Animal Comunitaria",
      desc: "SensibilizaciÃ³n sobre tenencia responsable de mascotas, realizaciÃ³n de jornadas de desparasitaciÃ³n y articulaciÃ³n de brigadas de esterilizaciÃ³n animal.",
      obj: "Reducir la proliferaciÃ³n de animales sin hogar y prevenir problemas de salud pÃºblica asociados en barrios vulnerables.",
      population: "Familias con mascotas, animales callejeros de sectores vulnerables",
      location: "AgustÃ­n Codazzi",
      allies: "ClÃ­nicas veterinarias aliadas, fundaciones protectoras locales",
      status: "Activo"
    },
    {
      id: "autonomia-economica",
      category: "emprendimiento",
      title: "Programa de AutonomÃ­a EconÃ³mica & Emprendimiento Social",
      desc: "CapacitaciÃ³n tÃ©cnica y financiera a mujeres cabeza de hogar y jÃ³venes desempleados para formular planes de negocio y coordinar redes de comercio justo.",
      obj: "Fortalecer la capacidad productiva e ingresos autÃ³nomos de las familias del municipio.",
      population: "Mujeres cabeza de hogar, jÃ³venes emprendedores",
      location: "AgustÃ­n Codazzi",
      allies: "CÃ¡mara de Comercio de Valledupar, Cooperantes privados",
      status: "Activo"
    },
    {
      id: "red-apoyo-emocional",
      category: "salud-mental",
      title: "Red Comunitaria de Apoyo Emocional en Salud Mental",
      desc: "CapacitaciÃ³n de primeros auxilios psicolÃ³gicos a lÃ­deres comunitarios para la detecciÃ³n temprana de signos de riesgo emocional y remisiÃ³n a redes de salud.",
      obj: "Desestigmatizar la salud mental y crear una red de primera respuesta sensible y empÃ¡tica en los barrios.",
      population: "LÃ­deres de barrio, madres comunitarias, docentes",
      location: "AgustÃ­n Codazzi",
      allies: "SecretarÃ­a de Salud Municipal, profesionales voluntarios",
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
            Explora las iniciativas de impacto territorial que la FEPV implementa en salud mental, educaciÃ³n, ambiente, bienestar animal e inclusiÃ³n.
          </p>
        </div>
      </section>

      {/* NavegaciÃ³n y Filtros */}
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

      {/* CatÃ¡logo de Proyectos */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 max-w-md mx-auto space-y-4">
            <span className="text-5xl block">ðŸ“‚</span>
            <h3 className="font-display font-bold text-lg text-fepv-darkblue">No se encontraron proyectos</h3>
            <p className="text-xs text-fepv-gray/70">
              Estamos estructurando nuevos proyectos en esta categorÃ­a. Muy pronto estarÃ¡n publicados.
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
                  {/* CategorÃ­a badge */}
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
                      <strong>ðŸŽ¯ Objetivo:</strong> {p.obj}
                    </p>
                    <p>
                      <strong>ðŸ‘¥ PoblaciÃ³n:</strong> {p.population}
                    </p>
                    <p>
                      <strong>ðŸ“ Municipio:</strong> {p.location}
                    </p>
                    <p>
                      <strong>ðŸ¤ Co-operantes / Aliados:</strong> {p.allies}
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
                    Solicitar informaciÃ³n
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* Resumen Final de Incidencia */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center py-10 bg-fepv-light/20 rounded-3xl border border-fepv-green/10">
        <h3 className="font-display font-bold text-lg text-fepv-darkblue mb-2">Â¿Quieres presentar o financiar un proyecto con FEPV?</h3>
        <p className="text-xs text-fepv-gray/85 max-w-2xl mx-auto mb-6">
          Contamos con capacidad legal, tÃ©cnica y contable para celebrar convenios asociativos, contratos y alianzas de cofinanciaciÃ³n para el desarrollo sostenible.
        </p>
        <Link href="/participa?rol=aliado" className="fepv-btn fepv-btn-primary text-xs">
          Contactar con CooperaciÃ³n de FEPV
        </Link>
      </section>

    </div>
  );
}
