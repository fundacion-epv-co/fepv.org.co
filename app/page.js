"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchGoogleSheetData, GOOGLE_SHEETS_METRICAS_CSV, GOOGLE_SHEETS_BANNER_CSV, getDirectDriveImageUrl, GOOGLE_SHEETS_TESTIMONIOS_CSV, fetchProgramImagesMap, fetchPoblacionesImagesMap, isImageUrl } from "../lib/api";

const INITIAL_TESTIMONIALS = [
  {
    text: "Participar en este proceso me permitió descubrir que sí podía volver a empezar, sanar mis heridas y liderar cambios en mi comunidad.",
    author: "María Camila Restrepo",
    role: "Participante del programa de salud mental",
    location: "Agustín Codazzi, Cesar"
  },
  {
    text: "La Escuela de Formación nos dio herramientas para emprender y asociarnos. Hoy lidero un proyecto productivo familiar.",
    author: "José Luis González",
    role: "Egresado de la línea de Emprendimiento",
    location: "Codazzi, Cesar"
  },
  {
    text: "El acompañamiento en la conservación de nuestro entorno nos enseñó a amar y proteger la cuenca local. El cambio inicia en casa.",
    author: "Estela Araujo",
    role: "Voluntaria del programa Medio Ambiente",
    location: "Zona Rural de Codazzi"
  }
];

