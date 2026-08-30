"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { fetchGlobalConfig, getDirectDriveImageUrl } from "../lib/api";

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState({
    logo_url: "",
    logo_url_formatted: "",
    nombre_fundacion: "Fundación Encuentros Para la Vida",
    sigla: "FEPV",
    telefono_contacto: "+57 316 689 9250",
    correo_contacto: "fundacion.epv.co@gmail.com",
    enlace_whatsapp: "https://wa.me/573166899250",
    direccion_fisica: "Agustín Codazzi, Cesar, Colombia",
    formato_hoja_vida: "https://docs.google.com/document/d/e/2PACX-1vSvhGd3raf0l8PJyLnqU49p8Qli10E8eR8Jbc-6vwyk9_Jgjj7WJDdAEmejgSVtPqTroDIXgJ8kMpxu/pub",
    enlace_formulario_web: ""
  });

  useEffect(() => {
    // 1. Cargar instantáneamente desde el caché local (si existe)
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("fepv_cache_global_config");
        const cached = null;
        if (cached) {
          const parsed = JSON.parse(cached);
          setConfig(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error("Error al leer caché local de configuración", e);
      }
    }

    async function loadConfig() {
      try {
        const data = await fetchGlobalConfig();
        if (data && Object.keys(data).length > 0) {
          const formatted = { ...data };
          if (data.logo_url) {
            formatted.logo_url_formatted = getDirectDriveImageUrl(data.logo_url);
          }
          setConfig(prev => ({ ...prev, ...formatted }));
          
          // Guardar en el caché local para la siguiente visita instantánea
          if (typeof window !== "undefined") {
            localStorage.setItem("fepv_cache_global_config", JSON.stringify(formatted));
          }
        }
      } catch (e) {
        console.error("Error cargando configuración global de Sheets:", e);
      }
    }
    loadConfig();
  }, []);

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}

export const useGlobalConfig = () => useContext(ConfigContext);
