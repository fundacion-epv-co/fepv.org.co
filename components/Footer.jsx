import Link from "next/link";
import Image from "next/image";
import logoImg from "../public/logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear() || 2026;

  return (
    <footer className="bg-fepv-darkblue text-white/90 border-t border-fepv-darkblue/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Columna 1: Identidad con LOGO REAL */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-2xl p-1 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={logoImg}
                  alt="Fundación Encuentros Para la Vida - FEPV"
                  fill
                  className="object-contain rounded-xl"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg text-white leading-none">
                  Fundación Encuentros
                </span>
                <span className="font-sans text-xs font-semibold text-fepv-orange tracking-wider uppercase mt-0.5">
                  Para la Vida
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/70 italic leading-relaxed">
              &ldquo;Encuentros que transforman vidas&rdquo;
            </p>
            {/* Redes Sociales */}
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="https://facebook.com/fundacion.epv.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-fepv-orange transition-colors duration-200"
                aria-label="Ir a Facebook de FEPV"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://instagram.com/fundacion.epv.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-fepv-orange transition-colors duration-200"
                aria-label="Ir a Instagram de FEPV"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" strokeLinecap="round"></line>
                </svg>
              </a>
              <a
                href="https://wa.me/573166899250"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-fepv-orange transition-colors duration-200"
                aria-label="Escribir al WhatsApp institucional de FEPV"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2: Nosotros */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm tracking-wider uppercase text-fepv-orange">
              Fundación
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/nosotros#quienes-somos" className="hover:text-white transition-colors">
                  ¿Quiénes Somos?
                </Link>
              </li>
              <li>
                <Link href="/nosotros#mision-vision" className="hover:text-white transition-colors">
                  Misión y Visión
                </Link>
              </li>
              <li>
                <Link href="/nosotros#equipo" className="hover:text-white transition-colors">
                  Nuestro Equipo
                </Link>
              </li>
              <li>
                <Link href="/nosotros#transparencia" className="hover:text-white transition-colors">
                  Transparencia Institucional
                </Link>
              </li>
              <li>
                <Link href="/nosotros#historia" className="hover:text-white transition-colors">
                  Nuestra Historia
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Programas */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm tracking-wider uppercase text-fepv-orange">
              Programas
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/programas#salud-mental" className="hover:text-white transition-colors">
                  Salud Mental y Psicología
                </Link>
              </li>
              <li>
                <Link href="/programas#educacion" className="hover:text-white transition-colors">
                  Educación y Formación
                </Link>
              </li>
              <li>
                <Link href="/programas#inclusion" className="hover:text-white transition-colors">
                  Inclusión y Derechos
                </Link>
              </li>
              <li>
                <Link href="/programas#ambiente" className="hover:text-white transition-colors">
                  Sostenibilidad Ambiental
                </Link>
              </li>
              <li>
                <Link href="/programas#bienestar-animal" className="hover:text-white transition-colors">
                  Bienestar Animal
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Participación */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm tracking-wider uppercase text-fepv-orange">
              Participa
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/donaciones" className="hover:text-white transition-colors">
                  Realizar una Donación
                </Link>
              </li>
              <li>
                <Link href="/participa?rol=voluntario" className="hover:text-white transition-colors">
                  Ser Voluntario
                </Link>
              </li>
              <li>
                <Link href="/participa?rol=aliado" className="hover:text-white transition-colors">
                  Ser Aliado Estratégico
                </Link>
              </li>
              <li>
                <Link href="/convocatorias" className="hover:text-white transition-colors">
                  Convocatorias Abiertas
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Línea Divisoria */}
        <hr className="border-fepv-green/20 my-10" />

        {/* Sección de Copyright y Enlaces Legales */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>
            &copy; {currentYear} Fundación Encuentros Para la Vida (FEPV). Todos los derechos reservados.
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/politica-privacidad" className="hover:text-white transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/tratamiento-datos" className="hover:text-white transition-colors">
              Tratamiento de Datos Personales
            </Link>
            <Link href="/terminos-condiciones" className="hover:text-white transition-colors">
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
