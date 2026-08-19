"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VisualizarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileUrl = searchParams.get("url") || "";
  const fileTitle = searchParams.get("title") || "Documento";
  const isProtected = searchParams.get("protected") === "true";

  const [viewerUrl, setViewerUrl] = useState("");
  const [error, setError] = useState(false);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      window.close();
      // En caso de que el navegador bloquee window.close()
      setTimeout(() => { router.push("/"); }, 300);
    }
  };

  useEffect(() => {
    if (!fileUrl) return;

    const driveRegex = /(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=)([^/?\s]+)/;
    const docsRegex = /(?:docs\.google\.com\/(?:document|spreadsheets|presentation)\/d\/)([^/?\s]+)/;

    const driveMatch = fileUrl.match(driveRegex);
    const docsMatch = fileUrl.match(docsRegex);

    if (driveMatch && driveMatch[1]) {
      const fileId = driveMatch[1];
      setViewerUrl(`https://drive.google.com/file/d/${fileId}/preview?rm=minimal`);
    } else if (docsMatch && docsMatch[1]) {
      const fileId = docsMatch[1];
      const isDoc = fileUrl.includes('/document/');
      const isSheet = fileUrl.includes('/spreadsheets/');
      const isPres = fileUrl.includes('/presentation/');
      
      const type = isDoc ? 'document' : isSheet ? 'spreadsheets' : 'presentation';
      setViewerUrl(`https://docs.google.com/${type}/d/${fileId}/preview`);
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
              onClick={handleBack}
              className="text-xs font-bold text-fepv-gray hover:text-fepv-darkblue px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
            >
              &larr; Volver
            </button>
            {!isProtected && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="fepv-btn fepv-btn-primary text-xs py-2 px-5 font-bold shadow-sm whitespace-nowrap"
              >
                Abrir Original ↗
              </a>
            )}
            {isProtected && (
              <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Documento Protegido
              </span>
            )}
          </div>
        </div>

        {/* Marco del visor (iframe) */}
        <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-md relative min-h-[75vh] w-full flex items-center justify-center">
          {isProtected && (
            <>
              {/* Bloqueador de clic para la esquina superior derecha (botón ventana emergente Drive) */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-transparent z-20 cursor-not-allowed"></div>
              <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden flex flex-col justify-around items-center opacity-[0.05] rotate-[-30deg]">
              {Array.from({ length: 15 }).map((_, i) => (
                <span key={i} className="text-4xl sm:text-6xl font-black whitespace-nowrap text-fepv-darkblue uppercase tracking-[1em]">
                  DOCUMENTO PROTEGIDO POR FEPV
                </span>
              ))}
            </div>
            </>
          )}

          {viewerUrl ? (
            <iframe
              src={viewerUrl}
              className="absolute inset-0 w-full h-full border-0 z-0"
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
