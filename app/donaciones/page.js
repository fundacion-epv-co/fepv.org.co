"use client";

import { useState, useEffect } from "react";
import { useGlobalConfig } from "../../components/ConfigContext";

export default function Donaciones() {
  const config = useGlobalConfig();
  
  const [frequency, setFrequency] = useState("unica");
  const [selectedValue, setSelectedValue] = useState("100000");
  const [customValue, setCustomValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    documento: "",
    telefono: "",
    correo: "",
  });

  // Cargar meta y recaudado desde la configuración global limpiando el formato moneda ($100,000.00)
  const cleanCurrency = (val) => {
    if (!val) return "";
    return String(val).replace(/[$\\s,]/g, '').split('.')[0];
  };

  const meta = parseInt(cleanCurrency(config?.meta_donaciones)) || 5000000;
  const recaudado = parseInt(cleanCurrency(config?.total_donaciones_recibidas)) || 0;
  const progressPercent = Math.min(100, Math.round((recaudado / meta) * 100)) || 0;

  let presets = [];
  if (config?.valores_donacion) {
    presets = config.valores_donacion.split(',').map(val => {
      const num = val.trim();
      return { value: num, label: "$" + parseInt(num).toLocaleString('es-CO') };
    });
  } else {
    presets = [
      { value: "20000", label: "$20.000" },
      { value: "50000", label: "$50.000" },
      { value: "100000", label: "$100.000" },
      { value: "200000", label: "$200.000" }
    ];
  }

  const handlePresetSelect = (val) => {
    setSelectedValue(val);
    setCustomValue("");
  };

  const handleCustomChange = (e) => {
    setCustomValue(e.target.value);
    setSelectedValue("");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const finalAmount = customValue ? parseInt(customValue) : parseInt(selectedValue) || 0;

  const handleDonateSubmit = async (e) => {
    e.preventDefault();
    if (finalAmount <= 0) return alert("Por favor selecciona un monto válido.");
    
    setSubmitting(true);
    
    if (config?.enlace_formulario_web) {
      try {
        const payload = {
          Rol: "DONANTE",
          monto: finalAmount,
          nombre: formData.nombre,
          documento: formData.documento,
          telefono: formData.telefono,
          correo: formData.correo
        };

        await fetch(config.enlace_formulario_web, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          mode: 'no-cors'
        });

        setSuccessMessage(true);
        setFormData({ nombre: "", documento: "", telefono: "", correo: "" });
      } catch (error) {
        console.error("Error al enviar intención de donación:", error);
        alert("Ocurrió un error al enviar tu solicitud. Intenta nuevamente.");
      } finally {
        setSubmitting(false);
      }
    } else {
      alert("Error: El sistema no tiene configurado el enlace del servidor. Intenta más tarde.");
      setSubmitting(false);
    }
  };

  const [budgetAllocation, setBudgetAllocation] = useState([]);

  useEffect(() => {
    async function loadFondos() {
      try {
        const { fetchTransparenciaFondos } = await import('../../lib/api');
        const data = await fetchTransparenciaFondos();
        if (data && data.length > 0) {
          setBudgetAllocation(data.map(item => ({
            area: item.categoria || item.descripcion || "",
            pct: parseInt(item.porcentaje) || 0,
            color: item.color || "bg-fepv-green"
          })));
        } else {
          // Fallback
          setBudgetAllocation([
            { area: config?.prog1_nombre || "Programas de Salud Mental y Apoyo Psicosocial", pct: parseInt(config?.prog1_pct) || 60, color: "bg-fepv-green" },
            { area: config?.prog2_nombre || "Material Pedagógico y Capacitación", pct: parseInt(config?.prog2_pct) || 20, color: "bg-fepv-blue" },
            { area: config?.prog3_nombre || "Actividades Comunitarias y Conservación", pct: parseInt(config?.prog3_pct) || 10, color: "bg-fepv-orange" },
            { area: config?.prog4_nombre || "Gestión Administrativa y Logística", pct: parseInt(config?.prog4_pct) || 10, color: "bg-gray-400" }
          ]);
        }
      } catch (e) {
        console.error("Error fetching fondos", e);
      }
    }
    loadFondos();
  }, [config]);

  return (
    <div className="w-full bg-white pb-20">
      
      {/* Banner Superior */}
      <section className="bg-fepv-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="font-display font-bold text-3xl sm:text-4.5xl">
            Tu Aporte Transforma Vidas
          </h1>
          <p className="font-sans text-sm sm:text-base text-fepv-light max-w-2xl mx-auto leading-relaxed">
            Cada aporte económico nos permite sostener y ampliar las acciones terapéuticas, formativas e inclusivas de FEPV.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Formulario de Donación (Lado Izquierdo) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-150 shadow-md space-y-6">
            <h2 className="font-display font-bold text-xl text-fepv-darkblue">
              Registro de Aporte Solidario
            </h2>

            {successMessage ? (
              <div className="p-8 bg-gradient-to-r from-fepv-light/60 to-white border border-fepv-green/30 rounded-3xl text-center space-y-4 shadow-sm animate-in fade-in">
                <span className="text-5xl block mb-2">💌</span>
                <h3 className="font-display font-bold text-lg text-fepv-darkblue">¡Revisa tu correo electrónico!</h3>
                <p className="text-xs text-fepv-gray/80 leading-relaxed max-w-md mx-auto">
                  Hemos registrado tu intención de donar <strong>${finalAmount.toLocaleString("es-CO")} COP</strong>. 
                  Te acabamos de enviar un correo de forma privada con los <strong>números de cuenta bancaria y el código QR oficial</strong> de la fundación.
                </p>
                <div className="p-4 bg-amber-50 rounded-xl text-left border border-amber-200 text-xs mt-4 max-w-sm mx-auto">
                  <p className="font-bold text-amber-900 mb-1">📸 No olvides el comprobante:</p>
                  <p className="text-amber-800">Una vez hagas la transferencia, responde al correo enviando el pantallazo o comprobante para emitir tu certificado y sumar tu aporte a nuestro termómetro.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSuccessMessage(false)}
                  className="mt-4 fepv-btn fepv-btn-secondary text-xs py-2 px-6"
                >
                  Registrar otra donación
                </button>
              </div>
            ) : (
              <form onSubmit={handleDonateSubmit} className="space-y-6 text-xs sm:text-sm">
                
                {/* 1. SELECCIÓN DE MONTO */}
                <div className="space-y-4">
                  <h3 className="font-bold text-fepv-green text-xs uppercase tracking-wider">1. Selecciona el monto</h3>
                  
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

                  <div className="relative max-w-sm">
                    <span className="absolute left-4 top-3 text-fepv-gray/60 font-bold">$</span>
                    <input
                      type="number"
                      min="5000"
                      step="1000"
                      value={customValue}
                      onChange={handleCustomChange}
                      placeholder="O ingresa otro valor (COP)"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-fepv-green text-xs"
                    />
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* 2. DATOS DEL DONANTE */}
                <div className="space-y-4">
                  <h3 className="font-bold text-fepv-green text-xs uppercase tracking-wider">2. Tus datos personales</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-fepv-darkblue mb-1">Nombre Completo *</label>
                      <input type="text" required name="nombre" value={formData.nombre} onChange={handleInputChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green text-xs"
                        placeholder="Ej. María Pérez" />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-fepv-darkblue mb-1">Cédula o NIT *</label>
                      <input type="text" required name="documento" value={formData.documento} onChange={handleInputChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green text-xs"
                        placeholder="Documento de identidad" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-fepv-darkblue mb-1">Celular / WhatsApp *</label>
                      <input type="tel" required name="telefono" value={formData.telefono} onChange={handleInputChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green text-xs"
                        placeholder="300 000 0000" />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-fepv-darkblue mb-1">Correo Electrónico *</label>
                      <input type="email" required name="correo" value={formData.correo} onChange={handleInputChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green text-xs"
                        placeholder="maria@ejemplo.com" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl text-[10px] sm:text-xs text-fepv-gray/80 italic text-justify">
                  Al hacer clic en "Recibir Cuentas para Donar", te enviaremos por correo las instrucciones bancarias de forma privada. La Fundación protegerá tus datos conforme a la Ley 1581 de 2012.
                </div>

                <button
                  type="submit"
                  disabled={finalAmount <= 0 || submitting}
                  className="w-full fepv-btn fepv-btn-donate flex items-center justify-center gap-1.5 py-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-bold shadow-lg"
                >
                  {submitting ? "PROCESANDO..." : `RECIBIR CUENTAS PARA DONAR $${finalAmount.toLocaleString("es-CO")} ❤️`}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Impacto de Donación (Lado Derecho) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Termómetro de Donaciones */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50/50 to-white shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📈</span>
              <div>
                <h3 className="font-display font-bold text-base text-fepv-darkblue">
                  Termómetro de Solidaridad
                </h3>
                <p className="text-[10px] text-fepv-green font-bold uppercase tracking-wider">
                  Meta de Recaudación Actual
                </p>
              </div>
            </div>
            
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between text-xs font-bold text-fepv-darkblue">
                <span>Recaudado: ${recaudado.toLocaleString("es-CO")}</span>
                <span>Meta: ${meta.toLocaleString("es-CO")}</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-4 bg-white rounded-full overflow-hidden p-0.5 border border-amber-200 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-fepv-green to-fepv-vividgreen rounded-full transition-all duration-1000 flex items-center justify-end pr-2 relative overflow-hidden"
                  style={{ width: `${Math.max(5, progressPercent)}%` }}
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
                  {progressPercent > 10 && (
                    <span className="text-[8px] font-black text-white leading-none relative z-10">
                      {progressPercent}%
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-[10px] text-fepv-gray/70 text-center font-medium italic pt-1">
                ¡Llevamos el <strong>{progressPercent}%</strong> de la meta gracias a tu ayuda!
              </p>
            </div>
          </div>
          
          {/* Destino de los recursos */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-lg text-fepv-darkblue">
              ¿A dónde van tus recursos?
            </h3>
            <p className="text-xs text-fepv-gray/80 leading-relaxed">
              En FEPV la transparencia es un enfoque fundamental. Exponemos el destino promedio de cada peso recibido mediante donaciones de particulares.
            </p>

            <div className="space-y-4">
              {budgetAllocation.map((alloc, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs font-semibold text-fepv-darkblue">
                    <span className="truncate pr-4">{alloc.area}</span>
                    <span>{alloc.pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
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
            <p className="text-xs text-fepv-gray/80 leading-relaxed text-justify">
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