export default function Home() {
  // Banner state
  const [bannerItems, setBannerItems] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Testimonials state
  const [testimonialsList, setTestimonialsList] = useState(INITIAL_TESTIMONIALS);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Mapas de imágenes separados
  const [programImagesMap, setProgramImagesMap] = useState({});
  const [poblacionesImagesMap, setPoblacionesImagesMap] = useState({});

  useEffect(() => {
    async function loadAllImages() {
      try {
        const [progMap, pobMap] = await Promise.all([
          fetchProgramImagesMap(),
          fetchPoblacionesImagesMap()
        ]);
        if (Object.keys(progMap).length > 0) setProgramImagesMap(progMap);
        if (Object.keys(pobMap).length > 0) setPoblacionesImagesMap(pobMap);
      } catch (e) {
        console.error("Error cargando mapas de imágenes en Home:", e);
      }
    }
    loadAllImages();
  }, []);

  const [stats, setStats] = useState([
    { id: "1", titulo: "Personas Participantes", valor: 0, _target: 250 },
    { id: "2", titulo: "Actividades Desarrolladas", valor: 0, _target: 15 },
    { id: "3", titulo: "Aliados Estratégicos", valor: 0, _target: 8 },
    { id: "4", titulo: "Municipios Impactados", valor: 0, _target: 4 }
  ]);

  useEffect(() => {
    async function loadStats() {
      let targetStats = [
        { id: "1", titulo: "Personas Participantes", valor: 0, _target: 250 },
        { id: "2", titulo: "Actividades Desarrolladas", valor: 0, _target: 15 },
        { id: "3", titulo: "Aliados Estratégicos", valor: 0, _target: 8 },
        { id: "4", titulo: "Municipios Impactados", valor: 0, _target: 4 }
      ];

      if (GOOGLE_SHEETS_METRICAS_CSV !== "PENDIENTE_DE_URL_METRICAS") {
        try {
          const data = await fetchGoogleSheetData(GOOGLE_SHEETS_METRICAS_CSV);
          if (data && data.length > 0) {
            const defaultTitles = {
              beneficiarios: "Personas Participantes",
              actividades: "Actividades Desarrolladas",
              aliados: "Aliados Estratégicos",
              municipios: "Municipios Impactados"
            };
            targetStats = data.map((row, idx) => ({
              id: row.id || String(idx),
              titulo: row.titulo || defaultTitles[row.id] || 'Métrica',
              _target: parseInt(row.valor, 10) || 0,
              valor: 0
            }));
          }
        } catch (e) {
          console.error("Error cargando métricas", e);
        }
      }

      setStats(targetStats);

      const duration = 2000; // 2 seconds
      const steps = 50;
      const intervalTime = duration / steps;
      let step = 0;
      let timer;

      timer = setInterval(() => {
        step++;
        setStats(prevStats => prevStats.map(s => ({
          ...s,
          valor: Math.min(Math.round((s._target / steps) * step), s._target)
        })));

        if (step >= steps) {
          clearInterval(timer);
        }
      }, intervalTime);

      return () => {
        if (timer) clearInterval(timer);
      };
    }

    loadStats();
  }, []);

  // Fetch Banner
  useEffect(() => {
    async function loadBanner() {
      if (GOOGLE_SHEETS_BANNER_CSV !== "PENDIENTE_DE_URL_BANNER") {
        try {
          const data = await fetchGoogleSheetData(GOOGLE_SHEETS_BANNER_CSV);
          if (data && data.length > 0) {
            setBannerItems(data);
          }
        } catch (e) {
          console.error("Error cargando banner", e);
        }
      }
    }
    loadBanner();
  }, []);

  // Fetch Testimonios
  useEffect(() => {
    async function loadTestimonios() {
      if (GOOGLE_SHEETS_TESTIMONIOS_CSV !== "PENDIENTE_DE_URL_TESTIMONIOS") {
        try {
          const data = await fetchGoogleSheetData(GOOGLE_SHEETS_TESTIMONIOS_CSV);
          if (data && data.length > 0) {
            const mapped = data.map(item => ({
              text: item.texto || item.text || "",
              author: item.autor || item.author || "",
              role: item.rol || item.role || "",
              location: item.ubicacion || item.location || ""
            })).filter(t => t.text);
            if (mapped.length > 0) {
              setTestimonialsList(mapped);
            }
          }
        } catch (e) {
          console.error("Error cargando testimonios", e);
        }
      }
    }
    loadTestimonios();
  }, []);

  // Auto-slide Banner
  useEffect(() => {
    if (bannerItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerItems.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [bannerItems.length]);

  // Auto-slide Testimonios
  useEffect(() => {
    if (testimonialsList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonialsList.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonialsList.length]);

  const nextSlide = () => {
    if (bannerItems.length <= 1) return;
    setCurrentBannerIndex((prev) => (prev + 1) % bannerItems.length);
  };

  const prevSlide = () => {
    if (bannerItems.length <= 1) return;
    setCurrentBannerIndex((prev) => (prev - 1 + bannerItems.length) % bannerItems.length);
  };

  const categories = [
    {
      id: "salud-mental",
      title: "Salud Mental",
      icon: "🧠",
      desc: "Promoción del bienestar emocional, atención psicosocial y fortalecimiento de capacidades.",
      color: "border-fepv-green bg-fepv-light/10"
    },
    {
      id: "familias",
      title: "Familias",
      icon: "👨‍👩‍👧",
      desc: "Fortalecimiento familiar, orientación y construcción de entornos protectores.",
      color: "border-fepv-blue bg-blue-50/30"
    },
    {
      id: "educacion",
      title: "Educación",
      icon: "📚",
      desc: "Formación, talleres y oportunidades para aprender y desarrollar habilidades.",
      color: "border-fepv-orange bg-yellow-50/30"
    },
    {
      id: "inclusion-derechos",
      title: "Inclusión y Derechos",
      icon: "🤝",
      desc: "Promoción de derechos, participación ciudadana e inclusión social activa.",
      color: "border-fepv-green bg-fepv-light/10"
    },
    {
      id: "medio-ambiente",
      title: "Medio Ambiente",
      icon: "🌱",
      desc: "Educación ambiental, reforestación y conservación comunitaria sostenible.",
      color: "border-fepv-blue bg-blue-50/30"
    },
    {
      id: "bienestar-animal",
      title: "Bienestar Animal",
      icon: "🐾",
      desc: "Protección animal, tenencia responsable y acciones de salud veterinaria comunitaria.",
      color: "border-fepv-orange bg-yellow-50/30"
    },
    {
      id: "emprendimiento",
      title: "Emprendimiento",
      icon: "💼",
      desc: "Autonomía económica, emprendimiento social y fortalecimiento de capacidades locales.",
      color: "border-fepv-green bg-fepv-light/10"
    },
    {
      id: "cultura-deporte",
      title: "Cultura y Deporte",
      icon: "⚽",
      desc: "Actividades artísticas, recreativas y deportivas que integran y sanan el tejido social.",
      color: "border-fepv-blue bg-blue-50/30"
    }
  ];

  const beneficiaries = [
    { id: "ninas-ninos", altId: "ninas-ninos", name: "Niñas y Niños", img: "👧👦" },
    { id: "adolescentes", altId: "adolescentes", name: "Adolescentes", img: "🎒" },
    { id: "jovenes", altId: "jovenes", name: "Jóvenes", img: "⚡" },
    { id: "familias", altId: "familias-poblacion", name: "Familias", img: "🏡" },
    { id: "discapacidad", altId: "discapacidad", name: "Personas con Discapacidad", img: "♿" },
    { id: "victimas", altId: "victimas", name: "Víctimas del Conflicto", img: "🕊️" },
    { id: "comunidades-rurales", altId: "rurales", name: "Comunidades Rurales", img: "🌽" },
    { id: "organizaciones", altId: "organizaciones", name: "Organizaciones de Base", img: "📢" }
  ];

  const activePrograms = [
    {
      title: "PAPSIVI",
      desc: "Programa de Atención Psicosocial y Salud Integral a Víctimas del conflicto armado en el territorio.",
      actionText: "Conocer programa",
      href: "/programas#salud-mental"
    },
    {
      title: "Escuela de Formación",
      desc: "Procesos educativos y comunitarios integrales para el desarrollo de competencias locales.",
      actionText: "Ver programas",
      href: "/programas#educacion"
    },
    {
      title: "Eco-Encuentros",
      desc: "Iniciativas comunitarias orientadas a la educación ambiental y protección de microcuencas.",
      actionText: "Conocer iniciativa",
      href: "/programas#ambiente"
    },
    {
      title: "Cuidado de Huellas",
      desc: "Acciones territoriales de esterilización, concientización y tenencia responsable de mascotas.",
      actionText: "Conocer iniciativa",
      href: "/programas#bienestar-animal"
    }
  ];

  const mockOpportunities = [
    {
      category: "Cursos",
      badgeColor: "bg-fepv-green text-white",
      status: "ABIERTA",
      title: "Taller de Fortalecimiento Emocional y Resiliencia",
      location: "Agustín Codazzi",
      deadline: "15/08/2026",
      target: "Jóvenes y adultos"
    },
    {
      category: "Voluntariado",
      badgeColor: "bg-fepv-blue text-white",
      status: "ABIERTA",
      title: "Campaña de Reforestación Comunitaria 'Siembre de Vida'",
      location: "Vereda Las Flores",
      deadline: "20/08/2026",
      target: "Toda la comunidad"
    },
    {
      category: "Convocatorias",
      badgeColor: "bg-fepv-orange text-fepv-gray",
      status: "ABIERTA",
      title: "Fondo de Emprendimiento Social: Capital Semilla FEPV 2026",
      location: "Agustín Codazzi",
      deadline: "30/08/2026",
      target: "Emprendedores locales"
    }
  ];

  const participationPaths = [
    {
      title: "Soy beneficiario",
      desc: "Quiero participar en los programas psicosociales, educativos o comunitarios.",
      btnText: "Inscribirme",
      href: "/participa?rol=beneficiario",
      icon: (
        <svg className="w-8 h-8 text-fepv-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      )
    },
    {
      title: "Quiero donar",
      desc: "Quiero apoyar económicamente y apadrinar procesos que transforman vidas.",
      btnText: "Aportar ahora",
      href: "/donaciones",
      icon: (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      )
    },
    {
      title: "Quiero ser aliado",
      desc: "Represento a una entidad y quiero colaborar activamente con proyectos.",
      btnText: "Unirme como aliado",
      href: "/participa?rol=aliado",
      icon: (
        <svg className="w-8 h-8 text-fepv-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      )
    },
    {
      title: "Quiero ser voluntario",
      desc: "Quiero aportar mi tiempo, capacidades y vocación de servicio social.",
      btnText: "Postularme",
      href: "/participa?rol=voluntario",
      icon: (
        <svg className="w-8 h-8 text-fepv-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="w-full">
      
      {/* BLOQUE 0: BANNER DINÁMICO */}
      {bannerItems.length > 0 && (
        <section className="relative w-full h-[300px] md:h-[380px] bg-fepv-darkblue group">
          {bannerItems.map((item, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              {/* Imagen de fondo */}
              <div 
                className="absolute inset-0 bg-contain bg-center bg-no-repeat" 
                style={{ backgroundImage: `url(${getDirectDriveImageUrl(item.imagen)})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent mix-blend-multiply"></div>
              </div>
              
              {/* Contenido (Textos) centrado */}
              <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-12 md:px-24 max-w-5xl mx-auto">
                {item.titulo && (
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3 drop-shadow-lg leading-tight">
                    {item.titulo}
                  </h2>
                )}
                {item.descripcion && (
                  <p className="text-sm md:text-lg text-gray-100 mb-6 max-w-3xl drop-shadow-md font-medium">
                    {item.descripcion}
                  </p>
                )}
              </div>

              {/* Botón de Contacto - Siempre al fondo del banner */}
              {item.enlace && (
                <Link 
                  href={item.enlace} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-2 bg-fepv-green hover:bg-[#5a822f] text-white font-bold py-2.5 px-6 rounded-full transition-colors shadow-lg text-sm cursor-pointer"
                >
                  Contacto
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              )}
            </div>
          ))}

          {/* Flecha Izquierda */}
          {bannerItems.length > 1 && (
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-[#429900] hover:bg-[#347A00] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
              aria-label="Anterior"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
          )}

          {/* Flecha Derecha */}
          {bannerItems.length > 1 && (
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-[#429900] hover:bg-[#347A00] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
              aria-label="Siguiente"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          )}
          
          {/* Indicadores (Puntos) */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2.5 z-20">
            {bannerItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBannerIndex(idx)}
                className={`transition-all rounded-full ${idx === currentBannerIndex ? 'w-3 h-3 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'} border border-transparent hover:border-white`}
                aria-label={`Ir al slide ${idx + 1}`}
              />
            ))}
          </div>
          
          {/* Curva decorativa en la parte inferior simulando el diseño redondo */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none rounded-t-[50%] scale-110 translate-y-4"></div>
        </section>
      )}

      {/* BLOQUE 1: HERO PRINCIPAL */}
      <section className="relative overflow-hidden bg-gradient-to-br from-fepv-light/40 via-white to-white py-12 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            
            {/* Lado Izquierdo (Textos y CTAs) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6.5xl text-fepv-darkblue leading-none tracking-tight">
                  Fundación Encuentros <br />
                  <span className="text-fepv-vividgreen">para la Vida</span>
                </h1>
                
                <h2 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl text-fepv-green leading-snug">
                  “Encuentros que transforman vidas”
                </h2>

                <p className="font-sans text-sm sm:text-base lg:text-lg text-fepv-gray/80 max-w-xl mx-auto lg:mx-0 leading-relaxed pt-2">
                  Construimos oportunidades, fortalecemos comunidades y acompañamos procesos que generan bienestar emocional y transformación social en el territorio.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href="/nosotros" className="fepv-btn fepv-btn-primary w-full sm:w-auto text-center cursor-pointer">
                  Conoce nuestra Fundación
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </Link>
                <Link href="/participa" className="fepv-btn fepv-btn-secondary w-full sm:w-auto text-center cursor-pointer">
                  Quiero participar
                </Link>
              </div>
            </div>

            {/* Lado Derecho (Fotografía Comunitaria Premium) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[420px] aspect-[4/5] bg-white rounded-3xl shadow-xl shadow-fepv-green/10 border-4 border-white overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80" 
                  alt="Comunidad FEPV" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Micro-Badges */}
                <div className="absolute top-6 -right-2 md:right-[-20px] bg-white px-4 py-2.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2">
                  <span className="text-xl">🤝</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-fepv-darkblue leading-tight">Cooperación</span>
                    <span className="text-[10px] text-fepv-green font-semibold">Aliados Activos</span>
                  </div>
                </div>

                <div className="absolute -bottom-3 -left-3 bg-white px-4 py-2.5 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-2">
                  <span className="text-xl">🧠</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-fepv-darkblue leading-tight">Salud Mental</span>
                    <span className="text-[10px] text-fepv-blue font-semibold">Apoyo Psicosocial</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BLOQUE 2: ¿QUÉ HACEMOS? */}
      <section className="py-20 bg-white border-t border-gray-50" id="servicios">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-fepv-darkblue">
              Transformamos desde diferentes caminos
            </h2>
            <p className="font-sans text-base text-fepv-gray/80 leading-relaxed">
              Trabajamos de forma articulada en diversas áreas estratégicas que responden directamente a la misión y objeto social institucional de FEPV.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, idx) => {
              const customImg = programImagesMap[cat.id];
              const showImage = customImg || isImageUrl(cat.icon);
              const imgSrc = customImg ? getDirectDriveImageUrl(customImg) : getDirectDriveImageUrl(cat.icon);

              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border-t-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${cat.color}`}
                >
                  <div className="h-20 w-20 sm:h-24 sm:w-24 mb-5 flex items-center justify-start">
                    {showImage ? (
                      <img 
                        src={imgSrc} 
                        alt={cat.title}
                        className="w-full h-full object-contain drop-shadow-sm"
                      />
                    ) : (
                      <span className="text-5xl sm:text-6xl block">{cat.icon}</span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-lg text-fepv-darkblue mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-fepv-gray/85 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BLOQUE 3: ¿A QUIÉNES ACOMPAÑAMOS? */}
      <section className="py-20 bg-fepv-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold text-fepv-green uppercase tracking-wider block">
                Enfoque Diferencial e Inclusivo
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-fepv-darkblue leading-tight">
                ¿A quiénes acompañamos?
              </h2>
              <p className="text-fepv-gray/80 leading-relaxed">
                Nuestras intervenciones están diseñadas desde la empatía y la inclusión. Reconocemos las realidades específicas de cada grupo poblacional, garantizando procesos sensibles y adaptados al territorio del Cesar.
              </p>
              <div className="p-4 bg-white/80 rounded-2xl border border-fepv-green/10 flex items-start gap-3">
                <span className="text-2xl mt-0.5">🕊️</span>
                <p className="text-xs text-fepv-gray/90 leading-normal">
                  <strong>Compromiso Legal:</strong> Procesos estructurados en estricto cumplimiento con marcos de Derechos Humanos y protección del menor.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {beneficiaries.map((b, idx) => {
                  // Búsqueda inteligente por id principal, id alternativo, o aproximación por nombre
                  const foundKey = Object.keys(poblacionesImagesMap).find(k => {
                    const cleanK = k.toLowerCase().trim();
                    return (
                      cleanK === b.id.toLowerCase() ||
                      cleanK === b.altId.toLowerCase() ||
                      cleanK === b.name.toLowerCase().trim() ||
                      cleanK.replace(/[^a-z0-9]/g, "") === b.id.replace(/[^a-z0-9]/g, "") ||
                      cleanK.replace(/[^a-z0-9]/g, "") === b.altId.replace(/[^a-z0-9]/g, "")
                    );
                  });

                  const customImg = foundKey ? poblacionesImagesMap[foundKey] : null;
                  const showImage = customImg || isImageUrl(b.img);
                  const imgSrc = customImg ? getDirectDriveImageUrl(customImg) : getDirectDriveImageUrl(b.img);

                  return (
                    <div
                      key={idx}
                      className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center justify-between hover:border-fepv-green/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 min-h-[160px] sm:min-h-[185px]"
                    >
                      <div className="w-24 h-24 sm:w-28 sm:h-28 mb-2 flex items-center justify-center p-1 overflow-hidden">
                        {showImage ? (
                          <img 
                            src={imgSrc} 
                            alt={b.name}
                            className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <span className="text-4xl">{b.img}</span>
                        )}
                      </div>
                      <span className="font-sans font-bold text-xs sm:text-sm text-fepv-darkblue leading-tight mt-1">
                        {b.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BLOQUE 4: NUESTROS PROGRAMAS */}
      <section className="py-20 bg-white" id="programas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-4">
              <h2 className="font-display font-bold text-3xl text-fepv-darkblue">
                Programas en el Territorio
              </h2>
              <p className="text-fepv-gray/80 max-w-xl">
                Iniciativas estructuradas y con metas medibles que implementamos junto a comunidades y aliados cooperantes.
              </p>
            </div>
            <Link href="/programas" className="fepv-btn fepv-btn-secondary self-start md:self-auto cursor-pointer">
              Ver todos los programas
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {activePrograms.map((p, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
              >
                <div>
                  <div className="bg-fepv-light/40 text-fepv-darkblue font-display font-bold text-sm px-3.5 py-1.5 rounded-lg inline-block mb-4">
                    {p.title}
                  </div>
                  <p className="text-sm text-fepv-gray/85 leading-relaxed mb-6">
                    {p.desc}
                  </p>
                </div>
                <Link
                  href={p.href}
                  className="text-xs font-bold text-fepv-green hover:text-fepv-darkblue flex items-center gap-1 group"
                >
                  {p.actionText}
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE 5: IMPACTO */}
      <section className="py-16 bg-fepv-dark text-white" id="impacto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 text-center lg:text-left space-y-3">
              <h2 className="font-display font-bold text-3xl text-fepv-orange">
                Nuestra huella de impacto
              </h2>
              <p className="text-sm text-white/70 leading-relaxed">
                Estadísticas de gestión y actividades consolidadas en Agustín Codazzi y municipios del Cesar.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
                  <span className="font-display font-bold text-4xl text-fepv-orange block mb-1">
                    +{stat.valor}
                  </span>
                  <span className="text-xs text-white/80 font-medium">{stat.titulo}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* BLOQUE 6: HISTORIAS QUE TRANSFORMAN */}
      {testimonialsList.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-white to-fepv-light/20 overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
            <span className="text-4xl">✨</span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-fepv-darkblue">
              Cada encuentro deja una huella
            </h2>
            
            {/* Testimonial Box */}
            <div className="relative bg-white p-8 sm:p-12 rounded-3xl shadow-xl shadow-fepv-green/5 border border-fepv-light/35 min-h-[220px] flex flex-col justify-center animate-in fade-in duration-500">
              <span className="absolute top-4 left-6 text-6xl text-fepv-green/10 font-serif leading-none">“</span>
              <p className="font-sans text-base sm:text-lg text-fepv-gray/95 italic leading-relaxed relative z-10">
                {testimonialsList[currentTestimonial].text}
              </p>
              <div className="mt-6 flex flex-col items-center">
                <span className="font-display font-bold text-sm text-fepv-darkblue">
                  {testimonialsList[currentTestimonial].author}
                </span>
                <span className="text-xs text-fepv-green font-semibold mt-0.5">
                  {testimonialsList[currentTestimonial].role} &bull; {testimonialsList[currentTestimonial].location}
                </span>
              </div>
            </div>

            {/* Testimonial Nav dots */}
            <div className="flex justify-center items-center gap-3">
              {testimonialsList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentTestimonial === idx ? "bg-fepv-green w-8" : "bg-fepv-green/20 hover:bg-fepv-green/45"
                  }`}
                  aria-label={`Ver testimonio ${idx + 1}`}
                />
              ))}
            </div>

            <div>
              <Link href="/nosotros#historia" className="fepv-btn fepv-btn-secondary mt-4 cursor-pointer">
                Conoce más historias de impacto
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* BLOQUE 8: ¿QUIERES HACER PARTE? */}
      <section className="py-20 bg-fepv-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display font-bold text-3xl text-fepv-darkblue">
              ¿Cómo quieres sumarte a FEPV?
            </h2>
            <p className="font-sans text-base text-fepv-gray/80">
              La transformación social es un esfuerzo colectivo. Elige el camino que mejor se adapte a ti y participa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {participationPaths.map((path, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between items-center text-center hover:shadow-lg hover:border-fepv-green/10 transition-all duration-300"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-fepv-light/50 p-4 rounded-full mb-6">
                    {path.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg text-fepv-darkblue mb-3">
                    {path.title}
                  </h3>
                  <p className="text-xs text-fepv-gray/80 leading-relaxed mb-6">
                    {path.desc}
                  </p>
                </div>
                <Link
                  href={path.href}
                  className="w-full fepv-btn fepv-btn-primary py-2.5 text-xs font-bold"
                >
                  {path.btnText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE 9: COOPERACIÓN INTERNACIONAL */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <span className="text-xs font-bold text-fepv-blue uppercase tracking-wider block">
            Cooperación y Alianzas Estratégicas
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-fepv-darkblue max-w-2xl mx-auto leading-tight">
            Creemos en las alianzas para lograr transformaciones sostenibles
          </h2>
          <p className="font-sans text-base text-fepv-gray/85 max-w-3xl mx-auto leading-relaxed">
            Nuestros estatutos y objeto social facultan a la Fundación Encuentros Para la Vida para cooperar de manera directa con entidades públicas, empresas privadas, agencias internacionales, y organismos multilaterales en pro del desarrollo integral de las comunidades en Colombia.
          </p>
          
          <div className="p-8 bg-fepv-light/30 rounded-3xl border border-fepv-green/10 max-w-3xl mx-auto text-left">
            <h4 className="font-display font-bold text-sm text-fepv-darkblue mb-4 uppercase tracking-wider">
              Buscamos alianzas y cooperación en:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-semibold text-fepv-darkblue/90">
              <div className="flex items-center gap-2">🟢 Cofinanciación de proyectos</div>
              <div className="flex items-center gap-2">🟢 Cooperación Técnica</div>
              <div className="flex items-center gap-2">🟢 Voluntariado Profesional</div>
              <div className="flex items-center gap-2">🟢 Transferencia de Saberes</div>
              <div className="flex items-center gap-2">🟢 Ejecución de Convenios</div>
              <div className="flex items-center gap-2">🟢 Proyectos de Impacto Social</div>
            </div>
          </div>

          <div className="pt-4">
            <Link href="/participa?rol=aliado" className="fepv-btn fepv-btn-primary cursor-pointer">
              Quiero ser aliado de FEPV
            </Link>
          </div>
        </div>
      </section>

      {/* BLOQUE 10: ACTUALIDAD Y BOLETÍN */}
      <section className="py-20 bg-fepv-light/10 border-t border-gray-100" id="actualidad">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Boletín Informativo */}
            <div className="lg:col-span-5 space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-display font-bold text-2xl text-fepv-darkblue">
                Boletín FEPV en Acción
              </h3>
              <p className="text-xs text-fepv-gray/80 leading-relaxed">
                Suscríbete para recibir informes trimestrales de actividades, resultados, rendición de cuentas e historias del territorio en tu correo electrónico.
              </p>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("¡Gracias por suscribirte al boletín de FEPV!");
                }}
                className="space-y-3"
              >
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Correo electrónico *"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-fepv-green bg-gray-50"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full fepv-btn fepv-btn-primary py-3 text-sm cursor-pointer"
                >
                  Suscribirme al Boletín
                </button>
              </form>
            </div>

            {/* Últimas Noticias */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="font-display font-bold text-2xl text-fepv-darkblue">
                Actualidad e Hitos FEPV
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                  <span className="text-3xl bg-fepv-light/50 p-3 rounded-xl flex items-center justify-center">📰</span>
                  <div className="space-y-1">
                    <span className="text-[10px] text-fepv-green font-bold">12 JUNIO, 2026 &bull; INSTITUCIONAL</span>
                    <h4 className="font-display font-bold text-base text-fepv-darkblue">
                      Registro oficial ante la Cámara de Comercio de Valledupar
                    </h4>
                    <p className="text-xs text-fepv-gray/80 leading-relaxed">
                      FEPV consolida su registro legal y personería jurídica para operar a nivel nacional.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                  <span className="text-3xl bg-fepv-light/50 p-3 rounded-xl flex items-center justify-center">🤝</span>
                  <div className="space-y-1">
                    <span className="text-[10px] text-fepv-green font-bold">02 JULIO, 2026 &bull; ALIANZAS</span>
                    <h4 className="font-display font-bold text-base text-fepv-darkblue">
                      Firma de primer pre-acuerdo de cooperación en Salud Mental
                    </h4>
                    <p className="text-xs text-fepv-gray/80 leading-relaxed">
                      Consolidamos mesas técnicas con profesionales locales para lanzar la red de apoyo psicosocial.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
