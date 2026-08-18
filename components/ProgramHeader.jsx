"use client";

import Link from "next/link";

/**
 * Componente ProgramHeader - Encabezado del programa
 * Muestra título, descripción y botón de volver
 */
export default function ProgramHeader({ program, isLoading }) {
  if (isLoading) {
    return (
      <div className="w-full bg-gradient-to-r from-fepv-blue to-fepv-darkblue py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 w-48 bg-white/20 rounded animate-pulse mb-4"></div>
          <div className="h-4 w-full bg-white/20 rounded animate-pulse max-w-md"></div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20 px-4 space-y-6">
        <span className="text-6xl">🔍</span>
        <h1 className="font-display font-bold text-2xl text-fepv-darkblue">Programa no encontrado</h1>
        <p className="text-sm text-fepv-gray/80 max-w-md text-center">
          La línea de acción o proyecto que buscas no está registrada en nuestro portafolio institucional.
        </p>
        <Link href="/programas" className="fepv-btn fepv-btn-primary py-2.5">
          Volver a programas
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-fepv-blue to-fepv-darkblue py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link 
          href="/programas" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
        >
          <span>←</span>
          <span className="text-sm font-medium">Volver a programas</span>
        </Link>
        
        <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
          {program.title || program.nombre || "Sin nombre"}
        </h1>
        
        {program.description || program.descripcion ? (
          <p className="text-white/90 text-lg max-w-3xl">
            {program.description || program.descripcion}
          </p>
        ) : null}
      </div>
    </div>
  );
}
