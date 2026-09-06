"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGlobalConfig } from "../../../components/ConfigContext";

export default function IntranetConsultorio() {
  const router = useRouter();
  const config = useGlobalConfig();
  const [user, setUser] = useState(null);
  
  const [busqueda, setBusqueda] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [evolucion, setEvolucion] = useState("");
  const [status, setStatus] = useState({ loading: false, success: "", error: "" });

  useEffect(() => {
    // Validar acceso (Igual que en intranet principal)
    const storedUser = sessionStorage.getItem("fepv_intranet_user");
    if (!storedUser) {
      router.push("/intranet");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!busqueda) return;
    
    setStatus({ loading: true, success: "", error: "" });
    // Aquí idealmente haríamos un fetch GET a una hoja de Sheets de pacientes.
    // Como mock para visualización rápida:
    setTimeout(() => {
      setPaciente({
        nombre: "Paciente de prueba",
        documento: busqueda,
        servicio: "Psicología",
        historial: []
      });
      setStatus({ loading: false, success: "", error: "" });
    }, 1000);
  };

  const handleGuardarEvolucion = async (e) => {
    e.preventDefault();
    if (!evolucion || !paciente) return;
    
    setStatus({ loading: true, success: "", error: "" });
    
    try {
      const SCRIPT_URL = config?.script_url || "https://script.google.com/macros/s/AKfycbz_REPLACE_ME/exec";
      
      const payload = {
        action: "guardar_evolucion",
        datos: {
          documento: paciente.documento,
          profesional: user?.nombre || "Profesional",
          notas: evolucion,
          fecha: new Date().toISOString()
        }
      };

      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      setStatus({ loading: false, success: "Evolución guardada correctamente.", error: "" });
      setEvolucion("");
    } catch (err) {
      setStatus({ loading: false, success: "", error: "Error al guardar evolución." });
    }
  };

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"><div className="w-8 h-8 border-4 border-fepv-green border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-fepv-darkblue text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Gestión de Consultorio</h1>
            <p className="text-sm text-gray-300">Bienvenido/a, {user.nombre} ({user.rol})</p>
          </div>
          <button onClick={() => router.push("/intranet")} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
            Volver a Inicio
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* BUSCADOR */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg text-fepv-darkblue mb-4">Buscar Paciente</h2>
            <form onSubmit={handleBuscar} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Documento de Identidad</label>
                <input 
                  type="text" 
                  value={busqueda} 
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Ej. 10677..." 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-fepv-green text-sm"
                />
              </div>
              <button disabled={status.loading} type="submit" className="w-full py-2.5 bg-fepv-blue hover:bg-[#1d4ed8] text-white rounded-lg text-sm font-bold transition-colors">
                {status.loading ? "Buscando..." : "Buscar Historial"}
              </button>
            </form>
          </div>

          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
            <h3 className="font-bold text-amber-900 text-sm mb-2">Agenda del Día</h3>
            <p className="text-xs text-amber-800">
              * La agenda se lee automáticamente de la pestaña <strong>Consultorio_Agenda</strong> de Sheets.
            </p>
          </div>
        </div>

        {/* DETALLE PACIENTE Y EVOLUCIÓN */}
        <div className="lg:col-span-8">
          {paciente ? (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
                <div>
                  <h2 className="font-display font-bold text-2xl text-fepv-darkblue">{paciente.nombre}</h2>
                  <p className="text-sm text-gray-500">Documento: {paciente.documento} | Servicio: {paciente.servicio}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">Activo</span>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-fepv-darkblue mb-4">Ingresar Evolución</h3>
                
                {status.success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">{status.success}</div>}
                {status.error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{status.error}</div>}
                
                <form onSubmit={handleGuardarEvolucion} className="space-y-4">
                  <textarea 
                    rows="6"
                    value={evolucion}
                    onChange={(e) => setEvolucion(e.target.value)}
                    placeholder="Escribe las notas clínicas, valoración o seguimiento de la sesión actual..."
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-fepv-green text-sm resize-none"
                    required
                  ></textarea>
                  <div className="flex justify-end">
                    <button type="submit" disabled={status.loading} className="py-2.5 px-6 bg-fepv-green hover:bg-[#5da914] text-white rounded-lg text-sm font-bold transition-colors">
                      {status.loading ? "Guardando..." : "Guardar Registro"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400 border-dashed">
              <span className="text-5xl mb-4">🔍</span>
              <p className="text-sm">Busca un paciente por documento para ver y gestionar su historial.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
