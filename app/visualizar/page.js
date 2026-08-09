"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VisualizarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileUrl = searchParams.get("url") || "";
  const fileTitle = searchParams.get("title") || "Documento";

  const [viewerUrl, setViewerUrl] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!fileUrl) return;

    // Helper para verificar y formatear enlaces de Google Drive
    // Formato estándar: drive.google.com/file/d/ID/view o drive.google.com/open?id=ID
    const driveRegex = /(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=)([^/?\s]+)/;
    const match = fileUrl.match(driveRegex);

    if (match && match[1]) {
      const fileId = match[1];
      // Usar el reproductor/visor interactivo integrado de Google Drive para iframes
      setViewerUrl(`https://drive.google.com/file/d/${fileId}/preview`);
    } else {
      // Para otros archivos (Direct PDFs, Word .docx, .doc, .xlsx, .pptx)
      // Usamos el visor oficial de Google Docs para incrustar sin forzar descarga
      setViewerUrl(`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`);
    }
  }, [fileUrl]);

  if (!fileUrl) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-4">
        <span className="text-5xl">⚠️</span>
        <h2 className="font-display font-bold text-xl text-fepv-darkblue">No se proporcionó ningún archivo</h2>
        <p className="text-xs text-fepv-gray/80">
          La URL del documento es inválida o no se especificó correctamente.
        </p>
        <button 
          onClick={() => router.back()}
          className="fepv-btn fepv-btn-primary py-2 text-xs"
        >
          Volver atrás
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Barra de herramientas del Visor */}
        <div className="bg-white border border-gray-150 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="space-y-1 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-fepv-green uppercase tracking-widest bg-fepv-light px-2.5 py-0.5 rounded inline-block">
              Visor de Archivos FEPV
            </span>
            <h1 className="font-display font-bold text-base sm:text-lg text-fepv-darkblue truncate max-w-md" title={fileTitle}>
              {fileTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => router.back()}
              className="text-xs font-bold text-fepv-gray hover:text-fepv-darkblue px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
            >
              &larr; Volver
            </button>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="fepv-btn fepv-btn-primary text-xs py-2 px-5 font-bold shadow-sm whitespace-nowrap"
            >
              Abrir Original ↗
            </a>
          </div>
        </div>

        {/* Marco del visor (iframe) */}
        <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-md relative min-h-[75vh] w-full flex items-center justify-center">
          {viewerUrl ? (
            <iframe
              src={viewerUrl}
              className="absolute inset-0 w-full h-full border-0"
              allow="autoplay"
              title={fileTitle}
              onError={() => setError(true)}
            ></iframe>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-2 border-fepv-green border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-fepv-gray/70">Cargando visor del documento...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 text-center space-y-4">
              <span className="text-4xl">📭</span>
              <h3 className="font-bold text-sm text-fepv-darkblue">No se pudo cargar la vista previa</h3>
              <p className="text-xs text-fepv-gray/70 max-w-sm">
                Este archivo no permite previsualización directa o requiere permisos de acceso. Prueba abriendo el archivo original.
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="fepv-btn fepv-btn-primary py-2 text-xs"
              >
                Abrir Archivo Original
              </a>
            </div>
          )}
        </div>

        {/* Advertencia / Nota */}
        <p className="text-[10px] text-center text-fepv-gray/50 italic">
          Nota: Los visores interactivos son proporcionados por Google Drive/Docs. Asegúrate de tener una conexión a internet activa para visualizar el contenido.
        </p>

      </div>
    </div>
  );
}

export default function Visualizar() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center py-40 space-y-4">
        <div className="w-12 h-12 border-4 border-fepv-light border-t-fepv-vividgreen rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-fepv-darkblue">Preparando visor de archivos...</p>
      </div>
    }>
      <VisualizarContent />
    </Suspense>
  );
}
