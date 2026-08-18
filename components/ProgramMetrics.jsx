"use client";

/**
 * Componente ProgramMetrics - Muestra métricas clave del programa
 * Renderiza indicadores y cifras de impacto
 */
export default function ProgramMetrics({ program, isLoading }) {
  if (isLoading || !program) return null;

  // Extraer indicadores del programa
  const indicators = program.indicators || [];
  const ods = program.ods || [];
  
  // Renderizar solo si hay datos
  if (indicators.length === 0 && ods.length === 0) return null;

  return (
    <section className="w-full bg-white py-12 px-4 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        {/* Indicadores */}
        {indicators.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display font-bold text-2xl text-fepv-darkblue mb-6">
              Indicadores de Impacto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {indicators.slice(0, 6).map((indicator, idx) => (
                <div 
                  key={idx}
                  className="bg-gradient-to-br from-fepv-blue/10 to-fepv-darkblue/10 rounded-lg p-6 border border-fepv-blue/20"
                >
                  <p className="text-sm text-fepv-gray mb-2">{indicator.name || `Indicador ${idx + 1}`}</p>
                  <p className="text-3xl font-bold text-fepv-darkblue">
                    {indicator.value || "—"}
                  </p>
                  {indicator.description && (
                    <p className="text-xs text-fepv-gray/70 mt-2">{indicator.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ODS Relacionados */}
        {ods.length > 0 && (
          <div>
            <h2 className="font-display font-bold text-2xl text-fepv-darkblue mb-6">
              Objetivos de Desarrollo Sostenible
            </h2>
            <div className="flex flex-wrap gap-3">
              {ods.map((odNumber, idx) => (
                <div
                  key={idx}
                  className="bg-fepv-blue text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                  ODS {odNumber}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
