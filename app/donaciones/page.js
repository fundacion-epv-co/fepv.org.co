"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchGoogleSheetData, GOOGLE_SHEETS_METAS_DONACION_CSV } from "../../lib/api";

export default function Donaciones() {
  const [frequency, setFrequency] = useState("unica"); // 'unica' | 'recurrente'
  const [selectedValue, setSelectedValue] = useState("100000"); // preset values
  const [customValue, setCustomValue] = useState("");
  const [simulatedSubmit, setSimulatedSubmit] = useState(false);

  // Estados del Termómetro
  const [meta, setMeta] = useState(10000000); // 10 millones por defecto
  const [recaudado, setRecaudado] = useState(3500000); // 3.5 millones por defecto
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);

  useEffect(() => {
    async function loadMetaDonaciones() {
      setIsLoadingMeta(true);
      try {
        const data = await fetchGoogleSheetData(GOOGLE_SHEETS_METAS_DONACION_CSV);
        if (data && data.length > 0) {
          const row = data[0];
          const mVal = parseInt(row.meta_mensual, 10);
          const rVal = parseInt(row.recaudado_actual, 10);
          if (!isNaN(mVal) && mVal > 0) setMeta(mVal);
          if (!isNaN(rVal)) setRecaudado(rVal);
        }
      } catch (e) {
        console.error("Error cargando metas de donaciones", e);
      }
      setIsLoadingMeta(false);
    }
    loadMetaDonaciones();
  }, []);

  const presets = [
    { value: "20000", label: "$20.000" },
    { value: "50000", label: "$50.000" },
    { value: "100000", label: "$100.000" },
    { value: "200000", label: "$200.000" }
  ];

  const handlePresetSelect = (val) => {
    setSelectedValue(val);
    setCustomValue("");
  };

  const handleCustomChange = (e) => {
    setCustomValue(e.target.value);
    setSelectedValue("");
  };

  const handleDonateSubmit = (e) => {
    e.preventDefault();
    setSimulatedSubmit(true);
    setTimeout(() => {
      setSimulatedSubmit(false);
    }, 5000);
  };

  const finalAmount = customValue ? parseInt(customValue) : parseInt(selectedValue) || 0;

  const budgetAllocation = [
    { area: "Programas de Salud Mental y Apoyo Psicosocial", pct: 60, color: "bg-fepv-green" },
    { area: "Material Pedagógico y Capacitación", pct: 20, color: "bg-fepv-blue" },
    { area: "Actividades Comunitarias y Conservación", pct: 10, color: "bg-fepv-orange" },
    { area: "Bienestar y Protección Animal", pct: 10, color: "bg-red-400" }
  ];

  return (
    <div className="w-full bg-white pb-20">
      
      {/* Banner Superior */}
      <section className="bg-fepv-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="font-display font-bold text-3xl sm:text-4.5xl">
            Tu Aporte Transforma Vidas
          </h1>
          <p className="font-sans text-sm sm:text-base text-fepv-light max-w-2xl mx-auto leading-relaxed">
            Cada aporte económico nos permite sostener y ampliar las acciones terapéuticas, formativas e inclusivas de FEPV en Agustín Codazzi.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Formulario de Donación (Lado Izquierdo) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-150 shadow-md space-y-6">
            <h2 className="font-display font-bold text-xl text-fepv-darkblue">
              Simulador de Aporte
            </h2>

            {simulatedSubmit ? (
              <div className="p-8 bg-fepv-light/60 border border-fepv-green/20 rounded-2xl text-center space-y-4 animate-in fade-in duration-300">
                <span className="text-4xl block">🙌</span>
                <h3 className="font-display font-bold text-base text-fepv-darkblue">¡Gracias por tu intención de apoyo!</h3>
                <p className="text-xs text-fepv-gray/80 leading-relaxed">
                  Has seleccionado una donación {frequency === "unica" ? "única" : "mensual"} por valor de <strong>${finalAmount.toLocaleString("es-CO")} COP</strong>. 
                </p>
                <div className="p-4 bg-white rounded-xl text-left border border-fepv-green/10 text-xs space-y-2 max-w-md mx-auto">
                  <p className="font-bold text-fepv-darkblue text-center mb-1">Para completar tu transferencia bancaria directa:</p>
                  <p>🏦 <strong>Banco:</strong> Bancolombia (Ahorros)</p>
                  <p>🔢 <strong>Cuenta:</strong> 123-456789-01 (FEPV)</p>
                  <p>📱 <strong>Nequi / Daviplata:</strong> 300 000 0000</p>
                  <p>📧 <strong>Confirmación:</strong> Envía tu comprobante a <strong>fundacion.epv.co@gmail.com</strong> para emitir tu certificado de donación deducible de impuestos.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSimulatedSubmit(false)}
                  className="fepv-btn fepv-btn-secondary text-xs py-2 px-6"
                >
                  Volver a calcular
                </button>
              </div>
            ) : (
              <form onSubmit={handleDonateSubmit} className="space-y-6 text-xs sm:text-sm">
                
                {/* Frecuencia Selector */}
                <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-150">
                  <button
                    type="button"
                    onClick={() => setFrequency("unica")}
                    className={`flex-1 py-3 text-center rounded-xl font-bold cursor-pointer transition-colors ${
                      frequency === "unica" ? "bg-white text-fepv-green shadow-sm" : "text-fepv-gray/60 hover:text-fepv-darkblue"
                    }`}
                  >
                    Donación Única
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency("recurrente")}
                    className={`flex-1 py-3 text-center rounded-xl font-bold cursor-pointer transition-colors ${
                      frequency === "recurrente" ? "bg-white text-fepv-green shadow-sm" : "text-fepv-gray/60 hover:text-fepv-darkblue"
                    }`}
                  >
                    Aporte Mensual Recurrente
                  </button>
                </div>

                {/* Pre-sets */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-fepv-darkblue">Selecciona un monto (COP):</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {presets.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => handlePresetSelect(preset.value)}
                        className={`py-3.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                          selectedValue === preset.value
                            ? "bg-fepv-green text-white border-fepv-green shadow-sm shadow-fepv-green/10 scale-105"
                            : "bg-white border-gray-200 text-fepv-gray hover:bg-fepv-light/20"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Value */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-fepv-darkblue">O ingresa otro valor (COP):</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-fepv-gray/60 font-bold">$</span>
                    <input
                      type="number"
                      min="5000"
                      step="1000"
                      value={customValue}
                      onChange={handleCustomChange}
                      placeholder="Monto personalizado"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-fepv-green"
                    />
                  </div>
                </div>

                {finalAmount > 0 && (
                  <div className="p-4 bg-fepv-light/40 rounded-2xl border border-fepv-green/10 text-center">
                    <p className="text-xs text-fepv-gray">Monto final a aportar:</p>
                    <p className="text-xl sm:text-2xl font-display font-bold text-fepv-darkblue mt-1">
                      ${finalAmount.toLocaleString("es-CO")} COP {frequency === "recurrente" && "/ Mes"}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={finalAmount <= 0}
                  className="w-full fepv-btn fepv-btn-donate flex items-center justify-center gap-1.5 py-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  PROCEDER A DONAR <span className="text-red-500">❤️</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Impacto de Donación (Lado Derecho) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Termómetro de Donaciones */}
          {!isLoadingMeta && meta > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50/50 to-white shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📈</span>
                <div>
                  <h3 className="font-display font-bold text-base text-fepv-darkblue">
                    Termómetro de Solidaridad
                  </h3>
                  <p className="text-[10px] text-fepv-green font-bold uppercase tracking-wider">
                    Meta de Recaudación Mensual
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-fepv-darkblue">
                  <span>Recaudado: ${recaudado.toLocaleString("es-CO")}</span>
                  <span>Meta: ${meta.toLocaleString("es-CO")}</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-250/20">
                  <div 
                    className="h-full bg-gradient-to-r from-fepv-green to-fepv-vividgreen rounded-full transition-all duration-1000 shadow-inner flex items-center justify-end pr-2"
                    style={{ width: `${Math.min(100, Math.round((recaudado / meta) * 100))}%` }}
                  >
                    {Math.min(100, Math.round((recaudado / meta) * 100)) > 10 && (
                      <span className="text-[8px] font-black text-white leading-none">
                        {Math.min(100, Math.round((recaudado / meta) * 100))}%
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-[10px] text-fepv-gray/70 text-center font-medium italic pt-1">
                  ¡Llevamos el <strong>{Math.min(100, Math.round((recaudado / meta) * 100))}%</strong> de la meta gracias a tu ayuda!
                </p>
              </div>
            </div>
          )}
          
          {/* Destino de los recursos */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-lg text-fepv-darkblue">
              ¿A dónde van tus recursos?
            </h3>
            <p className="text-xs text-fepv-gray/80 leading-relaxed">
              En FEPV la transparencia es un enfoque fundamental. Exponemos el destino promedio de cada peso recibido mediante donaciones de particulares.
            </p>

            {/* CSS Bar graph */}
            <div className="space-y-4">
              {budgetAllocation.map((alloc, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-fepv-darkblue">
                    <span className="truncate pr-4">{alloc.area}</span>
                    <span>{alloc.pct}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${alloc.color}`}
                      style={{ width: `${alloc.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deducción tributaria */}
          <div className="bg-fepv-light/20 p-6 rounded-3xl border border-fepv-green/10 space-y-3">
            <h4 className="font-display font-bold text-sm text-fepv-darkblue">🛡️ Deducción de Impuestos</h4>
            <p className="text-xs text-fepv-gray/80 leading-relaxed">
              Como Entidad Sin Ánimo de Lucro (ESAL) inscrita, todas las donaciones a la Fundación Encuentros Para la Vida otorgan derecho a un descuento tributario en el impuesto sobre la renta en Colombia de conformidad con el Artículo 257 del Estatuto Tributario.
            </p>
            <p className="text-[10px] text-fepv-green font-bold">
              &bull; Emitimos certificados anuales de donación.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}
