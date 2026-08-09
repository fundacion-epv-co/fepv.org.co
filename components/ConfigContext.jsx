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
    correo_contacto: "contacto@fundacionepv.co",
    enlace_whatsapp: "https://wa.me/573166899250"
  });

  useEffect(() => {
    // 1. Cargar instantáneamente desde el caché local (si existe)
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("fepv_cache_global_config");
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
