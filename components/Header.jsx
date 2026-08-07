"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logoImg from "../public/logo.png";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'nosotros' | 'programas' | null
  const pathname = usePathname();

  const handleDropdownToggle = (name) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  const navLinks = [
    { name: "Inicio", href: "/" },
    {
      name: "Nosotros",
      href: "/nosotros",
      submenu: [
        { name: "Quiénes Somos", href: "/nosotros#quienes-somos" },
        { name: "Misión y Visión", href: "/nosotros#mision-vision" },
        { name: "Enfoques", href: "/nosotros#enfoques" },
        { name: "Nuestra Historia", href: "/nosotros#historia" },
        { name: "Equipo", href: "/nosotros#equipo" },
        { name: "Transparencia", href: "/nosotros#transparencia" },
      ],
    },
    {
      name: "Programas",
      href: "/programas",
      submenu: [
        { name: "Salud Mental", href: "/programas#salud-mental" },
        { name: "Familias", href: "/programas#familias" },
        { name: "Educación", href: "/programas#educacion" },
        { name: "Inclusión y Derechos", href: "/programas#inclusion" },
        { name: "Medio Ambiente", href: "/programas#ambiente" },
        { name: "Bienestar Animal", href: "/programas#bienestar-animal" },
        { name: "Emprendimiento", href: "/programas#emprendimiento" },
        { name: "Cultura y Deporte", href: "/programas#cultura-deporte" },
      ],
    },
    { name: "Impacto", href: "/#impacto" },
    {
      name: "Oportunidades",
      href: "/convocatorias",
      submenu: [
        { name: "Convocatorias", href: "/convocatorias?cat=Convocatoria" },
        { name: "Ofertas de Empleo", href: "/convocatorias?cat=Empleo" },
      ],
    },
    { name: "Noticias", href: "/noticias" },
    { name: "Galería", href: "/galeria" },
    { name: "Participa", href: "/participa" },
    { name: "Contacto", href: "/contacto" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO FEPV — IMAGEN REAL */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none" aria-label="Volver a Inicio FEPV">
            <div className="relative w-14 h-14 flex-shrink-0 drop-shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Image
                src={logoImg}
                alt="Fundación Encuentros Para la Vida"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="font-display font-bold text-base text-fepv-darkblue tracking-tight leading-none uppercase">
                Fundación Encuentros
              </span>
              <span className="font-sans text-xs font-semibold text-fepv-vividgreen tracking-wider mt-0.5">
                Para la Vida
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Navegación principal">
            {navLinks.map((link) => {
              const hasSubmenu = !!link.submenu;
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/");

              if (hasSubmenu) {
                const isDropdownOpen = activeDropdown === link.name.toLowerCase();
                return (
                  <div 
                    key={link.name} 
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(link.name.toLowerCase())}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={`px-3 py-2 rounded-lg text-[15px] font-medium flex items-center gap-1 transition-colors duration-200 cursor-pointer ${
                        isActive ? "text-fepv-green" : "text-fepv-gray/80 hover:text-fepv-green hover:bg-fepv-light/30"
                      }`}
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="true"
                    >
                      {link.name}
                      <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute left-0 pt-2 w-56 z-50">
                        <div className="rounded-xl bg-white border border-gray-100 shadow-lg py-2 animate-in fade-in slide-in-from-top-1 duration-200">
                           {link.submenu.map((subitem) => (
                            <Link
                              key={subitem.name}
                              href={subitem.href}
                              prefetch={false}
                              onClick={() => setActiveDropdown(null)}
                              className="block px-4 py-2 text-[14px] text-fepv-gray hover:bg-fepv-light/40 hover:text-fepv-darkblue transition-colors duration-150"
                            >
                              {subitem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={false}
                  className={`px-3 py-2 rounded-lg text-[15px] font-medium transition-colors duration-200 ${
                    isActive ? "text-fepv-green" : "text-fepv-gray/80 hover:text-fepv-green hover:bg-fepv-light/30"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* DONATE BUTTON & MOBILE TOGGLE */}
          <div className="flex items-center gap-4">
            <Link
              href="/donaciones"
              prefetch={false}
              className="hidden sm:inline-flex fepv-btn fepv-btn-donate flex items-center gap-1.5"
            >
              DONAR <span className="text-red-500">❤️</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-fepv-darkblue hover:bg-fepv-light/30 focus:outline-none cursor-pointer"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-md py-4 z-40 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top duration-300">
          <div className="px-4 space-y-1">
            {navLinks.map((link) => {
              const hasSubmenu = !!link.submenu;
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/");

              if (hasSubmenu) {
                const isDropdownOpen = activeDropdown === link.name.toLowerCase();
                return (
                  <div key={link.name} className="py-1">
                    <button
                      onClick={() => handleDropdownToggle(link.name.toLowerCase())}
                      className="w-full text-left px-3 py-2 rounded-lg text-base font-semibold flex items-center justify-between text-fepv-gray"
                    >
                      {link.name}
                      <svg className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="pl-6 mt-1 space-y-1 border-l-2 border-fepv-green/30">
                        {link.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            href={subitem.href}
                            prefetch={false}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setActiveDropdown(null);
                            }}
                            className="block px-3 py-2 text-sm text-fepv-gray/80 hover:text-fepv-green"
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={false}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-semibold ${
                    isActive ? "text-fepv-green bg-fepv-light/20" : "text-fepv-gray hover:text-fepv-green"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-4 pb-2">
              <Link
                href="/donaciones"
                prefetch={false}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full fepv-btn fepv-btn-donate flex items-center justify-center gap-1.5 py-3 text-center"
              >
                DONAR <span className="text-red-500">❤️</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
